#/bin/bash

for i in {1..30}
do
  screencapture ./artifacts/capture-${i}.png
  sleep 1
done
