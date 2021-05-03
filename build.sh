#!/usr/bin/env bash
CUR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
pushd $CUR/linker
wasm-pack build -d nodejs --release --target nodejs # build as nodejs
popd
./node_modules/.bin/tsc

# build for web
webpack