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
  FetchBuildResponse,
  BuildActionResponse,
  TriggerBuildResponse,
  BuildAction
} from "./types";
import { getAllProjects, postFollowNewProject } from "./api/projects";
import { getRecentBuilds, getBuildSummaries, getFullBuild } from "./api/builds";
import { getLatestArtifacts, getBuildArtifacts } from "./api/artifacts";
import { getMe } from "./api/user";
import { postBuildActions, postTriggerNewBuild } from "./api";

// TODO
/*
  For the endpoints that accept filters/offset/etc
  modify factory functions to pass in only required options
*/

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
  retry: (
    buildNum: number,
    opts?: CircleRequest
  ) => Promise<BuildActionResponse>;
  cancel: (
    buildNum: number,
    opts?: CircleRequest
  ) => Promise<BuildActionResponse>;
  triggerBuild: (opts?: CircleRequest) => Promise<TriggerBuildResponse>;
  triggerBuildFor: (
    branch: string,
    opts?: CircleRequest
  ) => Promise<TriggerBuildResponse>;
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
      const { token, ...rest } = createRequest(opts);
      return getBuildSummaries(token, rest);
    },

    buildsFor: (branch: string = "master", opts?: CircleRequest) => {
      const { token, ...rest } = createRequest({
        ...opts,
        options: { branch }
      });
      return getBuildSummaries(token, rest);
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
    },

    retry: (build: number, opts?: CircleRequest) => {
      return performAction(createRequest(opts), build, BuildAction.RETRY);
    },

    cancel: (build: number, opts?: CircleRequest) => {
      return performAction(createRequest(opts), build, BuildAction.CANCEL);
    },

    triggerBuild: (opts?: CircleRequest) => {
      const { token, ...rest } = createRequest(opts);
      return postTriggerNewBuild(token, rest);
    },

    triggerBuildFor: (branch: string = "master", opts?: CircleRequest) => {
      const request = createRequest({ ...opts, options: { branch } });
      return postTriggerNewBuild(token, request);
    }
  };

  return factory;
}

function performAction(
  request: FullRequest,
  build: number,
  action: BuildAction
): Promise<BuildActionResponse> {
  const { token, vcs } = request;
  return postBuildActions(token, vcs, build, action);
}
