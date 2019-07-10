import { MeResponse, API_ME, CircleOptions } from "../types";
import { client } from "../client";

/**
 * Get authenticated user
 * @see https://circleci.com/docs/api/v1-reference/#getting-started
 * @example GET - /me
 */
export function getMe(
  token: string,
  { circleHost }: CircleOptions = {}
): Promise<MeResponse> {
  return client(token, circleHost).get<MeResponse>(API_ME);
}
