# ============================================================
# AETHERIX presents AFTER THE FIRE
# Multi-stage Dockerfile — Cross-platform (Windows, macOS ARM/Intel, Linux)
# ============================================================

# ---- Stage 1: Build Application ---------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Cache dependencies
COPY package*.json ./
RUN npm ci

# Copy project files
COPY . .

# Build arguments for public client-facing mapping keys
ARG VITE_MAPTILER_API_KEY=""
ARG VITE_CARTO_BASEMAPS_KEY="cb1_59lw_1_b"

ENV VITE_MAPTILER_API_KEY=$VITE_MAPTILER_API_KEY
ENV VITE_CARTO_BASEMAPS_KEY=$VITE_CARTO_BASEMAPS_KEY

# Build production bundle
RUN npm run build

# ---- Stage 2: Production Nginx Server ----------------------
FROM nginx:alpine AS runner

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built application from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration for React SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose container port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:80/healthz || exit 1

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
