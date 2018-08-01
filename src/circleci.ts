import { validateVCSRequest } from "./util";
import {
  CircleRequest,
  CircleCIOptions,
  GitInfo,
  GitRequiredRequest,
  FullRequest,
  GitType,
  Options,
  BuildActionResponse,
  BuildAction,
  FilterRequestOptions,
  RequestOptions,
  ArtifactsRequestOptions,
  Me,
  Project,
  FollowNewResult,
  BuildSummary,
  BuildWithSteps,
  Artifact,
  Build,
  ListEnvVariablesResponse,
  EnvVariable,
  EnvVariableResponse,
  DeleteEnvVarResponse
} from "./types";
import { getAllProjects, postFollowNewProject } from "./api/projects";
import { getRecentBuilds, getBuildSummaries, getFullBuild } from "./api/builds";
import { getLatestArtifacts, getBuildArtifacts } from "./api/artifacts";
import { getMe } from "./api/user";
import { postBuildActions, postTriggerNewBuild } from "./api";
import { listEnv, addEnv, getEnv, deleteEnv } from "./api/env";
import { clearCache } from "./api/cache";

// TODO
/*
  For the endpoints that accept filters/offset/etc
  modify factory functions to pass in only required options
*/

/**
 * CircleCI API Wrapper
 * A wrapper for all of the circleci api calls.
 * Most values can be overridden by individual methods
 *
 */
export class CircleCI {
  private token: string;
  private vcs: GitInfo;
  private options: Options;

  /**
   *
   * @param token CircleCI API token
   * @param vcs Default git information
   * @param vcs.type Git project type ex "github" | "bitbucket"
   * @param vcs.owner Owner of the git repository
   * @param vcs.repo Git repository name
   * @param options Additional query parameters
   * @returns {CircleCI} wrapper for CircleCI
   */
  constructor({
    token,
    vcs: { type = GitType.GITHUB, owner = "", repo = "" } = {},
    options = {}
  }: CircleCIOptions) {
    this.token = token;
    this.vcs = { type, owner, repo };
    this.options = options;
  }

  /**
   * Get the options used to create this instance
   */
  defaults(): CircleRequest {
    return { token: this.token, vcs: this.vcs, options: this.options };
  }

  /**
   * Adds the CircleCI token to a url
   * @param url URL to modify
   */
  addToken(url: string): string {
    return `${url}?circle-token=${this.token}`;
  }

  /**
   * Get the currently authenticated user
   */
  me(): Promise<Me> {
    return getMe(this.token);
  }

  /**
   * Get a list of all the projects the user follows
   */
  projects(): Promise<Project[]> {
    return getAllProjects(this.token);
  }

  /**
   * Follow a new project. CircleCI will then monitor the project for automatic building of commits.
   * @param opts Project information
   */
  followProject(opts: GitRequiredRequest): Promise<FollowNewResult> {
    const { token, ...rest } = this.createRequest(opts);
    return postFollowNewProject(token, rest);
  }

  /**
   * Get all recent builds for CircleCI user
   * @param reqOptions Optional, Request options
   * @param reqOptions.options.limit Optional, Limit the number of builds returned, max=100
   * @param reqOptions.options.offset Optional, builds starting from this offset
   * @param opts Optional settings
   */
  recentBuilds(
    reqOptions: RequestOptions = {},
    opts?: CircleRequest
  ): Promise<BuildSummary[]> {
    const { token, options } = this.createRequest({
      ...(opts || {}),
      options: { ...(opts ? opts.options : {}), ...reqOptions }
    });
    return getRecentBuilds(token, options);
  }

  /**
   * Get recent build summaries for a project
   * @param reqOptions Optional, request options for filtering, limiting, etc
   * @param reqOptions.limit Optional, the number of builds to return. Maximum 100, defaults to 30.
   * @param reqOptions.offset Optional, builds starting from this offset, defaults to 0.
   * @param reqOptions.filter Optional, restricts which builds are returned. Set to "completed", "successful", "failed", "running"
   * @param opts Optional settings
   */
  builds(
    reqOptions: FilterRequestOptions = {},
    opts?: CircleRequest
  ): Promise<BuildSummary[]> {
    const { token, ...rest } = this.createRequest({
      ...(opts || {}),
      options: { ...(opts ? opts.options : {}), ...reqOptions }
    });
    return getBuildSummaries(token, rest);
  }

  /**
   * Get recent builds for a project and branch
   * @param branch Target branch to fetch builds for
   * @param reqOptions Optional, request options for filtering, limiting, etc
   * @param reqOptions.limit Optional, the number of builds to return. Maximum 100, defaults to 30.
   * @param reqOptions.offset Optional, builds starting from this offset, defaults to 0.
   * @param reqOptions.filter Optional, restricts which builds are returned. Set to "completed", "successful", "failed", "running"
   * @param opts Optional settings
   */
  buildsFor(
    branch: string = "master",
    reqOptions: FilterRequestOptions = {},
    opts?: CircleRequest
  ): Promise<BuildSummary[]> {
    const { token, ...rest } = this.createRequest({
      ...opts,
      options: { ...(opts ? opts.options : {}), ...reqOptions, branch }
    });
    return getBuildSummaries(token, rest);
  }

  /**
   * Get full build details for a single build
   * @param buildNumber Target build number
   * @param opts Optional settings
   */
  build(
    buildNumber: number,
    opts?: GitRequiredRequest
  ): Promise<BuildWithSteps> {
    const { token, vcs } = this.createRequest({
      ...(opts || {}),
      options: { ...(opts ? opts.options : {}) }
    });
    return getFullBuild(token, vcs, buildNumber);
  }

