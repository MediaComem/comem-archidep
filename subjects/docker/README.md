# Docker

Learn how to containerize your web applications with Docker and deploy them on cloud application platforms such as [Render][render].

**You will need**

* [Git][git]
* A free [GitHub][github] account
* A free [Render][render] account



## "It works on my machine."

<!-- slide-front-matter class: center, middle -->

> Have you ever had an application work on one operating system,
> such as MacOS, but not on another? Have you ever struggled to juggle
> different Node.js versions for various web applications? Odds are, you have.

> Docker was launched in 2013 with the intent to address this critical
> issue in software development and deployment: **portability**.



### Who uses Docker?

<!-- slide-column -->

<p class='center'><img class='w100' src='images/stack-overflow-survey.png' /></p>

<!-- slide-column -->
Almost everyone.

In the [2023 Stack Overflow Developer Survey][stack-overflow-survey],
56.61% of professional developers reported using Docker. In the fragmented
world of software development, this is a *significant* number, likely second only to [Git][git] in terms of adoption. This indicates that Docker is an essential tool to learn for aspiring developers seeking employment.



### Portability is an old idea



### Virtual Machines vs. Containers



### What is Docker?



### Why use Docker?



## Docker concepts



### Docker concepts - Images



### Docker concepts - Containers



### Docker concepts - Volumes



### Docker concepts - Network



## Docker Workflow



### Docker workflow - Client



### Docker workflow - Host (Daemon)



### Docker workflow - Registry (Hub)



## Installing and using Docker



### Create a Docker Image with Dockerfile

<!-- slide-column -->

Docker can build images automatically by reading the instructions from a Dockerfile. A Dockerfile is a text document that contains all the commands a user could call on the command line to assemble an image. This page describes the commands you can use in a Dockerfile.

<!-- slide-column -->
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
```



### Dockerfile instructions

The following instructions – among others – can be used within a Dockerfile:

| Command                | Purpose                                                          |
| :---                   | :---                                                             |
| `FROM image_name`           | Specifies the base image to use for the new image.               |
| `WORKDIR /some/path`   | Sets the working directory for the instructions that follow.     |
| `COPY <src> <dest>`    | Copies files or directories from the build context to the image. |
| `RUN <command>`        | Executes commands in the shell during image builds.              |
| `EXPOSE <port>`        | Port(s) Docker will be listening on at runtime.                  |
| `ENV KEY=VALUE`        | Sets environment variables.                                      |
| `ARG KEY=VALUE`        | Defines build time variables.                                    |
| `VOLUME /volume`       | Creates a mount point for externally mounted volumes. It is the location in your container to which you can attach external storage.                                                                    |
| `ARG KEY=VALUE`        | Defines build time variables.                                    |
| `CMD <command>`        | The default command to execute when the container starts.        |
| `ENTRYPOINT <command>` | Similar as `CMD`, but cannot be overriden.                       |

To see a full list of Dockerfile instructions, see the [Dockerfile reference][dockerfile-reference].


[dockerfile-reference]: https://docs.docker.com/engine/reference/builder/
[git]: https://git-scm.com
[github]: https://github.com
[render]: https://render.com
[stack-overflow-survey]: https://survey.stackoverflow.co/2023/
