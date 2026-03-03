FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

COPY . .

EXPOSE 5173

CMD ["sh", "-c", "npm install && npm run dev"]
