#!/bin/sh

# generate .env file
printf "API_IP=mpm.fisiosalud.lan" > .env

# build project for production
npm run build

export NODE_TLS_REJECT_UNAUTHORIZED=0

serve -s dist -l 443 --ssl-cert ./mpmlf.crt --ssl-key ./mpmlf.key
