import { CircleCI } from "circleci-api";

const api = new CircleCI({
  token: " ", // Not needed for latest artifacts endpoint
  vcs: {
    owner: "worldturtlemedia",
    repo: "circleci-api",
  },
});

api
  .latestArtifacts()
  .then((x) => {
    console.log(`Found ${x.length} artifacts!`);
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
