FROM node:16
RUN apt-get update 
RUN apt-get install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev 

WORKDIR /server
COPY . .

RUN npm install
RUN npm rebuild @tensorflow/tfjs-node --build-from-source

EXPOSE 5001

CMD [ "npm", "start" ]