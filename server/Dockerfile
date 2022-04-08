FROM node AS builder

WORKDIR /usr/local/chat-app-api

COPY package.json ./

RUN npm install

COPY  . .

RUN npm run build

RUN npm prune --production

FROM node

WORKDIR /usr/local/chat-app-ui

COPY --from=builder /usr/local/chat-app-api/dist ./dist
COPY --from=builder /usr/local/chat-app-api/node_modules ./node_modules
COPY --from=builder /usr/local/chat-app-api/images ./images
COPY --from=builder /usr/local/chat-app-api/public ./public
COPY --from=builder /usr/local/chat-app-api/.env ./

EXPOSE 4000

CMD [ "node", "./dist/app.js" ]