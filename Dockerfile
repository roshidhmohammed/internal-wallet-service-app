FROM node:22-alpine

WORKDIR /app

# Install bash & netcat for DB wait
RUN apk add --no-cache bash netcat-openbsd

COPY package*.json ./
RUN npm install

COPY . .
RUN npx prisma generate

EXPOSE 10000

ENTRYPOINT ["sh", "./docker-entrypoint.sh"]
# CMD ["npm", "run", "dev"]
