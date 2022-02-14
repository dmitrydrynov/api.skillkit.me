#!/usr/bin/env bash

if [ "$NODE_ENV" == "production" ] 
then
  node db/migrate.js up
  node db/seed.js up
else
  yarn migrate up
  yarn seed up
fi

exec "$@"