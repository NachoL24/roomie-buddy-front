# --- Build stage ------------------------------------------------------------
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --no-audit --no-fund

# Copy source and build
COPY . .
RUN npm run build


# --- Runtime stage ----------------------------------------------------------
FROM nginx:alpine AS runtime

# Copy built app (Angular's default output for application builder)
COPY --from=build /app/dist/roomie-buddy-front/browser /usr/share/nginx/html

# Copy nginx config and entrypoint
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/entrypoint.sh /docker-entrypoint.sh

RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
