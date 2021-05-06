import { client } from "../client";
import {
  AllProjectsResponse,
  GitRequiredRequest,
  FollowProjectResponse,
  API_ALL_PROJECTS,
  createVcsUrl,
  CircleOptions
} from "../types";

/**
 * All followed projects:
 * @see https://circleci.com/docs/api/v1-reference/#projects
 * @example GET - /projects
 */
export function getAllProjects(
  token: string,
  { circleHost, customHeaders }: CircleOptions = {}
): Promise<AllProjectsResponse> {
  return client(token, circleHost, customHeaders).get<AllProjectsResponse>(
    API_ALL_PROJECTS
  );
}

/**
 * Follow a new project. CircleCI will then monitor the project for automatic building of commits.
 * @see https://circleci.com/docs/api/v1-reference/#follow-project
 * @example POST - /project/:vcs-type/:username/:project/follow
 */
export function postFollowNewProject(
  token: string,
  { vcs, circleHost, customHeaders }: GitRequiredRequest
): Promise<FollowProjectResponse> {
  const url = `${createVcsUrl(vcs)}/follow`;
  return client(token, circleHost, customHeaders).post<FollowProjectResponse>(
    url
  );
}
