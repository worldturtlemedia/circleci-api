import {
  GitInfo,
  ListEnvVariablesResponse,
  createVcsUrl,
  EnvVariable,
  EnvVariableResponse,
  DeleteEnvVarResponse
} from "../types";
import { client } from "../client";
import { createJsonHeader } from "../util";

/**
 * List all of a projects environment variables, part of the
 * value will be masked with *'s
 *
 * @see getEnv for retrieving the hidden value of an env variable
 *
 * @see https://circleci.com/docs/api/v1-reference/#list-environment-variables
 * @example GET : https://circleci.com/api/v1.1/project/:vcs-type/:username/:project/envvar
 *
 * @param token CircleCI API token
 * @param vcs Git information for project
 * @returns list of env variables for a specific project
 */
export function listEnv(
  token: string,
  vcs: GitInfo
): Promise<ListEnvVariablesResponse> {
  return client(token).get<ListEnvVariablesResponse>(createUrl(vcs));
}

/**
 * Add environment variable to project
 *
 * @see https://circleci.com/docs/api/v1-reference/#add-environment-variable
 * @example POST : https://circleci.com/api/v1.1/project/:vcs-type/:username/:project/envvar
 *
 * @param token CircleCI API token
 * @param vcs Git information for project
 * @param payload Environment variable object to add to project
 * @returns newly created environment variable
 */
export function addEnv(
  token: string,
  vcs: GitInfo,
  payload: EnvVariable
): Promise<EnvVariableResponse> {
  return client(token).post<EnvVariableResponse>(
    createUrl(vcs),
    payload,
    createJsonHeader()
  );
}

/**
 * Gets the hidden value of environment variable :name
 *
 * @example GET : https://circleci.com/api/v1.1/project/:vcs-type/:username/:project/envvar/:name
 * @see https://circleci.com/docs/api/v1-reference/#get-environment-variable
 *
 * @param token CircleCI API token
 * @param vcs Git information for project
 * @param envName Name of variable to fetch value
 * @returns Full hidden value of environment variable
 */
export function getEnv(
  token: string,
  vcs: GitInfo,
  envName: string
): Promise<EnvVariableResponse> {
  return client(token).get<EnvVariableResponse>(createUrl(vcs, envName));
}

/**
 * Deletes the environment variable named ':name'
 *
 * @example DELETE : https://circleci.com/api/v1.1/project/:vcs-type/:username/:project/envvar/:name
 * @see https://circleci.com/docs/api/v1-reference/#delete-environment-variable
 *
 * @param token CircleCI API token
 * @param vcs Git information for project
 * @param envName Name of variable to fetch value
 * @returns Status message result of operation
 */
export function deleteEnv(
  token: string,
  vcs: GitInfo,
  envName: string
): Promise<DeleteEnvVarResponse> {
  return client(token).delete<DeleteEnvVarResponse>(createUrl(vcs, envName));
}

/**
 * Create a url for env operations
 * @private
 * @param vcs Git information for project
 * @param name Optional, Name of the environment variable
 */
function createUrl(vcs: GitInfo, name: string = ""): string {
  return `${createVcsUrl(vcs)}/envvar${name ? `/${name}` : ""}`;
}
