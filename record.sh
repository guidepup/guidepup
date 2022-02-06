#!/bin/bash

for i in {1..30}; do
  screencapture ./capture-${i}.png
  sleep 2
done
