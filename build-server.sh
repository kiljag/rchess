#!/bin/sh

rm -rf ./build/*
rm -rf ./server/dist/public
npm run build
cd ./server
npm run build
cp -r ../build ../server/dist/public
