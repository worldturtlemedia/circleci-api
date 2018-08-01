import {
  GitInfo,
  ListEnvVariablesResponse,
  createVcsUrl,
  EnvVariable,
  EnvVariableResponse
} from "../types";
import { client } from "../client";

export function listEnv(
  token: string,
  vcs: GitInfo
): Promise<ListEnvVariablesResponse> {
  const url = `${createVcsUrl(vcs)}/envvar`;
  return client(token).get<ListEnvVariablesResponse>(url);
}

export function addEnv(
  token: string,
  vcs: GitInfo,
  payload: EnvVariable
): Promise<EnvVariableResponse> {
  const url = `${createVcsUrl(vcs)}/envvar`;
  return client(token).post<EnvVariableResponse>(url, payload, {
    headers: { "Content-Type": "application/json" }
  });
}
