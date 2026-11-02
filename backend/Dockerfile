# Node.js 22 on Alpine Linux (small image size)
FROM node:22-alpine

# Run in production mode
ENV NODE_ENV=production

# Application directory inside the container
WORKDIR /app

# Copy dependency manifests first so Docker can cache the install layer
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev && npm cache clean --force

# Copy the backend source files (filtered by .dockerignore)
COPY . .

# Give the unprivileged "node" user ownership of the app files
RUN chown -R node:node /app

# Run as a non-root user
USER node

# Documentation only: the app listens on the PORT env variable
# (Render injects PORT at runtime; server.js falls back to 5000 locally)
EXPOSE 5000

# Start the application
CMD ["node", "server.js"]
