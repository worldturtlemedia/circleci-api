import { ClearCacheResponse, GitInfo, createVcsUrl } from "../types";
import { client } from "../client";

export function clearCache(
  token: string,
  vcs: GitInfo
): Promise<ClearCacheResponse> {
  const url = `${createVcsUrl(vcs)}/build-cache`;
  return client(token).delete(url);
}
