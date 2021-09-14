#!/bin/bash

# Usage: ./compile-build.sh <archive_name> <relative_path_to_folder>

# Set
# -e Exit the script as soon as something goes wrong
# -v Verbose - print out commands as they are executed
set -ev

# Building assets
yarn build --dest $2/public --report

# Storing revision hash
git rev-parse HEAD > $2/REVISION

# Creating tar.gz
tar -zcvf $1 -C $2 .
