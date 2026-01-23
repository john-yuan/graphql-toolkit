#!/bin/bash

readonly ROOT_DIR=$(cd $(dirname $0)/.. && pwd)

cd $ROOT_DIR
cd packages/generate-graphql-introspection

./scripts/build.sh

cd $ROOT_DIR
cd packages/generate-graphql-client

./scripts/build.sh

cd $ROOT_DIR
cd packages/generate-graphql-query

./scripts/build.sh
