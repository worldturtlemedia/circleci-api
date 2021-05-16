import {
  GitInfo,
  TestMetadataResponse,
  createVcsUrl,
  CircleOptions,
} from "../types"
import { client } from "../client"

/**
 * Provides test metadata for a build
 *
 * @see https://circleci.com/docs/api/v1-reference/#test-metadata
 * @example GET : https://circleci.com/api/v1.1/project/:vcs-type/:username/:project/:build_num/tests
 *
 * @param token CircleCI API token
 * @param buildNumber Build number to get metadata for
 * @param circleHost Provide custom url for CircleCI
 * @param vcs Git information for project
 * @returns metadata for tests
 */
export function getTestMetadata(
  token: string,
  buildNumber: number,
  { circleHost, customHeaders, ...vcs }: GitInfo & CircleOptions,
): Promise<TestMetadataResponse> {
  const url = `${createVcsUrl(vcs)}/${buildNumber}/tests`
  return client(token, circleHost, customHeaders).get<TestMetadataResponse>(url)
}
