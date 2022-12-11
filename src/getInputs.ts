import * as core from '@actions/core'
import {convertCamelCaseStringToSnakeCaseString} from './convertCamelCaseStringToSnakeCaseString'

export enum Input {
  Token,
  Version,
  RecipeName,
  RecipeFolder,
  SourceRepositoryName,
  SourceRepositoryOwner,
  SourceRepositoryBranch,
  DestinationRepositoryName,
  DestinationRepositoryOwner,
  DestinationRepositoryBranch,
  Url,
  Sha256,
  Dependencies,
  PullRequestTitle,
  PullRequestBody
}

export interface Inputs {
  [Input.Token]: string
  [Input.SourceRepositoryName]: string
  [Input.SourceRepositoryOwner]: string
  [Input.SourceRepositoryBranch]: string
  [Input.DestinationRepositoryName]: string
  [Input.DestinationRepositoryOwner]: string
  [Input.DestinationRepositoryBranch]: string
  [Input.RecipeName]: string
  [Input.RecipeFolder]: string
  [Input.Version]: string
  [Input.Url]: string
  [Input.Sha256]: string
  [Input.Dependencies]: string[]
  [Input.PullRequestTitle]: string
  [Input.PullRequestBody]: string
}

export function getInputs(): Inputs {
  const version = core.getInput(
    convertCamelCaseStringToSnakeCaseString(Input[Input.Version]),
    {required: true}
  )
  const recipeName = core.getInput(
    convertCamelCaseStringToSnakeCaseString(Input[Input.Token]),
    {required: false}
  )
  return {
    [Input.Token]: core.getInput(
      convertCamelCaseStringToSnakeCaseString(Input[Input.Token]),
      {required: true}
    ),
    [Input.SourceRepositoryName]: core.getInput(
      convertCamelCaseStringToSnakeCaseString(
        Input[Input.SourceRepositoryName]
      ),
      {required: false}
    ),
    [Input.SourceRepositoryOwner]: core.getInput(
      convertCamelCaseStringToSnakeCaseString(
        Input[Input.SourceRepositoryOwner]
      ),
      {required: false}
    ),
    [Input.SourceRepositoryBranch]: core.getInput(
      convertCamelCaseStringToSnakeCaseString(
        Input[Input.SourceRepositoryBranch]
      ),
      {required: false}
    ),
    [Input.DestinationRepositoryName]: core.getInput(
      convertCamelCaseStringToSnakeCaseString(
        Input[Input.DestinationRepositoryName]
      ),
      {required: false}
    ),
    [Input.DestinationRepositoryOwner]: core.getInput(
      convertCamelCaseStringToSnakeCaseString(
        Input[Input.DestinationRepositoryOwner]
      ),
      {required: false}
    ),
    [Input.DestinationRepositoryBranch]: core.getInput(
      convertCamelCaseStringToSnakeCaseString(
        Input[Input.DestinationRepositoryBranch]
      ),
      {required: false}
    ),
    [Input.RecipeName]: core.getInput(
      convertCamelCaseStringToSnakeCaseString(Input[Input.RecipeName]),
      {required: true}
    ),
    [Input.RecipeFolder]: core.getInput(
      convertCamelCaseStringToSnakeCaseString(Input[Input.RecipeFolder]),
      {required: true}
    ),
    [Input.Version]: version,
    [Input.Url]: core.getInput(
      convertCamelCaseStringToSnakeCaseString(Input[Input.Url]),
      {required: true}
    ),
    [Input.Sha256]: core.getInput(
      convertCamelCaseStringToSnakeCaseString(Input[Input.Sha256]),
      {required: false}
    ),
    [Input.Dependencies]: core.getMultilineInput(
      convertCamelCaseStringToSnakeCaseString(Input[Input.Dependencies]),
      {required: true}
    ),
    [Input.PullRequestTitle]:
      core.getInput(
        convertCamelCaseStringToSnakeCaseString(Input[Input.PullRequestTitle]),
        {required: false}
      ) ?? `Add ${version}`,
    [Input.PullRequestBody]:
      core.getInput(
        convertCamelCaseStringToSnakeCaseString(Input[Input.PullRequestBody]),
        {required: false}
      ) ?? `TODO: `
  }
}
