# ── Build stage ────────────────────────────────────────
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first (better layer caching)
COPY package*.json ./

# Install production dependencies only
RUN npm install --omit=dev

# Copy the rest of the server code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Expose the port
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
