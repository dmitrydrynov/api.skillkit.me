FROM node:16-alpine AS dependencies
WORKDIR /app
COPY package.json package.json
COPY package-lock.json package-lock.json
COPY yarn.lock yarn.lock
RUN yarn install

FROM node:16-alpine AS dev
WORKDIR /app
COPY package.json package.json
COPY --from=dependencies /app/node_modules node_modules
CMD yarn dev

FROM node:16-alpine AS prod
WORKDIR /app
COPY package.json package.json
COPY tsconfig.json tsconfig.json
COPY --from=dependencies /app/node_modules node_modules
CMD yarn build && yarn start