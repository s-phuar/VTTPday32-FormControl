
FROM node:23 AS builder

#sets working directory to src
WORKDIR /src

# install angular, allows ng commands in building the docker image
RUN npm i -g @angular/cli

# copy into container
COPY  angular.json .
COPY  package.json .
COPY  package-lock.json .
COPY  tsconfig.app.json .
COPY  tsconfig.spec.json .
COPY  tsconfig.json .
COPY  public public
COPY  src src

# install dependencies from package.json -> recreate node module
RUN npm ci
#build the application, docker needs to grab dist/<appname>/browser
RUN ng build

#stage 2, using caddy as webserver
FROM caddy:2-alpine
LABEL maintainers="samuel"

WORKDIR /www

#pulls the built application from browser and places it in html directory
# copy angular artifacts and caddyfile
COPY --from=builder /src/dist/takehome/browser html
COPY Caddyfile .

EXPOSE 8080

SHELL ["/bin/sh", "-c"]
ENTRYPOINT caddy run --config ./Caddyfile


