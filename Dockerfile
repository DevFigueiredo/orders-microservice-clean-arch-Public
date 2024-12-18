FROM node:lts-alpine3.18 AS builder

RUN mkdir -p /home/node/api/node_modules && chown -R node:node /home/node/api

RUN echo 'node ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

WORKDIR /home/node/api

COPY --chown=node:node package.json ./

USER root

COPY --chown=node:node . .
RUN rm -rf tsconfig.build.tsbuildinfo
RUN npm install 
RUN npm run build
RUN  yarn global add prisma @prisma/client
RUN npm run db:generate
RUN npm run db:migrate
RUN npm run db:seed
RUN  yarn global remove prisma
RUN rm -rf node_modules
RUN npm install --omit=dev


FROM node:lts-alpine3.18

WORKDIR /usr/src/app

COPY package.json .
COPY .env* .

COPY --from=builder --chown=node:node  /home/node/api/dist ./dist
COPY --from=builder --chown=node:node  /home/node/api/node_modules  ./node_modules
COPY --from=builder --chown=node:node  /home/node/api/prisma/  ./prisma

USER root



EXPOSE 3003

CMD ["node", "dist/main/server.js"]