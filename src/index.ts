import { circleci } from "./circleci";
import { client } from "./client";

export * from "./client";
export * from "./circleci";

export default {
  client,
  api: circleci
};
