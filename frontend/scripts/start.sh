#!/bin/bash
set -e
IMAGE="frontend-prod:latest"
CONTAINER="frontend-prod"
echo "Checking image ${IMAGE}..."
if [[ "$(docker images -q ${IMAGE} 2>/dev/null)" == "" ]]; then
  echo "Image not found, building production image..."
  docker build -t ${IMAGE} -f Dockerfile .
  echo "Build complete."
fi
echo "Starting production server..."
docker compose -f docker-compose.yml up -d
echo "Container '${CONTAINER}' running at http://localhost:3000"
