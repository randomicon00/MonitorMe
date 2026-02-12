#!/bin/bash

# Start the Go application in the background
(cd ~/Documents/finishing/monitorme-service && go run main.go) &
GO_PID=$!
echo "Go application started with PID $GO_PID"

# Start the Next.js app with debugging in the background
(cd ~/Documents/finishing/monitorme-ui && PORT=3000 npm run dev --debug) &
NEXT_PID=$!

sudo systemctl start postgresql

echo "PostgreSql db started"

echo "Next.js app started with PID $NEXT_PID"

# Wait for all processes to complete or exit on script termination
trap "sudo systemctl stop postgresql; kill $NEXT_PID $GO_PID" EXIT

# Keep the script running to maintain background processes
wait
