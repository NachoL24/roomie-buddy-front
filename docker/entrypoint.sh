#!/bin/sh
set -eu

# Where the built app is served from
PUBLIC_DIR="/usr/share/nginx/html"

# Generate env.js from environment variables
cat > ${PUBLIC_DIR}/env.js <<EOF
(function(w){
  w.__env = w.__env || {};
  w.__env.API_BASE_URL = "${API_BASE_URL:-http://localhost:3000}";
  w.__env.AUTH0_DOMAIN = "${AUTH0_DOMAIN:-dev-5vezrqyf1x1t184t.us.auth0.com}";
  w.__env.AUTH0_CLIENT_ID = "${AUTH0_CLIENT_ID:-hyCtD4sF3LWakI8X6yWfojqapjjTVZcA}";
  w.__env.AUTH0_AUDIENCE = "${AUTH0_AUDIENCE:-https://dev-5vezrqyf1x1t184t.us.auth0.com/api/v2/}";
})(window);
EOF

# Start nginx
exec nginx -g 'daemon off;'
