# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=20.9.0
FROM node:${NODE_VERSION}-slim
#
# LABEL fly_launch_runtime="Vite"

# Vite app lives here
WORKDIR /app
COPY . .

# Set production environment
ENV NODE_ENV="production"

EXPOSE 8080
CMD [ "node", "./dist/server/server/index.js" ]