#!/usr/bin/env bash

node build/db/migrate.js up
node build/db/seed.js up

exec "$@"