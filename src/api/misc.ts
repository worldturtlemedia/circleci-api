import {
  GitInfo,
  SSHKey,
  AddSSHKeyResponse,
  createVcsUrl,
  HerokuKey,
  AddHerokuResponse,
  API_BASE
} from "../types";
import { client } from "../client";

/**
 * Creates an ssh key that will be used to access the external system identified by
 * the hostname parameter for SSH key-based authentication.
 *
 * @see https://circleci.com/docs/api/v1-reference/#ssh-keys
 * @example POST - https://circleci.com/api/v1.1/project/:vcs-type/:username/:project/ssh-key
 *
 * @param token CircleCI API token
 * @param vcs Git information for project
 * @param key SSH key details to add to project
 * @returns nothing unless error
 */
export function addSSHKey(
  token: string,
  vcs: GitInfo,
  key: SSHKey
): Promise<AddSSHKeyResponse> {
  const url = `${createVcsUrl(vcs)}/ssh-key`;
  return client(token).post<AddSSHKeyResponse>(url, key);
}

/**
 * Adds your Heroku API key to CircleCI
 *
 * @see https://circleci.com/docs/api/v1-reference/#ssh-keys
 * @example POST - https://circleci.com/api/v1.1/project/:vcs-type/:username/:project/ssh-key
 *
 * @param token CircleCI API token
 * @param key Heroku key to add to project
 * @returns nothing unless error
 */
export function addHerokuKey(
  token: string,
  key: HerokuKey
): Promise<AddHerokuResponse> {
  const url = `${API_BASE}/user/heroku-key`;
  return client(token).post<AddHerokuResponse>(url, key);
}
