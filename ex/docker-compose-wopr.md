# Deploy a more complex web application with Docker Compose

The goal of this exercise is to learn to deploy a multi-container web
application with Docker Compose. You will create a portable Compose file that
can be used to deploy the same containers on both your local machine and your
cloud server.

<!-- START doctoc -->
<!-- END doctoc -->



## Legend

Parts of this guide are annotated with the following icons:

- :exclamation: A task you **MUST** perform to complete the exercise.
- :question: An optional step that you _may_ perform to make sure that
  everything is working correctly.
- :warning: **Critically important information about the exercise.**
- :gem: Tips on the exercise, reminders about previous exercises, or
  explanations about how this exercise differs from the previous one.
- :space_invader: More advanced tips on how to save some time.
- :books: Additional information about the exercise or the commands and tools
  used.
- :checkered_flag: The end of the exercise.
  - :classical_building: The architecture of what you deployed during the
    exercise.
- :boom: Troubleshooting tips: how to fix common problems you might encounter.



## :gem: Meet the new boss, same as the old boss

This exercise is basically the same as the [previous Docker Compose
exercise](./docker-compose-todolist.md), but it illustrates how to deploy a
slightly more complex application than the PHP todolist with Docker Compose,
namely the [WOPR application you deployed during another
exercise](./wopr-deployment.md).

Since the basic structure of the exercise is the same, this exercise will only
list what is different.



## :gem: Spot the differences

The architecture of the WOPR application is basically the same as the PHP
todolist's. There are basically 3 components:

* The reverse proxy.
* The WOPR application.
* The database.

The main differences are:

* Where the PHP todolist only used PHP, WOPR is an application using two
  technology stacks:
  * [Ruby][ruby] for the backend.
  * [Node.js][node] to compile the JavaScript frontend.
* The database is [Redis][redis] instead of MySQL.

You could think that since there are 2 parts to the application, a Ruby backend
and a JavaScript frontend, you would run 2 containers for them. However, the
JavaScript frontend, once compiled, is composed of purely static files. The Ruby
backend knows how to serve these static files to the client's browser, where the
JavaScript is executed. There is no need for an extra container for the
frontend's static files.

So, our Compose file for the WOPR application will look something like this:

```yml
services:
  rp:
    image: # ...
    depends_on: # ...
    ports: # ...
    restart: # ...
    volumes: # ...
  app:
    image: # ...
    build: # ...
    depends_on: # ...
    environment: # ...
    restart: # ...
  db:
    image: # ...
    restart: # ...
```



## :exclamation: Define the database service

...



## :exclamation: Define the application service

...



## :exclamation: Define the reverse proxy service

...



## :exclamation: Run the Compose project

...



## TMP: final result

```yml
services:
  # Reverse proxy service
  rp:
    image: nginx:1.25.3-alpine
    depends_on:
      - app
    ports:
      - "8080:80"
    restart: always
    volumes:
      - ./site.conf:/etc/nginx/conf.d/default.conf

  # Application service
  app:
    image: wopr/app
    build: .
    depends_on:
      - db
    environment:
      WOPR_REDIS_URL: redis://db:6379/0
    restart: always

  # Database service
  db:
    image: redis:7.2.4-alpine
    restart: always
    volumes:
      - db_data:/data

volumes:
  db_data:
```



[node]: https://nodejs.org
[redis]: https://redis.io
[ruby]: https://www.ruby-lang.org
