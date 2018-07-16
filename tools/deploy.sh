#!/bin/bash

echo "TRAVIS_BRANCH -> $TRAVIS_BRANCH : TRAVIS_PULL_REQUEST -> $TRAVIS_PULL_REQUEST"
if [[ "$TRAVIS_BRANCH" == "master" && $TRAVIS_PULL_REQUEST == "false" ]]; then
  echo "Running deploy..."
  npm run deploy-docs
  npm run semantic-release
else
  echo "Skipping deploy..."
fi
