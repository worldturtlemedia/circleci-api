# CircleCi API Wrapper

[![CircleCI](https://circleci.com/gh/jordond/circleci-api.svg?style=svg)](https://circleci.com/gh/jordond/circleci-api) [![Build Status](https://travis-ci.org/jordond/circleci-api.svg?branch=master)](https://travis-ci.org/jordond/circleci-api) [![Coverage Status](https://coveralls.io/repos/github/jordond/circleci-api/badge.svg?branch=master)](https://coveralls.io/github/jordond/circleci-api?branch=master) [![Greenkeeper badge](https://badges.greenkeeper.io/jordond/circleci-api.svg)](https://greenkeeper.io/)

**Warning:** This is still a work-in-progress, so not all the endpoints are available

A wrapper around the [CircleCi API](https://circleci.com/docs/api/v1-reference/) written in TypeScript. If used in a TypeScript project, you will get types, and auto-complete for all of the api responses. You will no longer need to tab back and fourth to the API documentation. Will work in Node or the browser!

I recommend using this library if you are writing a tool or website in TypeScript. I have created definitions for each of the CircleCi endpoints. There may still be some errors, but I am open to contributions on making them better.

If there are any features you would like, please feel free to open up an issue.

**NOTE: Most of the endpoints are covered, but I will be adding the rest shortly**

## Installation

Add using yarn or npm

```bash
yarn add circleci-api

## or

npm install circleci-api
```

## Usage

Get your API token from [CircleCi](https://circleci.com/account/api)

There are two ways to use this library.

## 1. CircleCi class

Get instance of the factory.

```typescript
// Module
import { CircleCI, GitType } from "circleci-api";

// Configure the factory with some defaults
const options: FactoryOptions = {
  // Required for all requests
  token: "", // Set your CircleCi API token

  // Optional
  // Anything set here can be overriden when making the request

  // Git information is required for project/build/etc endpoints
  vcs: {
    type: GitType.GITHUB, // default: github
    owner: "jordond",
    repo: "circleci-api"
  }

  // Optional query params for requests
  options: {
    branch: "master", // default: master
    filter: "completed"
  }
}

// Create the api object
const api = new CircleCI(options)

// Use the api

/**
 * Grab the latest artifacts from a successful build on a certain branch
 * @param [branch="master"] - Artifacts for certain branch
 * @return List of successfully built artifact objects
 */
export async function getLatestArtifacts(branch: string = "master"): Promise<Artifact[]> {
  try {
    // Will use the repo defined in the options above
    const result: Aritfact[] = await api.latestArtifacts({ options: { branch, filter: "successful" } })
    console.log(`Found ${result.length} artifacts`)
    return result
  } catch (error) {
    console.log("No build artifacts found")
  }

  return []
}

getLatestArtifacts("develop")
  .then(artifacts => {
    artifacts
      .forEach(({ path, url }: Artifact) => console.log(`${path} -> ${url}`))
  })

// Or override settings set above
api
  .latestArtifacts({ vcs: { repo: "awesome-repo" } })
  .then((artifacts: Artifact[]) => console.log(`Found ${artifacts.length} artifacts`))
  .catch(error => console.error(error))
```

## 2. Manually

The individual functions can also be imported if you only need one or two. To help with tree-shaking.

```typescript
import { getMe, getLatestArtifacts } from "circleci-api";

const CIRCLECI_TOKEN: string = "circle-ci-token";

getMe(CIRCLECI_TOKEN)
  .then(me => console.log("token is valid"))
  .catch(error => console.error("invalid token"));

getLatestArtifacts(CIRCLECI_TOKEN, {
  vcs: {
    owner: "billyBob",
    repo: "super-cool-app"
  },
  options: {
    filter: "failed",
    branch: "feature-smith2"
  }
})
  .then(result => console.log(`Found ${result.length} artifacts`))
  .catch(error => console.error(error));
```

## Supported endpoints

Using factory:

Optional properties:

```typescript
export interface CircleRequest {
  token?: string;
  vcs?: GitInfo;
  options?: Options;
}
```

Any function with an _optional_ paramater of `CircleRequest` can override any of the values you assigned when using the `circleci()` factory.

| Name                |          Required           |              Optional               |           Returns |
| ------------------- | :-------------------------: | :---------------------------------: | ----------------: |
| `me()`              |            none             |                none                 |              `Me` |
| `projects()`        |            none             |           `CircleRequest`           |       `Project[]` |
| `followProject()`   |     `{ vcs: GitInfo }`      |                none                 | `FollowNewResult` |
| `recentBuilds()`    |            none             | `{ limit: number, offset: number }` |  `BuildSummary[]` |
| `builds()`          |            none             | `{ limit: number, offset: number }` |  `BuildSummary[]` |
| `buildsFor()`       | `branch: string = "master"` | `{ limit: number, offset: number }` |  `BuildSummary[]` |
| `build()`           |    `buildNumber: number`    |           `CircleRequest`           |  `BuildWithSteps` |
| `artifacts()`       |    `buildNumber: number`    |           `CircleRequest`           |      `Artifact[]` |
| `latestArtifacts()` |            none             |           `CircleRequest`           |      `Artifact[]` |
| `retry()`           |    `buildNumber: number`    |           `CircleRequest`           |    `BuildSummary` |
| `cancel()`          |    `buildNumber: number`    |           `CircleRequest`           |    `BuildSummary` |
| `triggerBuild()`    |            none             |           `CircleRequest`           |           `Build` |
| `triggerBuildFor()` | `branch: string = "master"` |           `CircleRequest`           |           `Build` |

## Missing endpoints

I am working on adding support for the following remaining endpoints.

| Name                    |                                      Link                                      |
| ----------------------- | :----------------------------------------------------------------------------: |
| Clear cache             |         [ref](https://circleci.com/docs/api/v1-reference/#clear-cache)         |
| List env variable       | [ref](https://circleci.com/docs/api/v1-reference/#list-environment-variables)  |
| Add env variable        |  [ref](https://circleci.com/docs/api/v1-reference/#add-environment-variable)   |
| Get single env variable |  [ref](https://circleci.com/docs/api/v1-reference/#get-environment-variable)   |
| Delete env variable     | [ref](https://circleci.com/docs/api/v1-reference/#delete-environment-variable) |
| List checkout keys      |     [ref](https://circleci.com/docs/api/v1-reference/#list-checkout-keys)      |
| New checkout key        |      [ref](https://circleci.com/docs/api/v1-reference/#new-checkout-key)       |
| Get checkout key        |      [ref](https://circleci.com/docs/api/v1-reference/#get-checkout-key)       |
| Delete checkout key     |     [ref](https://circleci.com/docs/api/v1-reference/#delete-checkout-key)     |
| Test metadata           |        [ref](https://circleci.com/docs/api/v1-reference/#test-metadata)        |
| SSH keys                |          [ref](https://circleci.com/docs/api/v1-reference/#ssh-keys)           |
| Heroku keys             |         [ref](https://circleci.com/docs/api/v1-reference/#heroku-keys)         |

## Contributing

This library uses boilerplate [typescript-library-starter](https://github.com/alexjoverm/typescript-library-starter). So see that repo for more information about the setup, and layout of the files.

1.  Fork this repo
1.  Add your awesome feature
1.  If adding functionality, add tests for your feature
1.  Submit a PR

Example:

```bash
# Setup
git clone https://github.com/jordond/circleci-api
cd circleci-api

yarn

# Make some changes

...

# Run tests then build
yarn test:prod
yarn build

# If all is good, open a PR!
```

## License

```
Copyright 2018 Jordon de Hoog

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy,
modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```
