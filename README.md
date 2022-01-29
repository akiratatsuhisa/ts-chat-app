# Chat App

![License](http://img.shields.io/badge/License-MIT-green.svg?style=flat)
![version](https://img.shields.io/badge/version-1.0.0-brightgreen.svg)
![state](https://img.shields.io/badge/state-ongoing-blue.svg)
![test](https://img.shields.io/badge/bug-crit-red.svg)

#### Table of Contents
* [About](#about)
* [Development](#development)
  * [Local installation](#local-installation)
  * [Docker](#docker)
* [License](#license)
## About 
This repository made for the purpose of learning, and practicing coding.

This applications may have many potential bugs, and I advise you not to use it for commercial or personal purposes, as it hasn't been secured and tested.

## Development

For installation instructions, please use the following ways.
* [Local installation](#local-installation)
* [Docker](#docker)

## Local installation

### Prerequisites

**Node.js (16.x.x+)**

See the [official Node.js installation documentation](https://nodejs.org/).

**Mongodb (5.x.x+)**

See the [official Mongodb installation documentation](https://www.mongodb.com/try/download/community).

### Installation

Clone the repository, and install dependencies.
```
git clone https://github.com/akiratatsuhisa/ts-chat-app.git
```
Install Dependencies for server, open new terminal.
```
cd server
npm install 
```

Create an `.env` file in `server` folder and add all below values.
* `PORT` - The port number for runned the server
* `CLIENT_UI_URL` - The root URL used for the client 
* `DATABASE_HOST` - The database hostname used for storage the data
* `DATABASE_NAME` - Database name 
* `DATABASE_PORT` - Database hostname's port number
* `PRIVATE_KEY` - Used for hash jwt token
* `AUDIENCE`  - The server URL
* `ISSUER` - The client URL
* `JWT_TOKEN_EXPIRES` - Expiration time for jwt token, the unit used is `seconds`

Install Dependencies for client, open new terminal.
```
cd client
npm install 
```

Create an `.env` file in `client` folder and add below value.
* `REACT_APP_SERVER_API_URL` - The server URL

### Running

Running the backend api.
```
cd server
npm start
```


Running the frontend ui.
```
cd client
npm start
```

## Docker

### Prerequisites

**Docker (20.x.x+)**

**Docker Compose (3.9.x+)**

See the [official Docker installation documentation](https://docs.docker.com/get-docker/).

### Installation

Clone the repository, and create `.env` files same as [above](local-installation).

Create an `.env` file in root repository folder and add all below values.
* `MONGODB_DATABASE_NAME` - Database name storage at docker volume
* `MONGODB_LOCAL_PORT` - Mongo port number running at local
* `MONGODB_DOCKER_PORT` - Mongo port number running at docker
* `NODE_LOCAL_PORT` - The server port running at local
* `NODE_DOCKER_PORT`- The server port running at docker
* `REACT_LOCAL_PORT` - The client port running at local
* `REACT_DOCKER_PORT` -  The client port running at docker
* `REACT_DOCKER_PORT` - The client URL running at local
* `CLIENT_UI_URL` - The client URL running at local

### Running

To run the containers, open terminal at root repository folder and run this **command**: `docker-compose up`.

To stop the containers: `docker-compose down`.

To remove images and volumes: `docker-compose rm -f -s -v`.

## License
Released under the [Released under the MIT license.](https://github.com/akiratatsuhisa/ts-chat-app/blob/master/LICENSE)
