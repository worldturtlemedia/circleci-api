import { Options, FullRequest } from "./types/lib";

export function validateVCSRequest({
  token,
  vcs: { type, owner, repo }
}: FullRequest): boolean {
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

  return true;
}

// TODO - Remove default value for filter
export function queryParams({
  branch = "master",
  filter = "successful"
}: Options = {}) {
  return `?branch=${branch}&filter=${filter}`;
}
