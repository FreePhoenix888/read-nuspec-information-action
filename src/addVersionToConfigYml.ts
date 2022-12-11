
import path from 'path'
import {Octokit} from "@octokit/rest";

interface AddVersionToConfigYmlParams {
  githubClient: Octokit
  owner: string
  repository: string
  recipeName: string
  recipeFolder: string
  commitMessage: string
  version: string
  sourceRef: string
  destinationBranch: string
}

export async function addVersionToConfigYml({
  githubClient,
  owner,
  repository,
  recipeName,
  recipeFolder,
  commitMessage,
  version,
  sourceRef,
  destinationBranch
}: AddVersionToConfigYmlParams) {
  const configYmlPath = path.join(recipeName, 'config.yml')
  const {data} = await githubClient.repos.getContent({
    owner,
    repo: repository,
    path: configYmlPath,
    ref: sourceRef
  })

  if (Array.isArray(data)) {
    throw new Error(`${recipeName} must be a file, not a directory`)
  }

  if (!('content' in data)) {
    throw new Error(`Could not get content of a ${recipeName}`)
  }

  let content = new Buffer(data.content, 'base64').toString()
  content = `${content}\n  "${version}":\n    folder: ${recipeFolder}`

  await githubClient.repos.createOrUpdateFileContents({
    owner,
    repo: repository,
    path: configYmlPath,
    message: commitMessage,
    content: new Buffer(content).toString('base64'),
    branch: destinationBranch
  })
}
