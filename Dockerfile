FROM node:17-alpine AS dependencies
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install

FROM node:17-alpine AS build
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN yarn build

FROM node:17-alpine AS runner
WORKDIR /app
COPY entrypoint.sh .
COPY --from=build /app/build .
COPY --from=dependencies /app/node_modules ./node_modules
ENTRYPOINT [ "sh", "./entrypoint.sh" ]
CMD [ "node", "server.js" ]