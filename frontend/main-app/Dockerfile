#Dockerfile for main-app
FROM node:21

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 5173

CMD ["npm","run","dev"]