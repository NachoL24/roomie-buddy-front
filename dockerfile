# --- Build stage ------------------------------------------------------------
FROM node:20-alpine AS build

RUN apk add --no-cache curl bash \
  && curl -fsSL https://bun.sh/install | bash \
  && mv ~/.bun/bin/bun /usr/local/bin/ \
  && bun --version

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN echo "Instalando con Bun…" && bun install --frozen-lockfile

# Copy source and build
COPY . .
RUN bun run build


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
