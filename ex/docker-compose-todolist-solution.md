<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Solution: Deploy a PHP application with Docker Compose](#solution-deploy-a-php-application-with-docker-compose)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Solution: [Deploy a PHP application with Docker Compose](./docker-compose-todolist.md)

The Dockerfile in your PHP todolist repository should look something like
this:

```Dockerfile
FROM bitnami/php-fpm:8.3.2

ENV PHP_CONF_DIR=/opt/bitnami/php/etc

COPY index.php /app/

RUN echo >> "/opt/bitnami/php/etc/php-fpm.d/www.conf" && \
    echo 'env["TODOLIST_DB_USER"] = $TODOLIST_DB_USER' >> "/opt/bitnami/php/etc/php-fpm.d/www.conf" && \
    echo 'env["TODOLIST_DB_PASS"] = $TODOLIST_DB_PASS' >> "/opt/bitnami/php/etc/php-fpm.d/www.conf" && \
    echo 'env["TODOLIST_DB_NAME"] = $TODOLIST_DB_NAME' >> "/opt/bitnami/php/etc/php-fpm.d/www.conf" && \
    echo 'env["TODOLIST_DB_HOST"] = $TODOLIST_DB_HOST' >> "/opt/bitnami/php/etc/php-fpm.d/www.conf" && \
    echo 'env["TODOLIST_DB_PORT"] = $TODOLIST_DB_PORT' >> "/opt/bitnami/php/etc/php-fpm.d/www.conf"
```

Here's a sample `.dockerignore` file to go with it:

```
# https://docs.docker.com/engine/reference/builder/#dockerignore-file
/compose.yml
/.gitignore
/images
/LICENSE.txt
/README.md
/update.sh
```

Here's an example of what the `compose.yml` file in your PHP todolist repository
can look like:

```yml
name: todolist

services:
  # Reverse proxy
  rp:
    image: nginx:1.25.3-alpine
    depends_on:
      - app
    networks:
      - front-tier
    ports:
      - "${TODOLIST_PORT:-12000}:80"
    restart: always
    volumes:
      # Overwrite the default configuration in the container with the site
      # configuration in this directory.
      - ./site.conf:/etc/nginx/conf.d/default.conf:ro

  # PHP todolist application
  app:
    # Build the image based on the Dockerfile in this directory.
    build: .
    image: todolist/app
    depends_on:
      - db
    environment:
      # Connect to the database service
      TODOLIST_DB_HOST: db
      # Read the password from the .env file or the environment.
      TODOLIST_DB_PASS:
    networks:
      - front-tier
      - back-tier
    restart: always

  # Database
  db:
    image: mysql:8.3.0
    environment:
      MYSQL_DATABASE: todolist
      MYSQL_USER: todolist
      # Read the passwords from the .env file or the environment.
      MYSQL_PASSWORD:
      MYSQL_ROOT_PASSWORD:
    networks:
      - back-tier
    restart: always
    volumes:
      # Persist server data in a named Docker volume.
      - "db_data:/var/lib/mysql"
      # Run the todolist database setup script on server initialization.
      - ./todolist.sql:/docker-entrypoint-initdb.d/todolist.sql:ro

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
> secure](./docker-compose-todolist.md#books-make-it-more-secure) sections.

Here's a sample `.env` file you could use with this `compose.yml` file:

```
MYSQL_PASSWORD=spoiled-barrel-enlighten-stoke
MYSQL_ROOT_PASSWORD=deniable-earthlike-boil-say-avoid
TODOLIST_DB_PASS=spoiled-barrel-enlighten-stoke
```
