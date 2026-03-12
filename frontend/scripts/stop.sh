#!/bin/bash
echo "Stopping production server..."
docker compose -f docker-compose.yml down
echo "Stopped."
