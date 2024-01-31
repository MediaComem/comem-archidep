# Solution: [Deploy a more complex web application with Docker Compose](./docker-compose-wopr.md)

Here's an example of what the Dockerfile in your WOPR repository could look
like:

```Dockerfile
# Frontend build stage
FROM node:20.11.0-alpine AS build

WORKDIR /usr/src/app

# Install frontend dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Build the frontend's static files
COPY ./ ./
RUN npm run build

# Application build stage
FROM ruby:3.2.3-alpine

WORKDIR /usr/src/app

# Install compilation tools and create a dedicated user & group
RUN apk add --no-cache build-base && \
    addgroup -S wopr && adduser -S wopr -G wopr && \
    chown -R wopr:wopr /usr/src/app

# Install application dependencies
COPY --chown=wopr:wopr Gemfile Gemfile.lock ./
RUN bundle install

# Copy the application's code and the frontend's static files
COPY --chown=wopr:wopr ./ ./
COPY --chown=wopr:wopr --from=build /usr/src/app/public/ ./public/

# Run the application
CMD ["bundle", "exec", "ruby", "app.rb"]
```

> :books: This Dockerfile example goes a little bit further than what is asked
> in the exercise: the `RUN` commands are split to take advantage of Compose's
> caching and [optimize the build][compose-build-optimization].
>
> In the first build stage, by copying only the `package.json` and
> `package-lock.json` files first, the long-running `npm ci` command will only
> be re-run when those 2 files change compared to the last build on a given
> machine. If none of these files have changed, the result is cached. This makes
> sense because the `package.json` and `package-lock.json` files are the
> description of the application's Node.js dependencies, and the `npm ci`
> command installs those dependencies. There is no need to re-run `npm ci` if
> those 2 files have not changed. The whole application is only copied after the
> dependencies have been installed (`COPY ./ ./`). The `npm run build` command
> will be re-run any time any application file changes.
>
> The same principle is applied to the final stage: the `Gemfile` and
> `Gemfile.lock` files are copied first since these are the files that determine
> the Ruby application's dependencies, and which are used by the `bundle
> install` command. The whole application is only copied after dependencies have
> been installed.

Here's a sample `.dockerignore` file to go with it:

```
# https://docs.docker.com/engine/reference/builder/#dockerignore-file
/.ackrc
/compose.yml
/.gitignore
/LICENSE.txt
/node_modules
/Procfile
/public
/README.md
/.screenrc
/spec
/.tool-versions
```

Here's an example of what the `compose.yml` file in your PHP todolist repository
can look like:

```conf
name: wopr

services:
  # Reverse proxy service
  rp:
    image: nginx:1.25.3-alpine
    depends_on:
      - app
    networks:
      - front-tier
    ports:
      - "${WOPR_PORT:-14000}:80"
    restart: always
    volumes:
      # Overwrite the default configuration in the container with the site
      # configuration in this directory.
      - ./site.conf:/etc/nginx/conf.d/default.conf

  # Application service
  app:
    # Build the image based on the Dockerfile in this directory.
    build: .
    image: wopr/app
    depends_on:
      - db
    environment:
      # Connect to the database service.
      WOPR_REDIS_URL: redis://db:6379/0
    networks:
      - front-tier
      - back-tier
    restart: always

  # Database service
  db:
    image: redis:7.2.4-alpine
    networks:
      - back-tier
    restart: always
    volumes:
      # Persist server data in a named Docker volume.
      - db_data:/data

# Separate backend and frontend networks for increased security.
networks:
  back-tier:
  front-tier:

volumes:
  db_data:
```

> :books: This Compose file example includes the configurability and network
> isolation improvements suggested in the [Make it more
> configurable](./docker-compose-todolist.md#books-make-it-more-configurable)
> and [Make it more
> secure](./docker-compose-todolist.md#books-make-it-more-secure) sections of
> the previous exercise.



[compose-build-optimization]: https://docs.docker.com/build/cache/
