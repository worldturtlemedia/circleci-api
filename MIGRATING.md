# v3.x.x to v4.0.0

Version 4 includes the following changes:

1. **BREAKING** The ability to supply a custom url for the CircleCI API, to support self-hosted solutions.
   - This required restructuring some of the method calls, so that the last parameter was an object, instead of being in the middle.
2. Deprecation of `circleGet/Post/Delete` from `client.ts
   - Will be removed in the _next_ version

## Parameter Restructure

### Example

Before the restructure:

```typescript
getBuildArtifacts(
  "my-token",
  { circleHost: "https://mycircleci.com/", owner: "foo", repo: "bar" },
  42
);
```

The `buildNumber` parameter is at the end, and if the line is formatted:

```typescript
getBuildArtifacts(
  "my-token",
  {
    circleHost: "https://mycircleci.com/",
    owner: "foo",
    repo: "bar"
  },
  42
);
```

It can look a bit weird since the final parameter is at the end. The restructuring allows for better readability:

```typescript
getBuildArtifacts("my-token", 42, {
  circleHost: "https://mycircleci.com/",
  owner: "foo",
  repo: "bar"
});
```

You are **not** affected if you use the `CircleCI` class, only if you use the standalone functions.

### Functions affected:

```typescript
// Old
getFullBuild(token: string, vcs: GitInfo, buildNumber: number)
// New
getFullBuild(token: string, buildNumber: number, options: GitInfo & CircleOptions)

// Old
getBuildArtifacts(token: string, vcs: GitInfo, buildNumber: number)
// New
getFullBuild(token: string, buildNumber: number, options: GitInfo & CircleOptions)

// Old
addEnv(token: string, vcs: GitInfo, payload: EnvVariable)
// New
addEnv(token: string, payload: EnvVariable,  options: GitInfo & CircleOptions)

// Old
getEnvVar(token: string, vcs: GitInfo, envName: string)
// New
getEnvVar(token: string, envName: string,  options: GitInfo & CircleOptions)

// Old
deleteEnvVar(token: string, vcs: GitInfo, envName: string)
// New
deleteEnvVar(token: string, envName: string,  options: GitInfo & CircleOptions)

// Old
createCheckoutKey(token: string, vcs: GitInfo, key: CheckoutKey)
// New
createCheckoutKey(token: string, key: CheckoutKey, options: GitInfo & CircleOptions)

// Old
createCheckoutKey(token: string, vcs: GitInfo, fingerprint: string)
// New
createCheckoutKey(token: string, fingerprint: string, options: GitInfo & CircleOptions)

// Old
deleteCheckoutKey(token: string, vcs: GitInfo, fingerprint: string)
// New
deleteCheckoutKey(token: string, fingerprint: string, options: GitInfo & CircleOptions)

// Old
getTestMetadata(token: string, vcs: GitInfo, buildNumber: number)
// New
getTestMetadata(token: string, buildNumber: number, options: GitInfo & CircleOptions)

// Old
postBuildActions(
  token: string,
  buildNumber: number,
  vcs: GitInfo,
  action: BuildAction,
// New
postBuildActions(
  token: string,
  buildNumber: number,
  action: BuildAction,
  { circleHost, ...vcs }: GitInfo & CircleOptions
)
```

## Deprecation of http helpers

The following functions from `src/client.ts` have been deprecated:

1. `circleGet<T>`
1. `circlePost<T>`
1. `circleDelete<T>`

They were just wrappers for `client("token").get(...)` and seem like unnecessary bloat. They have been deprecated and will be removed in the next major update.

You just need to replace them with calls to the `client`:

```typescript
// Old
circleGet("my-token", "/projects", {
  timeout: 1000,
  baseURL: "https://my-circleci.com"
});

// New
client("my-token", "https://my-circleci.com").get("/projects", {
  timeout: 1000
});
```
