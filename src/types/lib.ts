/**
 * @description Currently supported VCS types
 * @see GitInfo
 */
export enum GitType {
  GITHUB = "github",
  BITBUCKET = "bitbucket"
}

/**
 * @description Settings for git project.  Used for endpoints such as builds, and artifacts
 * @see https://circleci.com/docs/api/v1-reference/#version-control-system-vcs-type
 * @property {GitType} [type] - Type of VCS (github, bitbucket, etc)
 * @property {string} [owner] - Owner of the target repository
 * @property {repo} [repo] - Target repository name
 */
export interface GitInfo {
  type?: GitType;
  owner?: string;
  repo?: string;
}

// TODO change to enum
export type Filter = "completed" | "successful" | "failed";

/**
 * @description Additional options used as query params
 * @property {string} [branch="master"] - Git branch to use with api
 * @property {Filter} [filter] - Filters to grab selected builds, such as completed
 */
export interface Options {
  branch?: string;
  filter?: Filter;
}

/**
 * @description Basic information required for a standard CircleCI request
 * @property {string} [token] - CircleCI API key
 * @property {GitInfo} [vcs] - Git information required for project related endpoints
 * @property {Options} [options] - Extra query parameters for build endpoints
 */
export interface CircleRequest {
  token?: string;
  vcs?: GitInfo;
  options?: Options;
}

/**
 * @description Required options for the CircleCI factory
 * @property {string} token - CircleCI API key
 */
export interface FactoryOptions extends CircleRequest {
  token: string;
}

/**
 * @description Required settings for requests regarding a git project
 * @property {GitInfo} vcs - Git information
 */
export interface GitRequiredRequest extends CircleRequest {
  vcs: GitInfo;
}

/**
 * @description Required properties for CircleRequest
 * @see {@link CircleRequest}
 */
export interface FullRequest extends CircleRequest {
  token: string;
  vcs: GitInfo;
}
