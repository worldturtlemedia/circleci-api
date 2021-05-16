import {
  GitInfo,
  BuildActionResponse,
  TriggerBuildResponse,
  GitRequiredRequest,
  BuildAction,
  createVcsUrl,
  CircleOptions
} from "../types";
import { client } from "../client";

/**
 * Commit a build action, returns a summary of the new build.
 *
 * Retry a build
 * @see https://circleci.com/docs/api/v1-reference/#retry-build
 * @example POST - /project/:vcs-type/:username/:project/:build_num/retry
 *
 * Cancel a build
 * @see https://circleci.com/docs/api/v1-reference/#cancel-build
 * @example POST - /project/:vcs-type/:username/:project/:build_num/cancel
 *
 * @param token - CircleCI API token
 * @param buildNumber - Target build number to retry
 * @param action - Action to perform on the build
 * @param circleHost Provide custom url for CircleCI
 * @param vcs - Project's git information that you'd like to retry
 */
export function postBuildActions(
  token: string,
  buildNumber: number,
  action: BuildAction,
  { circleHost, customHeaders, ...vcs }: GitInfo & CircleOptions
): Promise<BuildActionResponse> {
  const url = `${createVcsUrl(vcs)}/${buildNumber}/${action}`;
  return client(token, circleHost, customHeaders).post(url);
}

/**
 * Triggers a new build, returns a summary of the build.
 * @see https://circleci.com/docs/api/v1-reference/#new-build
 * @example /project/:vcs-type/:username/:project
 *
 * Triggers a new build, returns a summary of the build.
 * @see https://circleci.com/docs/api/v1-reference/#new-build-branch
 * @example /project/:vcs-type/:username/:project/tree/:branch
 */
export function postTriggerNewBuild(
  token: string,
  {
    circleHost,
    customHeaders,
    vcs,
    options: { branch = "", newBuildOptions = {} } = {}
  }: GitRequiredRequest
): Promise<TriggerBuildResponse> {
  const url = `${createVcsUrl(vcs)}${branch ? `/tree/${branch}` : ""}`;
  return client(token, circleHost, customHeaders).post<TriggerBuildResponse>(
    url,
    newBuildOptions
  );
}
