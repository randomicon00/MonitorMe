#Start the services in the background and save their PIDs
mongod --dbpath /data/db --bind_ip 127.0.0.1 &
PIDS="$!"
sleep 2
(cd ~/Documents/finishing/server-middleware-js/example-server-collect/serviceA && npm run start) &
PIDS="$PIDS $!"
sleep 2
#(cd ~/Documents/finishing/server-middleware-js/example-server-collect/serviceB && npm run start) &
#PIDS="$PIDS $!"
#sleep 2
#(cd ~/Documents/finishing/server-middleware-js/example-server-collect/serviceC && npm run start) &
#PIDS="$PIDS $!"
#sleep 2
#(cd ~/Documents/finishing/monitorme-service && go run main.go) &
#PIDS="$PIDS $!"
#sudo systemctl start postgresql

# Trap to kill the background services on script exit
#trap "sudo systemctl stop postgresql; kill $PIDS" EXIT
trap "kill $PIDS" EXIT

# Wait for all services to be up
sleep 1

curl -X POST http://localhost:3003/api/items \
    -H "x-segment-id: f4656a7e-5a0d-4a66-bc2c-a60ba2ad1889" \
    -H "x-session-id: f3232321-5a0d-4a66-bccc-a60ba2ad18ad" \
    -H "x-user-id: 1232313-5a0d-4a66-bc2c-a60ba2ad1b" \
    -H "x-trigger-route: /api/items" \
    -H "x-request-data: adding-new-request " \
    -d '{"name": "Sample Item", "description": "This is a sample item"}'
sleep 2

curl -X GET http://localhost:3003/api/items \
    -H "x-segment-id: f465aa7e-5a0d-4166-b781-a60ba2ad1889" \
    -H "x-session-id: f3232d21-5e0d-4166-baaa-110ba2ad1728" \
    -H "x-user-id: 1232313-5a0d-4a66-bc2c-a60ba2ad1b" \
    -H "x-trigger-route: /api/items" \
    -H "x-request-data: requesting-items "

sleep 1

curl -X GET http://localhost:3003/not-found \
    -H "x-segment-id: f165aa7e-5a0d-4166-b184-a60ba2ad1889" \
    -H "x-session-id: f1232d21-5e0d-4166-b827-110ba2ad1728" \
    -H "x-user-id: 1332313-1a0d-4a66-bc2c-a60ba2ad1b" \
    -H "x-trigger-route: /not-found" \
    -H "x-request-data: wrong "

sleep 1

curl -X GET http://localhost:3003/not-found-2 \
    -H "x-segment-id: f165aa7e-5a0d-4166-b18a-a60ba2ad1889" \
    -H "x-session-id: f1232d21-5e0d-4166-b822-110ba2ad1728" \
    -H "x-user-id: 1332313-1a0d-4a66-bc2c-a60ba2ad1b" \
    -H "x-trigger-route: /not-found" \
    -H "x-request-data: wrong "

wait
