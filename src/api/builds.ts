import {
  GitInfo,
  FetchBuildResponse,
  Options,
  BuildSummaryResponse,
  GitRequiredRequest,
  API_RECENT_BUILDS,
  createVcsUrl,
  CircleOptions
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
 * @param circleHost Provide custom url for CircleCI
 * @returns List of recent build summaries
 */
export function getRecentBuilds(
  token: string,
  { limit, offset, circleHost, customHeaders }: Options & CircleOptions = {}
): Promise<BuildSummaryResponse> {
  const url = `${API_RECENT_BUILDS}${queryParams({ limit, offset })}`;
  return client(token, circleHost, customHeaders).get<BuildSummaryResponse>(
    url
  );
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
 * @param options - Optional - Query parameters
 * @param circleHost Provide custom url for CircleCI
 * @returns A list of build summaries
 */
export function getBuildSummaries(
  token: string,
  { vcs, options = {}, circleHost, customHeaders }: GitRequiredRequest
): Promise<BuildSummaryResponse> {
  const { limit, offset, filter, branch } = options;
  const url = `${createVcsUrl(vcs)}${branch ? `/tree/${branch}` : ""}`;
  const params = queryParams({ limit, offset, filter });
  return client(token, circleHost, customHeaders).get<BuildSummaryResponse>(
    `${url}${params}`
  );
}

/**
 * Get full build details for a single build
 *
 * @see https://circleci.com/docs/api/v1-reference/#build
 * @example /project/:vcs-type/:username/:project/:build_num
 *
 * @param token - CircleCI API token
 * @param buildNumber - Target build number
 * @param circleHost Provide custom url for CircleCI
 * @param vcs - Project's git information
 * @returns Full build details including build steps
 */
export function getFullBuild(
  token: string,
  buildNumber: number,
  { circleHost, customHeaders, ...vcs }: GitInfo & CircleOptions
): Promise<FetchBuildResponse> {
  const url = `${createVcsUrl(vcs)}/${buildNumber}`;
  return client(token, circleHost, customHeaders).get<FetchBuildResponse>(url);
}
