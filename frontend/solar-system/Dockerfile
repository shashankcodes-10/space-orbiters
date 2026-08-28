#Dockerfile for solar-system
FROM node:21

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 5174

CMD ["npm","run","dev"]