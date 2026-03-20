FROM node:20-alpine

WORKDIR /app

# Copy package files from the server subdirectory
COPY server/package*.json ./

# Install production dependencies
RUN npm install --omit=dev

# Copy the rest of the server source code
COPY server/ .

# Create uploads directory
RUN mkdir -p uploads

EXPOSE 5000

CMD ["node", "server.js"]
