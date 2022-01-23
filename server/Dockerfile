FROM node

WORKDIR /usr/local/chat-app-api


COPY package.json ./

RUN npm install

COPY  . .

RUN npm run build

RUN npm prune --production

EXPOSE 4000

CMD [ "node", "./dist/app.js" ]