<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Solution: Containerize a static site using Docker](#solution-containerize-a-static-site-using-docker)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Solution: [Containerize a static site using Docker](./docker-static.md)

1. Create a `.dockerignore` file at the root of the project directory. Add the following content to the file:

```bash
node_modules
dist
.parcel-cache
README.md
```

2. Create a `Dockerfile` at the root of the project directory with the following content:

```Dockerfile
FROM node:20-alpine
RUN addgroup -S lightness && adduser -S lightness -G lightness
WORKDIR /lightness
COPY . .
RUN chown -R lightness:lightness .
USER lightness
RUN npm ci
CMD npm start
```

3. Build the image and run a container. The following commands assume you are at the root of the project directory.

```bash
$> docker build -t lightness .
$> docker run -p 8080:1234 lightness
```
