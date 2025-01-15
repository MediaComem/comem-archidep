# Solution: [Containerize a static site using Docker](./docker-static.md)

<!-- START doctoc -->
<!-- END doctoc -->

1. Create a `.dockerignore` file at the root of the project directory. Add the
   following content to the file:

```bash
node_modules
dist
README.md
```

2. Create a `Dockerfile` at the root of the project directory with the following
   content:

```Dockerfile
FROM node:22-alpine
RUN addgroup --system lightness && adduser --system lightness --ingroup lightness
WORKDIR /lightness
COPY . .
RUN chown -R lightness:lightness .
USER lightness
RUN npm ci
CMD npm start
```

3. Build the image and run a container. The following commands assume you are at
   the root of the project directory.

```bash
$> docker build -t lightness .
$> docker run -p 8080:5173 lightness
```
