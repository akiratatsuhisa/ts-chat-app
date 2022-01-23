FROM node AS builder

WORKDIR /usr/local/chat-app-ui

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build 

RUN npm prune --production

FROM nginx

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=builder /usr/local/chat-app-ui/build .

EXPOSE 80

ENTRYPOINT [ "nginx","-g","daemon off;" ]



