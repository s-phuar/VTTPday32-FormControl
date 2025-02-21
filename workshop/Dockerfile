
FROM node:23 AS builder

WORKDIR /src

# install angular
RUN npm i -g @angular/cli

# copy srcs into container
COPY  angular.json .
COPY  package.json .
COPY  package-lock.json .
COPY  tsconfig.app.json .
COPY  tsconfig.spec.json .
COPY  tsconfig.json .
COPY  public public
COPY  src src

# install packages from package.json -> recreate node module
RUN npm ci
#build the application, need to grab dist/<appname>/browser
RUN ng build

#copy angular to caddy
FROM caddy:2-alpine
LABEL maintainers="samuel"

WORKDIR /www

# copy angular artifacts and caddyfile
COPY --from=builder /src/dist/workshop/browser html
COPY Caddyfile .

EXPOSE 8080

SHELL ["/bin/sh", "-c"]
ENTRYPOINT caddy run --config ./Caddyfile


