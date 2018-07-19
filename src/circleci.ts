import { client } from "./client";
import { queryParams, validateVCSRequest } from "./util";
import {
  CircleRequest,
  FactoryOptions,
  GitInfo,
  GitRequiredRequest,
  FullRequest,
  GitType,
  Options,
  MeResponse,
  AllProjectsResponse,
  ArtifactResponse,
  FollowProjectResponse,
  Me,
  BuildSummaryResponse,
  FetchBuildResponse
} from "./types";

export const API_BASE = "https://circleci.com/api/v1.1";
export const API_ME = `${API_BASE}/me`;
export const API_PROJECT = `${API_BASE}/project`;
export const API_ALL_PROJECTS = `${API_BASE}/projects`;
export const API_RECENT_BUILDS = `${API_BASE}/recent-builds`;

function createVcsUrl({ type = GitType.GITHUB, owner, repo }: GitInfo) {
  return `${API_PROJECT}/${type}/${owner}/${repo}`;
}

/* GET Methods */

/**
 * Authenticated user info
 * @see https://circleci.com/docs/api/v1-reference/#getting-started
 * @example GET - /me
 */
export function getMe(token: string): Promise<MeResponse> {
  return client(token).get<MeResponse>(API_ME);
}

/**
 * All followed projects:
 * @see https://circleci.com/docs/api/v1-reference/#projects
 * @example GET - /projects
 */
export function getAllProjects(token: string): Promise<AllProjectsResponse> {
  return client(token).get<AllProjectsResponse>(API_ALL_PROJECTS);
}

/**
 * Get all recent builds for CircleCI user
 *
 * @see https://circleci.com/docs/api/v1-reference/#recent-builds
 * @example GET - /recent-builds?limit=10&offset=5
 *
 * @param token - CircleCI API token
 * @param limit - optional - Limit the number of builds returned, max=100
 * @param offset - optional -builds starting from this offset
 * @returns List of recent build summaries
 */
export function getRecentBuilds(
  token: string,
  { limit, offset }: Options = {}
): Promise<BuildSummaryResponse> {
  const url = `${API_RECENT_BUILDS}${queryParams({ limit, offset })}`;
  return client(token).get<BuildSummaryResponse>(url);
}

/**
 * Get recent build summaries for a project
 *
 * Supported query parameters:
 *
 * @example limit - The number of builds to return. Maximum 100, defaults to 30.
 * @example offset - builds starting from this offset, defaults to 0.
 * @example filter -Restricts which builds are returned. Set to "completed", "successful", "failed", "running"
 *
 * @see https://circleci.com/docs/api/v1-reference/#recent-builds-project
 * @example GET - /project/:vcs-type/:username/:project?circle-token=:token&limit=20&offset=5&filter=completed
 *
 * Get recent builds for a project and branch
 * @see https://circleci.com/docs/api/v1-reference/#recent-builds-project-branch
 * @example GET - /project/:vcs-type/:username/:project/tree/:branch
 *
 * @see FullRequest
 * @param token - CircleCI API token
 * @param vcs - Get builds for this project
 * @param branch - Optional - Get builds for single branch
 * @param opts - Optional - Query parameters
 * @returns A list of build summaries
 */
export function getBuildSummaries({
  token,
  vcs,
  options: { branch = "", ...opts } = {}
}: FullRequest): Promise<BuildSummaryResponse> {
  const url = `${createVcsUrl(vcs)}${branch ? `/tree/${branch}` : ""}`;
  const params = queryParams(opts, true);
  return client(token).get<BuildSummaryResponse>(`${url}${params}`);
}

/**
 * Get full build details for a single build
 *
 * @see https://circleci.com/docs/api/v1-reference/#build
 * @example /project/:vcs-type/:username/:project/:build_num
 *
 * @param token - CircleCI API token
 * @param buildNumber - Target build number
 * @returns Full build details including build steps
 */
export function getFullBuild(
  token: string,
  buildNumber: number,
  vcs: GitInfo
): Promise<FetchBuildResponse> {
  const url = `${createVcsUrl(vcs)}/${buildNumber}`;
  return client(token).get<FetchBuildResponse>(url);
}

/**
 * Get the latest build artifacts for a project
 *
 * @see https://circleci.com/docs/api/v1-reference/#build-artifacts-latest
 * @example GET - /project/:vcs-type/:username/:project/latest/artifacts?branch=:branch&filter=:filter
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

    recentBuilds: (opts?: Options) => getRecentBuilds(token, opts),

    latestArtifacts: (opts?: CircleRequest): Promise<ArtifactResponse> => {
      return validateRequest(getLatestArtifacts, opts);
    }
  };

  return factory;
}
