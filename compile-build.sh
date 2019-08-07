#!/bin/bash

# Usage: ./compile-build.sh <archive_name> <environment>

set -ev

# Building assets
yarn build --mode $2 --dest dist/public

# Storing revision hash
git rev-parse HEAD > dist/REVISION

# Creating tar.gz
tar -zcvf $1 -C dist .
