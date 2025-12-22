FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build arguments for environment variables
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_API_PORT
ARG NEXT_PUBLIC_TENANT_ID

# Set environment variables for build
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_PORT=$NEXT_PUBLIC_API_PORT
ENV NEXT_PUBLIC_TENANT_ID=$NEXT_PUBLIC_TENANT_ID

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm install typescript

# Copy built application from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]