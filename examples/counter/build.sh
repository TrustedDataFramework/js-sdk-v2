CUR=$(dirname $0)
echo $CUR
pushd $CUR/../..

# compile without GC
asc examples/counter/assembly/index.ts --binaryFile examples/counter/bin/counter.wasm --optimize --runtime stub --use abort=assembly/index/abort
popd 
