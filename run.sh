#!/bin/sh

# generate .env file
printf "API_IP=192.168.50.89" > .env

# build project for production
npm run build

openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem -subj "/C=SI/ST=La Paz/L=La Paz/O=Fisiosalud/OU=IT Department/CN=www.example.com"

export NODE_TLS_REJECT_UNAUTHORIZED=0

serve -s dist -l 443 --ssl-cert ./cert.pem --ssl-key ./key.pem