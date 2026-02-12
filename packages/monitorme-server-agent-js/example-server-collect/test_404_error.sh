#Start the services in the background and save their PIDs
mongod --dbpath /data/db --bind_ip 127.0.0.1 &
PIDS="$!"
sleep 2
(cd ~/Documents/finishing/server-middleware-js/example-server-collect/serviceA && npm run start) &
PIDS="$PIDS $!"
sleep 2

# Trap to kill the background services on script exit
#trap "sudo systemctl stop postgresql; kill $PIDS" EXIT
trap "kill $PIDS" EXIT

# Wait for all services to be up
sleep 1

curl -X GET http://localhost:3003/api/not-found \
    -H "x-segment-id: f465aa7e-5a0d-4166-b781-a60ba2ad1889" \
    -H "x-session-id: f3232d21-5e0d-4166-baaa-110ba2ad1728" \
    -H "x-user-id: 1232313-5a0d-4a66-bc2c-a60ba2ad1b"

sleep 1

wait
