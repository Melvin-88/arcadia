#!/bin/bash -ex
while true ; do 
  sleep 20
  echo "Waiting for RabbitMQ be ready...."
  rabbitmqctl status
  ready=$?
  if [ ${ready} == 0 ]; then
    echo "RabbitMQ is ready, setting ha policy"
    sleep 5
    rabbitmqctl set_policy ha-all '.*' '{"ha-mode":"all"}' --apply-to queues || break
    rabbitmqctl set_policy expiry-and-length '.*' '{"expires":1800000, "max-length":200000}' --apply-to queues || break
    echo "all policies were set successfully"
    break
  fi
  echo "RabbitMQ still not ready..."
  sleep 5
done