  /**
   * Get artifacts for single project build
   * @param buildNumber Target build number
   * @param opts Optional settings to override class defaults
   */
  artifacts(buildNumber: number, opts?: CircleRequest): Promise<Artifact[]> {
    const { token, vcs } = this.createRequest(opts);
    return getBuildArtifacts(token, vcs, buildNumber);
  }

  /**
   * Get the latest build artifacts for a project
   * Pass a branch in the options to target a specific branch
   * @param reqOptions Optional, request options for filtering and specifying a branch
   * @param reqOptions.branch The branch you would like to look in for the latest build. Returns artifacts for latest build in entire project if omitted.
   * @param reqOptions.filter Restricts which builds are returned. Set to "completed", "successful", "failed", "running"
   * @param opts Optional settings
   */
  latestArtifacts(
    reqOptions: ArtifactsRequestOptions = {},
    opts: CircleRequest = {}
  ): Promise<Artifact[]> {
    const { token, ...rest } = this.createRequest({
      ...opts,
      options: { ...opts.options, ...reqOptions }
    });
    return getLatestArtifacts(token, rest);
  }

  /**
   * Retries the build, returns a summary of the new build.
   * @param build Target build number
   * @param opts Optional settings
   */
  retry(build: number, opts?: CircleRequest): Promise<BuildSummary> {
    return this.performAction(
      this.createRequest(opts),
      build,
      BuildAction.RETRY
    );
  }

  /**
   * Cancels the build, returns a summary of the new build.
   * @param build Target build number
   * @param opts Optional settings
   */
  cancel(build: number, opts?: CircleRequest): Promise<BuildSummary> {
    return this.performAction(
      this.createRequest(opts),
      build,
      BuildAction.CANCEL
    );
  }

  /**
   * Triggers a new build, returns a summary of the build.
   * @see https://circleci.com/docs/api/v1-reference/#new-build
   * @param opts Optional settings
   * @param opts.options.newBuildOptions Additional build settings
   */
  triggerBuild(opts?: CircleRequest): Promise<Build> {
    const { token, ...rest } = this.createRequest(opts);
    return postTriggerNewBuild(token, rest);
  }

  /**
   * Triggers a new build for a specific branch.
   * @see https://circleci.com/docs/api/v1-reference/#new-build-branch
   * @param branch Optional, branch to target, defaults to 'master'
   * @param opts Optional settings
   * @param opts.options.newBuildOptions Additional build settings
   */
  triggerBuildFor(
    branch: string = "master",
    opts?: CircleRequest
  ): Promise<Build> {
    const { token, ...request } = this.createRequest({
      ...opts,
      options: { ...(opts ? opts.options : {}), branch }
    });
    return postTriggerNewBuild(token, request);
  }

  /*
  * Cache
  */

  /**
   * Clear the cache for the project
   * @see clearCache for implementation
   * @see https://circleci.com/docs/api/v1-reference/#clear-cache
   * @param opts Optional settings
   */
  clearCache(opts?: CircleRequest) {
    const { token, vcs } = this.createRequest(opts);
    return clearCache(token, vcs);
  }

  /*
  * Environment Variables
  */

  /**
   * List all of a projects environment variables, values will not be fully shown
   * @see getEnvVar for accessing full value
   * @see listEnv
   * @see https://circleci.com/docs/api/v1-reference/#list-environment-variables
   * @param opts Optional settings
   */
  listEnvVars(opts?: CircleRequest): Promise<ListEnvVariablesResponse> {
    const { token, vcs } = this.createRequest(opts);
    return listEnv(token, vcs);
  }

  /**
   * Add environment variable to project
   * @see addEnv
   * @see https://circleci.com/docs/api/v1-reference/#add-environment-variable
   * @param variable Environment variable to add to project
   * @param opts Optional settings
   */
  addEnvVar(
    variable: EnvVariable,
    opts?: CircleRequest
  ): Promise<EnvVariableResponse> {
    const { token, vcs } = this.createRequest(opts);
    return addEnv(token, vcs, variable);
  }

  /**
   * Get the hidden value of an environment variable
   * @see getEnv
   * @see https://circleci.com/docs/api/v1-reference/#get-environment-variable
   * @param envName Name of the variable to fetch
   * @param opts Optional settings
   */
  getEnvVar(
    envName: string,
    opts?: CircleRequest
  ): Promise<EnvVariableResponse> {
    const { token, vcs } = this.createRequest(opts);
    return getEnv(token, vcs, envName);
  }

  /**
   * Delete an environment variable
   * @see deleteEnv
   * @see https://circleci.com/docs/api/v1-reference/#delete-environment-variable
   * @param envName Name of the variable to delete
   * @param opts Optional settings
   */
  deleteEnvVar(
    envName: string,
    opts?: CircleRequest
  ): Promise<DeleteEnvVarResponse> {
    const { token, vcs } = this.createRequest(opts);
    return deleteEnv(token, vcs, envName);
  }

  /*
  * Private functions
  */

  /**
   * Take a request object and merge it with the class properties.
   * Passed in options always take priority over the class properties
   * @param opts Optional, request options
   * @throws If missing a token, or VCS options
   * @returns Merged request object
   */
  private createRequest(opts: CircleRequest = {}): FullRequest {
    const request: FullRequest = {
      token: opts.token || this.token,
      options: { ...this.options, ...opts.options },
      vcs: { ...this.vcs, ...opts.vcs }
    };

    validateVCSRequest(request);

    return request;
  }

  /**
   * Perform a build action on a build
   * @see BuildAction for list of actions
   * @see postBuildActions for implementation
   * @param request Request information
   * @param build Build number to perform action on
   * @param action Type of action to perform
   */
  private performAction(
    request: FullRequest,
    build: number,
    action: BuildAction
  ): Promise<BuildActionResponse> {
    const { token, vcs } = request;
    return postBuildActions(token, vcs, build, action);
  }
}
