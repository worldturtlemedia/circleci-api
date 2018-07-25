const { CircleCI } = require("circleci-api");

const api = new CircleCI({
  token: " ", // Not needed for latest artifacts endpoint
  vcs: {
    owner: "jordond",
    repo: "circleci-api"
  }
});

api
  .latestArtifacts()
  .then(x => x.forEach(y => console.log(`found ${y.url}`)))
  .catch(err => console.error(err));
