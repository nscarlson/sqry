#!/bin/bash

# shellcheck disable=SC1091
source scripts/helpers/display-env.sh

concurrently --raw --kill-others \
  "cross-env NODE_ENV=development electron-webpack dev"
