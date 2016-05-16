#!/usr/bin/env bash

export NODE_ENV=production
export LOG_LEVEL=error

pm2 start 'server.js' \
--name iamamaze \
--node-args="--nouse-idle-notification"
