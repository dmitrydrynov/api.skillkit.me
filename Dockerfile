FROM node:16-alpine AS dependencies
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY . .
COPY package.json yarn.lock ./
RUN yarn install

FROM node:16-alpine AS build
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN yarn build

FROM node:16-alpine AS runner
WORKDIR /app
COPY entrypoint.sh .
COPY storage ./storage
COPY --from=build /app/build .
COPY --from=dependencies /app/node_modules ./node_modules
ENTRYPOINT [ "sh", "./entrypoint.sh" ]
CMD [ "node", "server.js" ]