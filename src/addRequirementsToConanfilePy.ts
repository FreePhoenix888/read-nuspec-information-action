import crypto from 'crypto'
import path from 'path'
import {Octokit} from "@octokit/rest";

interface AddRequirementsToConanfilePyParams {
  githubClient: Octokit
  owner: string
  repository: string
  recipeName: string
  recipeFolder: string
  commitMessage: string
  version: string
  url: string
  sha256: string
  dependencies: string[]
  sourceRef: string
  destinationBranch: string
}

export async function addRequirementsToConanfilePy({
  githubClient,
  owner,
  repository,
  recipeName,
  recipeFolder,
  commitMessage,
  version,
  url,
  sha256,
  dependencies,
  sourceRef,
  destinationBranch
}: AddRequirementsToConanfilePyParams) {




  const {data} = await githubClient.repos.getContent({
    owner,
    repo: repository,
    path: path.join(recipeName, recipeFolder, 'conanfile.py'),
    ref: sourceRef
  })

  if (Array.isArray(data)) {
    throw new Error(`${recipeName} must be a file, not a directory`)
  }

  if (!('content' in data)) {
    throw new Error(`Could not get content of a ${recipeName}`)
  }

  let content = new Buffer(data.content, 'base64').toString()
  content = content.replace(
    /^(?<indent> +)def requirements\(self\):\s+(pass)?/gm,
    `
$<indent>def requirements(self):
$<indent>$<indent>if tools.Version(self.version) == "0.4.0":
${dependencies
  .map(
    dependency => `$<indent>$<indent>$<indent>self.requires("${dependency}")`
  )
  .join('\n')}
$<indent>$<indent>
`.trim()
  )

  await githubClient.repos.createOrUpdateFileContents({
    owner,
    repo: repository,
    path: recipeName,
    message: commitMessage,
    content: new Buffer(content).toString('base64'),
    branch: destinationBranch
  })
}
