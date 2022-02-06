#!/bin/bash

mkdir -p ./screenshots

for i in {1..30}; do
  screencapture ./screenshots/capture-${i}.png
  sleep 2
done
