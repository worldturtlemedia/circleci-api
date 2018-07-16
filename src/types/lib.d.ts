export interface GitInfo {
  type: string;
  owner: string;
  repo: string;
}

// TODO change to enum
export type Filter = "completed" | "successful" | "failed";

export interface Options {
  branch?: string;
  filter?: Filter;
}

export interface CircleRequest {
  token?: string;
  vcs?: GitInfo;
  options?: Options;
}

export interface FactoryOptions extends CircleRequest {
  token: string;
}

export interface GitRequiredRequest extends CircleRequest {
  vcs: GitInfo;
}

export interface FullRequest extends CircleRequest {
  token: string;
  vcs: GitInfo;
}
