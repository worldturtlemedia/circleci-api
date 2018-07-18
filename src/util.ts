import { Options, FullRequest, GitType } from "./types";

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

// TODO - Remove default value for filter
export function queryParams(
  { branch = "master", ...opts }: Options = {},
  ignoreBranch: boolean = false
) {
  const map = ignoreBranch ? opts : { ...opts, branch };
  const params = Object.keys(map)
    .reduce(
      (prev: string[], key: string) => [...prev, `${key}=${map[key]}`],
      []
    )
    .join("&");

  return params.length ? `?${params}` : "";
}

export function getGitType(type: string): GitType {
  if (type === GitType.BITBUCKET) {
    return type as GitType;
  }

  return GitType.GITHUB;
}
