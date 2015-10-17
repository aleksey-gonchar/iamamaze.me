#!/usr/bin/env bash
NODE_ENV=development pm2 start server.js --name live-monitor --node-args="--use_strict"