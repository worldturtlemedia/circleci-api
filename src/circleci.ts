import { validateVCSRequest } from "./util";
import {
  CircleRequest,
  FactoryOptions,
  GitInfo,
  GitRequiredRequest,
  FullRequest,
  GitType,
  Options,
  AllProjectsResponse,
  ArtifactResponse,
  FollowProjectResponse,
  Me,
  BuildSummaryResponse,
  FetchBuildResponse
} from "./types";
import { getAllProjects, postFollowNewProject } from "./api/projects";
import { getRecentBuilds, getBuildSummaries, getFullBuild } from "./api/builds";
import { getLatestArtifacts, getBuildArtifacts } from "./api/artifacts";
import { getMe } from "./api/user";

export const API_BASE = "https://circleci.com/api/v1.1";
export const API_ME = `${API_BASE}/me`;
export const API_PROJECT = `${API_BASE}/project`;
export const API_ALL_PROJECTS = `${API_BASE}/projects`;
export const API_RECENT_BUILDS = `${API_BASE}/recent-builds`;

export enum BuildAction {
  RETRY = "retry",
  CANCEL = "cancel"
}

export function createVcsUrl({ type = GitType.GITHUB, owner, repo }: GitInfo) {
  return `${API_PROJECT}/${type}/${owner}/${repo}`;
}

/* Client Factory */

export interface CircleCIFactory {
  defaults: () => FactoryOptions;
  addToken: (url: string) => string;
  me: () => Promise<Me>;
  projects: () => Promise<AllProjectsResponse>;
  followProject: (opts: GitRequiredRequest) => Promise<FollowProjectResponse>;
  recentBuilds: (opts?: Options) => Promise<BuildSummaryResponse>;
  builds: (opts?: CircleRequest) => Promise<BuildSummaryResponse>;
  buildsFor: (
    branch: string,
    opts?: CircleRequest
  ) => Promise<BuildSummaryResponse>;
  build: (
    buildNumber: number,
    opts: CircleRequest
  ) => Promise<FetchBuildResponse>;
  latestArtifacts: (opts?: CircleRequest) => Promise<ArtifactResponse>;
  artifacts: (
    buildNumber: number,
    opts?: CircleRequest
  ) => Promise<ArtifactResponse>;
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
  const createRequest = (opts: CircleRequest = {}): FullRequest => {
    const request: FullRequest = {
      token: opts.token || token,
      options: { ...options, ...opts.options },
      vcs: { type, owner, repo, ...opts.vcs }
    };

    validateVCSRequest(request);

    return request;
  };

  const factory: CircleCIFactory = {
    defaults: () => ({ token, vcs: { type, owner, repo }, options }),

    addToken: (url: string) => `${url}?circle-token=${token}`,

    me: () => getMe(token),

    projects: () => getAllProjects(token),

    followProject: (opts: GitRequiredRequest) => {
      const { token, ...rest } = createRequest(opts);
      return postFollowNewProject(token, rest);
    },

    recentBuilds: (opts?: Options) => getRecentBuilds(token, opts),

    builds: (opts?: CircleRequest) => {
      const request = createRequest(opts);
      return getBuildSummaries(request);
    },

    buildsFor: (branch: string = "master", opts?: CircleRequest) => {
      const request = createRequest({ ...opts, options: { branch } });
      return getBuildSummaries(request);
    },

    build: (buildNumber: number, opts?: CircleRequest) => {
      const { token, vcs } = createRequest(opts);
      return getFullBuild(token, vcs, buildNumber);
    },

    latestArtifacts: (opts?: CircleRequest) => {
      const { token, ...rest } = createRequest(opts);
      return getLatestArtifacts(token, rest);
    },

    artifacts: (buildNumber: number, opts?: CircleRequest) => {
      const { token, vcs } = createRequest(opts);
      return getBuildArtifacts(token, vcs, buildNumber);
    }
  };

  return factory;
}
