import * as core from '@actions/core'
import { Octokit } from '@octokit/rest';
import {Input, getInputs} from './getInputs'
import {addVersionToConfigYml} from './addVersionToConfigYml'
import {addVersionToConandataYml} from './addVersionToConandataYml'
import {addRequirementsToConanfilePy} from './addRequirementsToConanfilePy'


async function main() {
  const inputs = getInputs()

  const githubClient = new Octokit({auth: inputs[Input.Token]});

  await addVersionToConfigYml({
    githubClient,
    owner: inputs[Input.SourceRepositoryOwner],
    repository: inputs[Input.SourceRepositoryName],
    recipeName: inputs[Input.RecipeName],
    recipeFolder: inputs[Input.RecipeFolder],
    commitMessage: `Add ${inputs[Input.Version]}`,
    version: inputs[Input.Version],
    sourceRef: inputs[Input.SourceRepositoryBranch],
    destinationBranch: inputs[Input.SourceRepositoryBranch]
  })

  await addVersionToConandataYml({
    githubClient,
    owner: inputs[Input.SourceRepositoryOwner],
    repository: inputs[Input.SourceRepositoryName],
    recipeName: inputs[Input.RecipeName],
    recipeFolder: inputs[Input.RecipeFolder],
    commitMessage: `Add ${inputs[Input.Version]}`,
    version: inputs[Input.Version],
    sourceRef: inputs[Input.SourceRepositoryBranch],
    destinationBranch: inputs[Input.SourceRepositoryBranch],
    url: inputs[Input.Url],
    sha256: inputs[Input.Sha256]
  })

  await addRequirementsToConanfilePy({
    githubClient,
    owner: inputs[Input.SourceRepositoryOwner],
    repository: inputs[Input.SourceRepositoryName],
    recipeName: inputs[Input.RecipeName],
    recipeFolder: inputs[Input.RecipeFolder],
    commitMessage: `Add ${inputs[Input.Version]}`,
    version: inputs[Input.Version],
    sourceRef: inputs[Input.SourceRepositoryBranch],
    destinationBranch: inputs[Input.SourceRepositoryBranch],
    url: inputs[Input.Url],
    sha256: inputs[Input.Sha256],
    dependencies: inputs[Input.Dependencies]
  })

  await githubClient.pulls.create({
    owner: inputs[Input.DestinationRepositoryOwner],
    repo: inputs[Input.DestinationRepositoryName],
    title: inputs[Input.PullRequestTitle],
    body: inputs[Input.PullRequestBody],
    head: `${inputs[Input.SourceRepositoryOwner]}:${
      inputs[Input.SourceRepositoryBranch]
    }`,
    base: inputs[Input.DestinationRepositoryBranch]
  })
}

main().catch(error => core.setFailed(error))
