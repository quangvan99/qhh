#!/bin/bash
set -e
IMAGE="frontend-dev:latest"
CONTAINER="frontend-dev"
echo "Checking dev image ${IMAGE}..."
if [[ "$(docker images -q ${IMAGE} 2>/dev/null)" == "" ]]; then
  echo "Dev image not found, building..."
  docker build -t ${IMAGE} -f Dockerfile.dev .
  echo "Dev build complete."
fi
echo "Starting dev server with hot-reload..."
docker compose -f docker-compose.dev.yml up -d
echo "Container '${CONTAINER}' running at http://localhost:3000"
echo "Source code mounted. Changes reflect instantly."
