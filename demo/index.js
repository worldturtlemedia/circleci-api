const { CircleCI } = require("circleci-api");

const api = new CircleCI({
  token: " ", // Not needed for latest artifacts endpoint
  vcs: {
    owner: "worldturtlemedia",
    repo: "circleci-api"
  }
});

console.log("Getting latest artifacts");
api
  .latestArtifacts()
  .then(x => {
    if (x.length) x.forEach(y => console.log(`found ${y.url}`));
    else console.log("No artifacts!");
  })
  .catch(err => console.error(err));
