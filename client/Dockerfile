FROM node:16

workdir /client
COPY . .

RUN npm install

EXPOSE 3001

CMD [ "npm", "start" ]