import { client } from "../client";
import {
  AllProjectsResponse,
  GitRequiredRequest,
  FollowProjectResponse,
  API_ALL_PROJECTS,
  createVcsUrl
} from "../types";

/**
 * All followed projects:
 * @see https://circleci.com/docs/api/v1-reference/#projects
 * @example GET - /projects
 */
export function getAllProjects(token: string): Promise<AllProjectsResponse> {
  return client(token).get<AllProjectsResponse>(API_ALL_PROJECTS);
}

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
