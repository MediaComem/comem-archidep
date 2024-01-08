<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Docker](#docker)
  - ["It works on my machine."](#it-works-on-my-machine)
    - [Who uses Docker?](#who-uses-docker)
    - [Portability is an old idea](#portability-is-an-old-idea)
    - [Virtual Machines vs. Containers](#virtual-machines-vs-containers)
    - [What is Docker?](#what-is-docker)
    - [Why use Docker?](#why-use-docker)
  - [Docker concepts](#docker-concepts)
    - [Docker concepts - Images](#docker-concepts---images)
    - [Docker concepts - Containers](#docker-concepts---containers)
    - [Docker concepts - Volumes](#docker-concepts---volumes)
    - [Docker concepts - Network](#docker-concepts---network)
  - [Docker Workflow](#docker-workflow)
    - [Docker workflow - Client](#docker-workflow---client)
    - [Docker workflow - Host (Daemon)](#docker-workflow---host-daemon)
    - [Docker workflow - Registry (Hub)](#docker-workflow---registry-hub)
  - [Installing and using Docker](#installing-and-using-docker)
    - [Create a Docker Image with Dockerfile](#create-a-docker-image-with-dockerfile)
    - [Dockerfile instructions](#dockerfile-instructions)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Docker


<!-- slide-column -->

Learn how to containerize your web applications with Docker and deploy them on cloud application platforms such as [Render][render].

**You will need**

* [Git][git]
* A free [GitHub][github] account
* A free [Render][render] account


<!-- slide-column -->
<p class='center'><img class='w100' src='images/docker-logo.svg' /></p>



## "It works on my machine."

<!-- slide-front-matter class: center, middle -->

> Have you ever had an application work on one operating system,
> such as MacOS, but not on another? Have you ever struggled to juggle
> different Node.js versions for various web applications? Odds are, you have.

> [Docker][docker] was launched in 2013 with the intent to address this critical
> issue in software development and deployment: **portability**.



### Portability

<!-- slide-column -->

Portability in computing refers to the ability of software to be run on various hardware or operating system environments with little or no modification. This concept has been pivotal in software development for decades, facilitating the adaptation of applications across diverse systems. Before containers and Docker, portability was often achieved through careful coding practices, the use of virtual machines, or cross-platform programming languages and libraries. Why is portability such a challenge?

<!-- slide-column -->
* **Hardware Dependencies**: Different hardware architectures can affect software performance and compatibility.
* **Operating System Variations**: Software that runs on one operating system might not run on another without significant changes.
* **Dependency Management**: Ensuring all the necessary libraries and tools are present and compatible across systems is a major challenge.



### Virtual Machines

<!-- slide-column -->
<p class='center'><img src='images/vms.png' /></p>

<!-- slide-column -->

Virtual machine solve the portability problem by providing isolation and environment consistency. At its core, virtualization involves creating virtual versions of physical resources, such as servers, storage devices, and networks using a hypervisor.

**Hypervisor**: The central component of hardware virtualization is the hypervisor, a software layer that enables multiple operating systems to share a single hardware host.

Virtualization forms the foundation of cloud computing and is pivotal in data center management.



### Containers

<!-- slide-column -->
<p class='center'><img src='images/containers.png' /></p>

<!-- slide-column -->
While VMs are fantastic technology and incredibly useful in numerous scenarios, it doesn't necessarily make sense to package an entire operating system just to get a web application to work.

Containers are an alternative that address this drawback of virtual machines. They tackle the challenges of portability by providing isolation and environment consistency, all while sharing a host system's kernel and without requiring a full operating system for each instance.



### Which is better?

|                        | Virtual Machine  | Container                                     |
| :---                   | :---                                                             |
| **Architecture**       | Full OS          | Application and dependencies                  |
| **Isolation**          | Complete isolation     | Process-level                           |
| **Performance**        | Slower, but full access to hardware ressources | Faster, rapid scaling    |

As usual, it depends. However, in the case of web development, containers make a lot of sense. They offer the speed and agility required in a dynamic web development environment, where rapid iteration and deployment are key. With their process-level isolation, they provide a balanced approach to security and resource efficiency. Their architecture, which includes only the application and its dependencies, simplifies deployment across different environments.

### What is Docker?



### Who uses Docker?

<p class='center'><img src='images/stack-overflow-survey.png' /></p>

Almost everyone.

In the [2023 Stack Overflow Developer Survey][stack-overflow-survey],
56.61% of professional developers reported using Docker. In the fragmented
world of software development, this is a *significant* number, likely second only to [Git][git] in terms of adoption. This indicates that Docker is an essential tool to learn for aspiring developers seeking employment.



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

Docker can build images automatically by reading the instructions from a Dockerfile. A Dockerfile is a text document that contains all the commands a user could call on the command line to assemble an image.

<!-- slide-column -->
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
```



### Dockerfile instructions

| Command                | Purpose                                                          |
| :---                   | :---                                                             |
| `FROM image_name`           | Specifies the base image to use for the new image.          |
| `WORKDIR /some/path`   | Sets the working directory for the instructions that follow.     |
| `COPY <src> <dest>`    | Copies files or directories from the build context to the image. |
| `RUN <command>`        | Executes commands in the shell during image builds.              |
| `EXPOSE <port>`        | Port(s) Docker will be listening on at runtime.                  |
| `ENV KEY=VALUE`        | Sets environment variables.                                      |
| `ARG KEY=VALUE`        | Defines build time variables.                                    |
| `VOLUME /volume`       | Creates a mount point for externally mounted volumes.            |
| `CMD <command>`        | The default command to execute when the container starts.        |
| `ENTRYPOINT <command>` | Similar as `CMD`, but cannot be overriden.                       |

To see a full list of Dockerfile instructions, see the [Dockerfile reference][dockerfile-reference].

[docker]: https://www.docker.com/
[dockerfile-reference]: https://docs.docker.com/engine/reference/builder/
[git]: https://git-scm.com
[github]: https://github.com
[render]: https://render.com
[stack-overflow-survey]: https://survey.stackoverflow.co/2023/
