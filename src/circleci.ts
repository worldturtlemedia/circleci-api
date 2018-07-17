import { client } from "./client";
import {
  CircleRequest,
  FactoryOptions,
  GitInfo,
  GitRequiredRequest,
  FullRequest,
  GitType,
  Options
} from "./types/lib";
import { queryParams, validateVCSRequest } from "./util";
import {
  MeResponse,
  AllProjectsResponse,
  ArtifactResponse,
  FollowProjectResponse,
  Me,
  BuildSummaryResponse
} from "./types/api";

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
export function getMe(token: string): Promise<MeResponse> {
  return client(token).get<MeResponse>(API_ME);
}

/**
 * All followed projects:
 * GET - /projects
 * @see https://circleci.com/docs/api/v1-reference/#projects
 */
export function getAllProjects(token: string): Promise<AllProjectsResponse> {
  return client(token).get<AllProjectsResponse>(API_ALL_PROJECTS);
}

export function getRecentBuilds(token: string): Promise<BuildSummaryResponse> {
  return client(token).get<BuildSummaryResponse>("");
}

/**
 * Latest build artifacts:
 * GET - /project/:vcs-type/:username/:project/latest/artifacts?branch=:branch&filter=:filter
 * @see https://circleci.com/docs/api/v1-reference/#build-artifacts-latest
 */
export function getLatestArtifacts(
  token: string,
  { vcs, options = {} }: GitRequiredRequest
): Promise<ArtifactResponse> {
  const url = `${createVcsUrl(vcs)}/latest/artifacts${queryParams(options)}`;
  return client(token).get<ArtifactResponse>(url);
}

/* POST Methods */

/**
 * POST - /project/:vcs-type/:username/:project/follow
 * @see https://circleci.com/docs/api/v1-reference/#follow-project
 */
export function postFollowNewProject(
  token: string,
  { vcs }: GitRequiredRequest
): Promise<FollowProjectResponse> {
  const url = `${createVcsUrl(vcs)}/follow`;
  return client(token).post<FollowProjectResponse>(url);
}

/* Client Factory */

export interface CircleCIFactory {
  defaults: () => FactoryOptions;
  addToken: (url: string) => string;
  me: () => Promise<Me>;
  projects: () => Promise<AllProjectsResponse>;
  followProject: (opts: GitRequiredRequest) => Promise<FollowProjectResponse>;
  recentBuilds: (opts?: Options) => Promise<BuildSummaryResponse>;
  latestArtifacts: (opts?: CircleRequest) => Promise<ArtifactResponse>;
}

/**
 * CircleCI API Wrapper
 * A wrapper for all of the circleci api calls.
 * Most values can be overridden by individual methods
 *
 * @param token - CircleCI API token
 * @param [vcs] - Default git information
 * @param [vcs.type] - Git project type ex "github" | "bitbucket"
 * @param [vcs.owner] - Owner of the git repository
 * @param [vcs.repo] - Git repository name
 * @param [options] - Additional query parameters
 * @returns {CircleCIFactory} wrapper for CircleCI
 */
export function circleci({
  token,
  vcs: { type = GitType.GITHUB, owner = "", repo = "" } = {},
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

    /* throws */
    validateVCSRequest(request);

    return func(token, request);
  };

  const factory: CircleCIFactory = {
    defaults: () => ({ token, vcs: { type, owner, repo }, options }),
    addToken: (url: string) => `${url}?circle-token=${token}`,

    me: () => getMe(token),

    projects: () => getAllProjects(token),

    followProject: (opts: GitRequiredRequest) => {
      return validateRequest(postFollowNewProject, opts);
    },

    recentBuilds: (opts?: Options) => {
      throw new Error("Not yet implemented");
    },

    latestArtifacts: (opts?: CircleRequest): Promise<ArtifactResponse> => {
      return validateRequest(getLatestArtifacts, opts);
    }
  };

  return factory;
}
