import {
  GitInfo,
  SSHKey,
  AddSSHKeyResponse,
  createVcsUrl,
  HerokuKey,
  AddHerokuResponse,
  CircleOptions,
  API_USER
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
 * @param circleHost Provide custom url for CircleCI
 * @returns nothing unless error
 */
export function addSSHKey(
  token: string,
  vcs: GitInfo,
  key: SSHKey,
  { circleHost, customHeaders }: CircleOptions = {}
): Promise<AddSSHKeyResponse> {
  const url = `${createVcsUrl(vcs)}/ssh-key`;
  return client(token, circleHost, customHeaders).post<AddSSHKeyResponse>(
    url,
    key
  );
}

/**
 * Adds your Heroku API key to CircleCI
 *
 * @see https://circleci.com/docs/api/v1-reference/#ssh-keys
 * @example POST - https://circleci.com/api/v1.1/project/:vcs-type/:username/:project/ssh-key
 *
 * @param token CircleCI API token
 * @param key Heroku key to add to project
 * @param circleHost Provide custom url for CircleCI
 * @returns nothing unless error
 */
export function addHerokuKey(
  token: string,
  key: HerokuKey,
  { circleHost, customHeaders }: CircleOptions = {}
): Promise<AddHerokuResponse> {
  const url = `${API_USER}/heroku-key`;
  return client(token, circleHost, customHeaders).post<AddHerokuResponse>(
    url,
    key
  );
}
