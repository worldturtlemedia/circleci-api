# Contributing

First of all, thanks for your interest in contributing to the circleci-api! 🎉

PRs are the preferred way to spike ideas and address issues, if you have time. If you plan on contributing frequently, please feel free to ask to become a maintainer; the more the merrier. 🤙

## Technical overview

This library uses following libraries for development:

- [typescript](http://www.typescriptlang.org/) for typed JavaScript and transpilation
- [prettier](https://prettier.io/) for formating the code
- [jest](https://jestjs.io/) for unit testing
  - run `yarn test:dev` during development
- [rollup](https://rollupjs.org/guide/en) for creating UMD bundles
- [yarn](https://yarnpkg.com/lang/en/) for package management
- [husky](https://github.com/typicode/husky) for git hooks (pre-commit, pre-push)

### 🧪 Tests

Test are written and run via Jest 💪

```sh
# Run whole test suite once
yarn test
# Run test in watch mode
yarn test:watch
# Lint lib and tests, the run tests with coverage
yarn test:prod
```

### 💅 Style guides

Style guides are enforced by robots _(I meant prettier and tslint of course 🤖 )_, so they'll let you know if you screwed something, but most of the time, they'll autofix things for you. Magic right?

Lint and format codebase via npm-script:

```sh
# Lint and autofix using tslint
yarn lint

# Format code with prettier
yarn format
```

#### Commit conventions (via commitizen)

- this is preferred way how to create conventional-changelog valid commits
- if you prefer your custom tool we provide a commit hook linter which will error out, it you provide invalid commit message
- if you are in rush and just wanna skip commit message validation just prefix your message with `WIP: something done` ( if you do this please squash your work when you're done with proper commit message so semantic-release can create Changelog and bump version of your library appropriately )

> Use the great [commitizen CLI](https://github.com/commitizen/cz-cli) to create commits

```sh
# invoke commitizen
yarn commit
```

### 📖 Documentation

```sh
# Build the docs
yarn docs

# Build the docs and watch for file changes
yarn docs:watch
```

## Getting started

### Creating a Pull Request

If you've never submitted a Pull request before please visit http://makeapullrequest.com/ to learn everything you need to know.

#### Setup

1.  Fork the repo.
1.  `git clone` your fork.
1.  Make a `git checkout -b branch-name` branch for your change.
1.  Run `yarn install` (make sure you have node and yarn installed first)

#### Updates

1.  Make sure to add unit tests.
1.  If there is a `*.test.ts` file, update it to include a test for your change, if needed. If this file doesn't exist, please create it.
1.  Run `yarn test` or `yarn test:dev` to make sure all tests are working, regardless if a test was added.
1.  When your work is done run `yarn test --coverage` to ensure your changes are covered.

#### Commiting

1. Run `yarn commit`.
1. Follow all the prompts and create a meaningful commit.
1. Push to your branch.
1. Create PR.

---

## 🚀 Publishing

> releases are handled by awesome [semantic-release](https://github.com/semantic-release/semantic-release)

Whenever a commit is pushed to the `master` branch, the CI server will validate the commit, then run `semantic-release`.

If `semantic-release` decides that the commit is worthy of a new release it will:

- bump package version and git tag
- push to github master branch + push tags
- publish build packages to npm

## License

By contributing your code to the circleci-api GitHub Repository, you agree to license your contribution under the MIT license.
