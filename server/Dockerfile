FROM node:20-alpine

RUN apk add --no-cache python3 make g++

WORKDIR /usr/src/app

COPY package*.json ./

COPY . .

CMD ["sh", "-c", "npm install && npm run dev"]
