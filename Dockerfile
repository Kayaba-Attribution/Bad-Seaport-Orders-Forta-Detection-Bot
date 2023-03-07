# Build stage: compile Typescript to Javascript
FROM node:18.14.2 AS builder
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build
#RUN npm run obfuscate

# Final stage: copy compiled Javascript from previous stage and install production dependencies
FROM node:18.14.2
ENV NODE_ENV=production
# Uncomment the following line to enable agent logging
LABEL "network.forta.settings.agent-logs.enable"="true"
WORKDIR /app
COPY --from=builder /app/dist ./src
COPY package*.json ./
RUN npm ci --production
CMD [ "npm", "run", "start:prod" ]