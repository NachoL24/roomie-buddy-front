#!/bin/sh
set -eu

# Where the built app is served from
PUBLIC_DIR="/usr/share/nginx/html"

# Generate env.js from environment variables
cat > ${PUBLIC_DIR}/env.js <<EOF
(function(w){
  w.__env = w.__env || {};
  w.__env.API_BASE_URL = "${API_BASE_URL:-pruebas}";
  w.__env.AUTH0_DOMAIN = "${AUTH0_DOMAIN:-pruebas}";
  w.__env.AUTH0_CLIENT_ID = "${AUTH0_CLIENT_ID:-pruebas}";
  w.__env.AUTH0_AUDIENCE = "${AUTH0_AUDIENCE:-pruebas}";
})(window);
EOF

# Start nginx
exec nginx -g 'daemon off;'
