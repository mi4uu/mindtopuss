#!/usr/bin/env bash
set -eo pipefail

# Automatically generated by moon. DO NOT MODIFY!
# https://moonrepo.dev/docs/guides/vcs-hooks

if ! git diff --quiet; then
  git add .
  git commit --amend --no-edit
fi


