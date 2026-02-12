#Start the services in the background and save their PIDs
mongod --dbpath /data/db --bind_ip 127.0.0.1 &
PIDS="$!"
sleep 2
(cd ~/Documents/finishing/server-middleware-js/example-server-collect/serviceA && npm run start) &
PIDS="$PIDS $!"
(cd ~/Documents/finishing/server-middleware-js/example-server-collect/serviceB && npm run start) &
PIDS="$PIDS $!"
(cd ~/Documents/finishing/server-middleware-js/example-server-collect/frontend && PORT=3238 npm run start) &
PIDS="$PIDS $!"
sleep 2

# Trap to kill the background services on script exit
trap "kill $PIDS" EXIT

# Wait for all services to be up
sleep 1

wait
