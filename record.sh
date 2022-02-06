#!/bin/bash

mkdir -p ./screenshots

for i in {1..60}; do
  screencapture ./screenshots/capture-${i}.png
  sleep 1
done
