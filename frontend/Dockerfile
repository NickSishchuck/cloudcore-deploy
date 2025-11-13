# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the SvelteKit app
RUN npm run build

# SvelteKit with adapter-static builds to 'build' directory
# Copy build output to known location
RUN if [ -d "build" ]; then \
  cp -r build /tmp/output; \
  elif [ -d ".svelte-kit/output/client" ]; then \
  cp -r .svelte-kit/output/client /tmp/output; \
  else \
  echo "ERROR: No build output found!" && exit 1; \
  fi

# Production stage
FROM nginx:alpine

# Copy from the standardized location
COPY --from=builder /tmp/output /usr/share/nginx/html/

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose ports
EXPOSE 80 443

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
