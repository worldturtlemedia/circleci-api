import {
  GitInfo,
  CheckoutKeyResponse,
  createVcsUrl,
  CheckoutKey,
  DeleteCheckoutKeyResponse,
  CircleOptions,
} from "../types"
import { client } from "../client"
import { createJsonHeader } from "../util"

/**
 * Lists the checkout keys for a project
 *
 * @see https://circleci.com/docs/api/v1-reference/#list-checkout-keys
 * @example GET : https://circleci.com/api/v1.1/project/:vcs-type/:username/:project/checkout-key
 *
 * @param token CircleCI API token
 * @param circleHost Provide custom url for CircleCI
 * @param vcs Git information for project
 * @returns list of checkout keys for a specific project
 */
export function getCheckoutKeys(
  token: string,
  { circleHost, customHeaders, ...vcs }: GitInfo & CircleOptions,
): Promise<CheckoutKeyResponse> {
  return client(token, circleHost, customHeaders).get<CheckoutKeyResponse>(
    createUrl(vcs),
  )
}

/**
 * Create a checkout key for a project
 *
 * @see https://circleci.com/docs/api/v1-reference/#new-checkout-key
 * @example POST : https://circleci.com/api/v1.1/project/:vcs-type/:username/:project/checkout-key
 *
 * @param token CircleCI API token
 * @param key Key to create for project
 * @param vcs Git information for project
 * @param circleHost Provide custom url for CircleCI
 * @returns New checkout key
 */
export function createCheckoutKey(
  token: string,
  key: CheckoutKey,
  { circleHost, customHeaders, ...vcs }: GitInfo & CircleOptions,
): Promise<CheckoutKeyResponse> {
  return client(token, circleHost, customHeaders).post<CheckoutKeyResponse>(
    createUrl(vcs),
    key,
    createJsonHeader(),
  )
}

/**
 * Get a single checkout key from it's fingerprint
 *
 * @see https://circleci.com/docs/api/v1-reference/#get-checkout-key
 * @example POST : https://circleci.com/api/v1.1/project/:vcs-type/:username/:project/checkout-key
 *
 * @param token CircleCI API token
 * @param fingerprint Fingerprint of the key to fetch
 * @param circleHost Provide custom url for CircleCI
 * @param vcs Git information for project
 * @returns list of checkout keys for a specific project
 */
export function getCheckoutKey(
  token: string,
  fingerprint: string,
  { circleHost, customHeaders, ...vcs }: GitInfo & CircleOptions,
): Promise<CheckoutKeyResponse> {
  return client(token, circleHost, customHeaders).get<CheckoutKeyResponse>(
    createUrl(vcs, fingerprint),
  )
}

/**
 * Deletes a checkout key
 *
 * @see https://circleci.com/docs/api/v1-reference/#delete-checkout-key
 * @example DELETE : https://circleci.com/api/v1.1/project/:vcs-type/:username/:project/checkout-key/:fingerprint
 *
 * @param token CircleCI API token
 * @param fingerprint Fingerprint of the key to delete
 * @param circleHost Provide custom url for CircleCI
 * @param vcs Git information for project
 * @returns Status message of deletion
 */
export function deleteCheckoutKey(
  token: string,
  fingerprint: string,
  { circleHost, customHeaders, ...vcs }: GitInfo & CircleOptions,
): Promise<DeleteCheckoutKeyResponse> {
  return client(token, circleHost, customHeaders).delete<
    DeleteCheckoutKeyResponse
  >(createUrl(vcs, fingerprint))
}

/**
 * Create a url for checkout-key operations
 * @private
 * @param vcs Git information for project
 * @param name Optional, Name of the environment variable
 */
function createUrl(vcs: GitInfo, fingerprint?: string): string {
  return `${createVcsUrl(vcs)}/checkout-key${
    fingerprint ? `/${fingerprint}` : ""
  }`
}
