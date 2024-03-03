FROM node:alpine

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

ENV REACT_APP_TESTNAME=testName

EXPOSE 3000

CMD ["npm", "start"]