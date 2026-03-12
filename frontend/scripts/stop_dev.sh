#!/bin/bash
echo "Stopping dev server..."
docker compose -f docker-compose.dev.yml down
echo "Stopped."
