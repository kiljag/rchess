#!/bin/sh

rm -rf ./build/*
rm -rf ./server/dist/public
npm run build
cp -r ./build ./server/dist/public
cd ./server
tsc --project tsconfig.json
node ./dist/index.js

