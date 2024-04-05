FROM node:latest

RUN apt-get update && apt-get install -y ffmpeg

WORKDIR /backend

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 5000

CMD ["node", "index.js"]