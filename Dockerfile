FROM node:18-alpine as base
WORKDIR /app
COPY server/package*.json /app/server/

WORKDIR /app/server
RUN npm install

COPY server/dist /app/server/dist 
COPY client/build /app/client/build

EXPOSE 8080
CMD ["node", "./dist/index.js"]
