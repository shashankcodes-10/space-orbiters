#Dockerfile for chatroom
FROM nginx:latest

WORKDIR /app

COPY . /usr/share/nginx/html

COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx","-g","daemon off;"]