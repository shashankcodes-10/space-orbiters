#------------------------builder stage-----------------------------
FROM dhi.io/node:24-alpine3.23-dev AS builder

WORKDIR /app

COPY package.*json ./

RUN npm install --omit=dev

#-------------------------runner stage------------------------------
FROM  dhi.io/node:24-alpine3.23 

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src

EXPOSE 3000

CMD ["node", "src/server.js"]