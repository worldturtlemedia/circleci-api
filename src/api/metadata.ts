import { GitInfo, TestMetadataResponse, createVcsUrl } from "../types";
import { client } from "../client";

/**
 * Provides test metadata for a build
 *
 * @see https://circleci.com/docs/api/v1-reference/#test-metadata
 * @example GET : https://circleci.com/api/v1.1/project/:vcs-type/:username/:project/:build_num/tests
 *
 * @param token CircleCI API token
 * @param vcs Git information for project
 * @param buildNumber Build number to get metadata for
 * @returns metadata for tests
 */
export function getTestMetadata(
  token: string,
  vcs: GitInfo,
  buildNumber: number
): Promise<TestMetadataResponse> {
  const url = `${createVcsUrl(vcs)}/${buildNumber}/tests`;
  return client(token).get<TestMetadataResponse>(url);
}
