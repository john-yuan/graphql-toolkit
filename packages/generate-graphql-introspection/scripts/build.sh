#!/bin/bash

readonly CURRENT_DIR=$(cd $(dirname $0) && pwd)

cd $CURRENT_DIR/..

rm -rf lib

npm run lint:fix
npm run format
npm run build
