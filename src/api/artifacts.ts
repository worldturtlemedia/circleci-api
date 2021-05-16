import {
  GitInfo,
  ArtifactResponse,
  GitRequiredRequest,
  createVcsUrl,
  CircleOptions,
} from "../types"
import { client } from "../client"
import { queryParams } from "../util"

/**
 * Get artifacts for single project build
 *
 * @see https://circleci.com/docs/api/v1-reference/#build-artifacts
 * @example /project/:vcs-type/:username/:project/:build_num/artifacts
 *
 * @param token - CircleCI API token
 * @param buildNumber - Target build number
 * @param circleHost Provide custom url for CircleCI
 * @param vcs - Project's git information
 * @returns Promise of an array of build artifacs
 */
export function getBuildArtifacts(
  token: string,
  buildNumber: number,
  { circleHost, customHeaders, ...vcs }: GitInfo & CircleOptions,
): Promise<ArtifactResponse> {
  const url = `${createVcsUrl(vcs)}/${buildNumber}/artifacts`
  return client(token, circleHost, customHeaders).get<ArtifactResponse>(url)
}

/**
 * Get the latest build artifacts for a project
 *
 * @example branch - The branch you would like to look in for the latest build. Returns artifacts for latest build in entire project if omitted.
 * @example filter - Restricts which builds are returned. Set to "completed", "successful", "failed", "running"
 *
 * @see https://circleci.com/docs/api/v1-reference/#build-artifacts-latest
 * @example GET - /project/:vcs-type/:username/:project/latest/artifacts?branch=:branch&filter=:filter
 * @param token - CircleCI API token
 * @param vcs - Project's git information
 * @param options - Query parameters
 * @param circleHost Provide custom url for CircleCI
 */
export function getLatestArtifacts(
  token: string,
  { vcs, options = {}, circleHost, customHeaders }: GitRequiredRequest,
): Promise<ArtifactResponse> {
  const { branch, filter } = options
  const url = `${createVcsUrl(vcs)}/latest/artifacts${queryParams({
    branch,
    filter,
  })}`
  return client(token, circleHost, customHeaders).get<ArtifactResponse>(url)
}
