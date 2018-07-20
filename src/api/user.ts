import { MeResponse } from "../types";
import { API_ME } from "../circleci";
import { client } from "../client";

/**
 * Get authenticated user
 * @see https://circleci.com/docs/api/v1-reference/#getting-started
 * @example GET - /me
 */
export function getMe(token: string): Promise<MeResponse> {
  return client(token).get<MeResponse>(API_ME);
}
