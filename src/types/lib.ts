export const API_BASE = "https://circleci.com/api/v1.1"
export const API_ME = "/me"
export const API_PROJECT = "/project"
export const API_ALL_PROJECTS = "/projects"
export const API_RECENT_BUILDS = "/recent-builds"
export const API_USER = "/user"

/**
 * @description Currently supported VCS types
 * @see GitInfo
 */
export enum GitType {
  GITHUB = "github",
  BITBUCKET = "bitbucket",
}

/**
 * Create a base project url
 * @param type - Type of version control, default "github"
 * @param owner - Owner of the repository
 * @param repo - Target repository
 */
export function createVcsUrl({ type = GitType.GITHUB, owner, repo }: GitInfo) {
  return `${API_PROJECT}/${type}/${owner}/${repo}`
}

export enum BuildAction {
  RETRY = "retry",
  CANCEL = "cancel",
}

/**
 * @description Settings for git project.  Used for endpoints such as builds, and artifacts
 * @see https://circleci.com/docs/api/v1-reference/#version-control-system-vcs-type
 * @property {GitType} [type] - Type of VCS (github, bitbucket, etc)
 * @property {string} [owner] - Owner of the target repository
 * @property {repo} [repo] - Target repository name
 */
export interface GitInfo {
  type?: GitType
  owner?: string
  repo?: string
}

// TODO change to enum
export type Filter = "completed" | "successful" | "failed" | "running"

/**
 * @description Additional options used as query params
 * @property {string} [branch="master"] - Git branch to use with api
 * @property {Filter} [filter] - Filters to grab selected builds, such as completed
 */
export interface Options {
  branch?: string
  filter?: Filter
  limit?: number
  offset?: number
  newBuildOptions?: NewBuildOptions
}

export interface RequestOptions {
  readonly limit?: number
  readonly offset?: number
}

export interface ArtifactsRequestOptions {
  readonly filter?: Filter
  readonly branch?: string
}

export interface FilterRequestOptions extends RequestOptions {
  readonly filter?: Filter
}

/**
 * @description Basic information required for a standard CircleCI request
 * @property {string} [token] - CircleCI API key
 * @property {GitInfo} [vcs] - Git information required for project related endpoints
 * @property {Options} [options] - Extra query parameters for build endpoints
 * @property {string} [circleHost] - Override the default host for CircleCI [API_BASE]
 * @property {any} [customHeaders] - Custom headers to be attached to each CircleCI request
 */
export interface CircleRequest extends CircleOptions {
  token?: string
  vcs?: GitInfo
  options?: Options
}

/**
 * @description Required options for the CircleCI factory
 * @property {string} token - CircleCI API key
 */
export interface CircleCIOptions extends CircleRequest {
  token: string
}

/**
 * @description Required settings for requests regarding a git project
 * @property {GitInfo} vcs - Git information
 */
export interface GitRequiredRequest extends CircleRequest {
  vcs: GitInfo
}

/**
 * @description Required properties for CircleRequest
 * @see {@link CircleRequest}
 */
export interface FullRequest extends CircleRequest {
  token: string
  vcs: GitInfo
}

export interface CircleOptions {
  circleHost?: string
  customHeaders?: any
}

/**
 * Options for triggering a new build
 * @property revision - The specific revision to build. Default is null and the head of the branch is used. Cannot be used with tag parameter.
 * @property tag - The tag to build. Default is null. Cannot be used with revision parameter.
 * @property parallel - The number of containers to use to run the build. Default is null and the project default is used. This parameter is ignored for builds running on our 2.0 infrastructure.
 * @property build_parameters - Additional environment variables to inject into the build environment. A map of names to values.
 */
export interface NewBuildOptions {
  revision?: string
  tag?: string
  parallel?: number
  build_parameters?: BuildParameters
}

/**
 * Additional ENV parameters to pass to the build
 */
export interface BuildParameters {
  [param: string]: string
}
