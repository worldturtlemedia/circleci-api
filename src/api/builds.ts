import {
  GitInfo,
  FetchBuildResponse,
  Options,
  BuildSummaryResponse,
  GitRequiredRequest,
  API_RECENT_BUILDS,
  createVcsUrl
} from "../types";
import { client } from "../client";
import { queryParams } from "../util";

/**
 * Get all recent builds for CircleCI user
 *
 * @see https://circleci.com/docs/api/v1-reference/#recent-builds
 * @example GET - /recent-builds?limit=10&offset=5
 *
 * @param token - CircleCI API token
 * @param limit - optional - Limit the number of builds returned, max=100
 * @param offset - optional -builds starting from this offset
 * @returns List of recent build summaries
 */
export function getRecentBuilds(
  token: string,
  { limit, offset }: Options = {}
): Promise<BuildSummaryResponse> {
  const url = `${API_RECENT_BUILDS}${queryParams({ limit, offset })}`;
  return client(token).get<BuildSummaryResponse>(url);
}

/**
 * Get recent build summaries for a project
 *
 * Supported query parameters:
 *
 * @example limit - The number of builds to return. Maximum 100, defaults to 30.
 * @example offset - builds starting from this offset, defaults to 0.
 * @example filter -Restricts which builds are returned. Set to "completed", "successful", "failed", "running"
 *
 * @see https://circleci.com/docs/api/v1-reference/#recent-builds-project
 * @example GET - /project/:vcs-type/:username/:project?circle-token=:token&limit=20&offset=5&filter=completed
 *
 * Get recent builds for a project and branch
 * @see https://circleci.com/docs/api/v1-reference/#recent-builds-project-branch
 * @example GET - /project/:vcs-type/:username/:project/tree/:branch
 *
 * @see FullRequest
 * @param token - CircleCI API token
 * @param vcs - Get builds for this project
 * @param branch - Optional - Get builds for single branch
 * @param opts - Optional - Query parameters
 * @returns A list of build summaries
 */
export function getBuildSummaries(
  token: string,
  { vcs, options: { branch = "", ...opts } = {} }: GitRequiredRequest
): Promise<BuildSummaryResponse> {
  const url = `${createVcsUrl(vcs)}${branch ? `/tree/${branch}` : ""}`;
  const params = queryParams(opts, true);
  return client(token).get<BuildSummaryResponse>(`${url}${params}`);
}

/**
 * Get full build details for a single build
 *
 * @see https://circleci.com/docs/api/v1-reference/#build
 * @example /project/:vcs-type/:username/:project/:build_num
 *
 * @param token - CircleCI API token
 * @param vcs - Project's git information
 * @param buildNumber - Target build number
 * @returns Full build details including build steps
 */
export function getFullBuild(
  token: string,
  vcs: GitInfo,
  buildNumber: number
): Promise<FetchBuildResponse> {
  const url = `${createVcsUrl(vcs)}/${buildNumber}`;
  return client(token).get<FetchBuildResponse>(url);
}
