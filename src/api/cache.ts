import {
  ClearCacheResponse,
  GitInfo,
  createVcsUrl,
  CircleOptions,
} from "../types"
import { client } from "../client"

/**
 * Clear project cache
 *
 * @see https://circleci.com/docs/api/v1-reference/#clear-cache
 * @example DELETE : https://circleci.com/api/v1.1/project/:vcs-type/:username/:project/build-cache
 *
 * @param token CircleCI API token
 * @param circleHost Provide custom url for CircleCI
 * @param vcs Git info for project
 * @returns status message of request
 */
export function clearCache(
  token: string,
  { circleHost, customHeaders, ...vcs }: GitInfo & CircleOptions,
): Promise<ClearCacheResponse> {
  const url = `${createVcsUrl(vcs)}/build-cache`
  return client(token, circleHost, customHeaders).delete(url)
}
