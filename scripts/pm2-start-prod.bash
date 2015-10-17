#!/usr/bin/env bash
NODE_ENV=production pm2 start server.js --name iamamaze --node-args="--harmony"