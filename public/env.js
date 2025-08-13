// This file is served statically. Override it with environment variables at container runtime.
(function (w) {
  w.__env = w.__env || {};
  // API
  w.__env.API_BASE_URL = w.__env.API_BASE_URL || "http://localhost:3000";
  // Auth0
  w.__env.AUTH0_DOMAIN =
    w.__env.AUTH0_DOMAIN || "dev-5vezrqyf1x1t184t.us.auth0.com";
  w.__env.AUTH0_CLIENT_ID =
    w.__env.AUTH0_CLIENT_ID || "hyCtD4sF3LWakI8X6yWfojqapjjTVZcA";
  w.__env.AUTH0_AUDIENCE =
    w.__env.AUTH0_AUDIENCE ||
    "https://dev-5vezrqyf1x1t184t.us.auth0.com/api/v2/";
})(window);
