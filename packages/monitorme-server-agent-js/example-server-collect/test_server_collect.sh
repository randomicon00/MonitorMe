#Start the services in the background and save their PIDs
mongod --dbpath /data/db --bind_ip 127.0.0.1 &
PIDS="$!"
sleep 2
(cd ~/Documents/finishing/server-middleware-js/example-server-collect/serviceA && npm run start) &
PIDS="$PIDS $!"
sleep 2
(cd ~/Documents/finishing/server-middleware-js/example-server-collect/serviceB && npm run start) &
PIDS="$PIDS $!"
sleep 2
(cd ~/Documents/finishing/server-middleware-js/example-server-collect/serviceC && npm run start) &
PIDS="$PIDS $!"
sleep 2
(cd ~/Documents/finishing/monitorme-service && go run main.go) &
PIDS="$PIDS $!"

sudo systemctl start postgresql

# Trap to kill the background services on script exit
trap "sudo systemctl stop postgresql; kill $PIDS" EXIT

# Wait for all services to be up
sleep 3

curl -X GET http://localhost:3003/api/call-service-b \
    -H "x-segment-id: f4656a7e-5a0d-4a66-bc2c-a60ba2ad1889" \
    -H "x-session-id: session-abc" \
    -H "x-user-id: user-001" \
    -H "x-trigger-route: /api/call-service-b" \
    -H "x-request-data: call-service-b"
sleep 2
curl -X GET http://localhost:3003/api/call-service-b \
    -H "x-segment-id: f4656a7e-5a0d-4a66-bc2c-a60ba2ad1889"

-H "x-session-id: session-abc" \
    -H "x-user-id: user-001" \
    -H "x-trigger-route: /api/call-service-b" \
    -H "x-request-data: call-service-b"
sleep 2
curl -X GET http://localhost:3003/api/call-service-b \
    -H "x-segment-id: segment-123" \
    -H "x-session-id: session-abc" \
    -H "x-user-id: user-002" \
    -H "x-trigger-route: /api/call-service-b" \
    -H "x-request-data: call-service-b"
sleep 2
curl -X GET http://localhost:3003/api/call-service-b \
    -H "x-segment-id: f4656a7e-5a0d-4a66-bc2c-a60ba2ad1889" \
    -H "x-session-id: session-abc" \
    -H "x-user-id: user-001" \
    -H "x-trigger-route: /api/call-service-b" \
    -H "x-request-data: call-service-b"
sleep 2
curl -X GET http://localhost:3003/api/call-service-b \
    -H "x-segment-id: segment-230" \
    -H "x-session-id: session-abc" \
    -H "x-user-id: user-002" \
    -H "x-trigger-route: /api/call-service-b" \
    -H "x-request-data: call-service-b"

sleep 2
curl -X GET http://localhost:3003/api/call-service-b \
    -H "x-segment-id: segment-230" \
    -H "x-session-id: session-abc" \
    -H "x-user-id: user-002" \
    -H "x-trigger-route: /api/call-service-b" \
    -H "x-request-data: call-service-b"

sleep 2
curl -X GET http://localhost:3003/api/call-service-b \
    -H "x-segment-id: segment-230" \
    -H "x-session-id: session-abc" \
    -H "x-user-id: user-002" \
    -H "x-trigger-route: /api/call-service-b" \
    -H "x-request-data: call-service-b"

sleep 2
curl -X GET http://localhost:3003/api/call-service-b \
    -H "x-segment-id: segment-230" \
    -H "x-session-id: session-abc" \
    -H "x-user-id: user-002" \
    -H "x-trigger-route: /api/call-service-b" \
    -H "x-request-data: call-service-b"

sleep 2
curl -X GET http://localhost:3003/api/call-service-b \
    -H "x-segment-id: segment-230" \
    -H "x-session-id: session-abc" \
    -H "x-user-id: user-002" \
    -H "x-trigger-route: /api/call-service-b" \
    -H "x-request-data: call-service-b"

sleep 2
# Request that should return a 404 error
curl -X GET http://localhost:3003/api/not-found \
    -H "x-segment-id: segment-404" \
    -H "x-session-id: session-xyz" \
    -H "x-user-id: user-32" \
    -H "x-trigger-route: /api/not-found" \
    -H "x-request-data: {\"test\":\"not-found-test\"}"
sleep 1
# Request that should return a 500 error
curl -X GET http://localhost:3003/api/internal-error \
    -H "x-segment-id: segment-330" \
    -H "x-session-id: session-ccd" \
    -H "x-user-id: user-30" \
    -H "x-trigger-route: /api/internal-error" \
    -H "x-request-data: {\"test\":\"internal-error-test\"}"

sleep 2
curl -X GET http://localhost:3003/api/call-service-b \
    -H "x-segment-id: segment-230" \
    -H "x-session-id: session-abc" \
    -H "x-user-id: user-002" \
    -H "x-trigger-route: /api/call-service-b" \
    -H "x-request-data: call-service-b"

sleep 2
curl -X GET http://localhost:3003/api/call-service-b \
    -H "x-segment-id: segment-230" \
    -H "x-session-id: session-abc" \
    -H "x-user-id: user-002" \
    -H "x-trigger-route: /api/call-service-b" \
    -H "x-request-data: call-service-b"

sleep 2
curl -X GET http://localhost:3003/api/call-service-b \
    -H "x-segment-id: segment-230" \
    -H "x-session-id: session-abc" \
    -H "x-user-id: user-002" \
    -H "x-trigger-route: /api/call-service-b" \
    -H "x-request-data: call-service-b"

sleep1
# Request that should return a 404 error
curl -X GET http://localhost:3003/api/not-found \
    -H "x-segment-id: segment-404" \
    -H "x-session-id: session-xyz" \
    -H "x-user-id: user-404" \
    -H "x-trigger-route: /api/not-found" \
    -H "x-request-data: {\"test\":\"not-found-test\"}"
sleep 1
# Request that should return a 500 error
curl -X GET http://localhost:3003/api/internal-error \
    -H "x-segment-id: segment-500" \
    -H "x-session-id: session-abc" \
    -H "x-user-id: user-500" \
    -H "x-trigger-route: /api/internal-error" \
    -H "x-request-data: {\"test\":\"internal-error-test\"}"

sleep 2
curl -X GET http://localhost:3003/api/call-service-b \
    -H "x-segment-id: segment-230" \
    -H "x-session-id: session-abc" \
    -H "x-user-id: user-002" \
    -H "x-trigger-route: /api/call-service-b" \
    -H "x-request-data: call-service-b"

sleep 2
curl -X GET http://localhost:3003/api/call-service-b \
    -H "x-segment-id: segment-230" \
    -H "x-session-id: session-abc" \
    -H "x-user-id: user-002" \
    -H "x-trigger-route: /api/call-service-b" \
    -H "x-request-data: call-service-b"

sleep 2
curl -X GET http://localhost:3003/api/call-service-b \
    -H "x-segment-id: segment-230" \
    -H "x-session-id: session-abc" \
    -H "x-user-id: user-002" \
    -H "x-trigger-route: /api/call-service-b" \
    -H "x-request-data: call-service-b"

sleep 2
curl -X GET http://localhost:3003/api/call-service-b \
    -H "x-segment-id: segment-230" \
    -H "x-session-id: session-abc" \
    -H "x-user-id: user-002" \
    -H "x-trigger-route: /api/call-service-b" \
    -H "x-request-data: call-service-b"

wait
