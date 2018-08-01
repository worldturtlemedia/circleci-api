import { Options, FullRequest, GitType } from "./types";
import { AxiosRequestConfig } from "../node_modules/axios";

/**
 * Validate a Request object for endpoints that require
 * certain information
 * @param token - CircleCI API token
 * @param type - Git type
 * @param owner - Repository owner
 * @param repo - Target repository
 * @throws If options passed in are not valid
 */
export function validateVCSRequest({
  token,
  vcs: { type, owner, repo }
}: FullRequest) {
  if (!token) {
    throw new Error("CircleCiApi - No token was provided");
  }

  const missing = [];
  if (!type) {
    missing.push("type");
  }

  if (!owner) {
    missing.push("owner");
  }

  if (!repo) {
    missing.push("repo");
  }

  if (missing.length) {
    throw new Error(`CircleCiApi - Missing options ${missing}`);
  }
}

/**
 * Take a Options object and map it to query parameters
 * @example { limit: 5, branch: "develop" } => /builds?branch=develop&limit=5
 * @param opts - Query param object, branch is defaulted to master
 * @param ignoreBranch - Ignore the 'branch' option
 * @returns A string containing url encoded query params
 */
export function queryParams(opts: Options = {}) {
  const params = Object.keys(opts)
    .filter(key => typeof opts[key] !== "undefined" && opts[key] !== null)
    .reduce(
      (prev: string[], key: string, arr) => [
        ...prev,
        `${key}=${encodeURIComponent(opts[key])}`
      ],
      []
    )
    .join("&");

  return params.length ? `?${params}` : "";
}

/**
 * Takes a string and will return the matching type, or
 * default to GitType.GITHUB
 * @default GitType.GITHUB
 * @see GitType
 * @param type - Raw string type
 */
export function getGitType(type: string): GitType {
  const formatted = type
    .trim()
    .replace(/ /g, "")
    .toLowerCase();
  if (formatted === GitType.BITBUCKET) {
    return formatted as GitType;
  }

  return GitType.GITHUB;
}

/**
 * Create JSON headers for Axios
 */
export function createJsonHeader(): AxiosRequestConfig {
  return {
    headers: {
      "Content-Type": "application/json",
      Accepts: "application/json"
    }
  };
}
