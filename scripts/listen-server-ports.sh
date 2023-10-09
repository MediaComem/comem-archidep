#!/bin/bash

pids=''
dir="/tmp/listen-server-ports"

function cleanup() {
  echo "Cleaning up..."
  rm -rf "$dir"
  test -n "$pids" && kill $pids
}

trap "cleanup" EXIT

mkdir -p "$dir"
chmod 700 "$dir"
echo -n OK > "$dir/test.txt"
cd $dir

busybox httpd -f -p 80 &
pids="$pids $!"

busybox httpd -f -p 443 &
pids="$pids $!"

busybox httpd -f -p 3000 &
pids="$pids $!"

busybox httpd -f -p 3001 &
pids="$pids $!"

echo PIDS: $pids

while true; do
  sleep 1
done
