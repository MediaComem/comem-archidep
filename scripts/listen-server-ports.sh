#!/bin/bash

pids=''

echo OK | nc -k -l 80 &
pids="$pids $!"

echo OK | nc -k -l 443 &
pids="$pids $!"

echo OK | nc -k -l 3000 &
pids="$pids $!"

echo OK | nc -k -l 3001 &
pids="$pids $!"

echo PIDS: $pids
trap "kill $pids" EXIT

while true; do
  sleep 1
done
