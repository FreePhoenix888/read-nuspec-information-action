import crypto from 'crypto'
import path from 'path'
import {Octokit} from "@octokit/rest";

interface AddVersionToConandataYmlParams {
  githubClient: Octokit
  owner: string
  repository: string
  recipeName: string
  recipeFolder: string
  commitMessage: string
  version: string
  url: string
  sha256: string
  sourceRef: string
  destinationBranch: string
}

export async function addVersionToConandataYml({
  githubClient,
  owner,
  repository,
  recipeName,
  recipeFolder,
  commitMessage,
  version,
  url,
  sha256,
  sourceRef,
  destinationBranch
}: AddVersionToConandataYmlParams) {
  const {data} = await githubClient.repos.getContent({
    owner,
    repo: repository,
    path: path.join(recipeName, recipeFolder, 'conandata.yml'),
    ref: sourceRef
  })

  if (Array.isArray(data)) {
    throw new Error(`${recipeName} must be a file, not a directory`)
  }

  if (!('content' in data)) {
    throw new Error(`Could not get content of a ${recipeName}`)
  }

  let content = new Buffer(data.content, 'base64').toString()
  content = `${content}\n  "${version}":\n    url: ${url}\n    sha256: ${sha256}`

  await githubClient.repos.createOrUpdateFileContents({
    owner,
    repo: repository,
    path: recipeName,
    message: commitMessage,
    content: new Buffer(content).toString('base64'),
    branch: destinationBranch
  })
}
