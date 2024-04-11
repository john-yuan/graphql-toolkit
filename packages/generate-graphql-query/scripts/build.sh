#!/bin/bash

readonly CURRENT_DIR=$(cd $(dirname $0) && pwd)

cd $CURRENT_DIR/..

rm -rf es
rm -rf lib

npm run test
npm run coverage:badges
npm run build
npm run lint:fix
npm run format

rm es/index.test.*
rm lib/index.test.*
rm lib/index.d.ts

rm -rf es/example
rm -rf lib/example

npm run minify
