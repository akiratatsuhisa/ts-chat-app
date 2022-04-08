FROM node AS builder

WORKDIR /usr/local/chat-app-ui

COPY package.json ./

RUN npm install

COPY . .

ARG REACT_APP_SERVER_API_URL
ENV REACT_APP_SERVER_API_URL=$REACT_APP_SERVER_API_URL

RUN npm run build 

RUN npm prune --production

FROM nginx:alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=builder /usr/local/chat-app-ui/build .

EXPOSE 80

ENTRYPOINT [ "nginx","-g","daemon off;" ]



