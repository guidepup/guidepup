#/bin/bash

for i in {1..20}
do
  screencapture ./artifacts/capture-${i}.png
  sleep 1
done
