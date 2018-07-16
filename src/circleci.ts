import { client } from "./client";
import {
  AllProjectsResponse,
  ArtifactResponse,
  FollowProjectResponse,
  MeResponse,
  Me
} from "./types/api";
import {
  CircleRequest,
  FactoryOptions,
  GitInfo,
  GitRequiredRequest,
  FullRequest
} from "./types/lib";
import { queryParams, validateVCSRequest } from "./util";

export const API_BASE = "https://circleci.com/api/v1.1";
export const API_ME = `${API_BASE}/me`;
export const API_PROJECT = `${API_BASE}/project`;
export const API_ALL_PROJECTS = `${API_BASE}/projects`;

export function createVcsUrl({ type, owner, repo }: GitInfo) {
  return `${API_PROJECT}/${type}/${owner}/${repo}`;
}

/* GET Methods */

/**
 * Authenticated user info
 * GET - /me
 * @see https://circleci.com/docs/api/v1-reference/#getting-started
 */
export async function getMe(token: string): Promise<MeResponse> {
  const result = await client(token).get<MeResponse>(API_ME);
  return result.data;
}

/**
 * All followed projects:
 * GET - /projects
 * @see https://circleci.com/docs/api/v1-reference/#projects
 */
export async function getAllProjects(
  token: string
): Promise<AllProjectsResponse> {
  const result = await client(token).get<AllProjectsResponse>(API_ALL_PROJECTS);
  return result.data;
}

/**
 * Latest build artifacts:
 * GET - /project/:vcs-type/:username/:project/latest/artifacts?branch=:branch&filter=:filter
 * @see https://circleci.com/docs/api/v1-reference/#build-artifacts-latest
 */
export async function getLatestArtifacts(
  token: string,
  { vcs, options = {} }: GitRequiredRequest
): Promise<ArtifactResponse> {
  const url = `${createVcsUrl(vcs)}/latest/artifacts${queryParams(options)}`;
  const result = await client(token).get<ArtifactResponse>(url);
  return result.data;
}

/* POST Methods */

/**
 * POST - /project/:vcs-type/:username/:project/follow
 * @see https://circleci.com/docs/api/v1-reference/#follow-project
 */
export async function postFollowNewProject(
  token: string,
  { vcs }: GitRequiredRequest
): Promise<FollowProjectResponse> {
  const url = `${createVcsUrl(vcs)}/follow`;
  const result = await client(token).post<FollowProjectResponse>(url);
  return result.data;
}

/* Client Factory */

export interface CircleCIFactory {
  addToken: (url: string) => string;
  me: () => Promise<Me>;
  projects: () => Promise<AllProjectsResponse>;
  followProject: (opts: GitRequiredRequest) => Promise<FollowProjectResponse>;
  latestArtifacts: (opts?: CircleRequest) => Promise<ArtifactResponse>;
}

export function circleci({
  token,
  vcs: { type = "", owner = "", repo = "" } = {},
  options = {}
}: FactoryOptions): CircleCIFactory {
  const validateRequest = (
    func: (token: string, req: GitRequiredRequest) => any,
    opts: CircleRequest = {}
  ) => {
    const request: FullRequest = {
      token: opts.token || token,
      options: { ...options, ...opts.options },
      vcs: { type, owner, repo, ...opts.vcs }
    };

    if (validateVCSRequest(request)) {
      return func(token, request);
    }

    throw Error("Github credentials are missing!");
  };

  const factory: CircleCIFactory = {
    addToken: (url: string) => `${url}?circle-token=${token}`,

    me: () => getMe(token),

    projects: () => getAllProjects(token),

    followProject: (opts: GitRequiredRequest) =>
      validateRequest(postFollowNewProject, opts),

    latestArtifacts: (opts?: CircleRequest): Promise<ArtifactResponse> =>
      validateRequest(getLatestArtifacts, opts)
  };

  return factory;
}
