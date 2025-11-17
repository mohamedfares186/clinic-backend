FROM node:lts-alpine

WORKDIR /clinic

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 9000

CMD [ "node", "dist/server.js" ]