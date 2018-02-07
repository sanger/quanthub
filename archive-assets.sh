#!/bin/bash
set -ev

# Building assets
npm run build

# Storing revision hash
git rev-parse HEAD > $2/REVISION

# Creating tar.gz
tar -zcvf $1 -C $2 .
