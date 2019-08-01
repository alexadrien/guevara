#!/usr/bin/env bash

rm -rf segment-logs output
aws s3 sync s3://guevara-analytics .
find ./segment-logs -name "*.gz" -exec gunzip {} \;
find ./segment-logs -name "*" -type f -exec python -m json.tool {} \; > output
