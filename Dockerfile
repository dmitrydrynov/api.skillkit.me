FROM node:16-alpine AS dependencies
RUN apk update && apk add bash
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install

FROM node:16-alpine AS dev
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . ./
COPY entrypoint.sh .
EXPOSE ${PORT:-8000}
ENV PORT ${PORT:-3000}
CMD yarn dev

FROM node:16-alpine AS prod
WORKDIR /app
COPY package.json package.json
COPY --from=dependencies /app/node_modules node_modules
COPY entrypoint.sh .
COPY ./storage/ ./storage/
EXPOSE ${PORT:-8000}
ENV PORT ${PORT:-3000}
ENTRYPOINT ["sh", "/entrypoint.sh"]
CMD yarn build && yarn start