import { CircleCI } from "circleci-api";

const api = new CircleCI({
  token: " ", // Not needed for latest artifacts endpoint
  vcs: {
    owner: "worldturtlemedia",
    repo: "circleci-api"
  }
});

api
  .latestArtifacts()
  .then(x => x.forEach(y => console.log(`found ${y.pretty_path}`)))
  .catch(err => console.error(err));
