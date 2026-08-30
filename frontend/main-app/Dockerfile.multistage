#-------------------------builder stage-----------------------------
FROM dhi.io/node:24-alpine3.23-dev AS builder

WORKDIR /app

COPY package.*json ./

RUN npm install

COPY . .

RUN npm run build
#---------------------------runner stage----------------------------
FROM dhi.io/nginx:1-alpine3.23

COPY --from=builder /app/dist /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80