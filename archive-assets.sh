#!/bin/bash
set -ev

# Storing revision hash
git rev-parse HEAD > dist/REVISION

# Creating tar.gz
tar -zcvf $1 -C dist .
