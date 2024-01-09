<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Docker](#docker)
  - ["It works on my machine."](#it-works-on-my-machine)
    - [Portability](#portability)
    - [Virtual Machines](#virtual-machines)
    - [Containers](#containers)
    - [What is Docker?](#what-is-docker)
    - [Who uses Docker?](#who-uses-docker)
    - [Why use Docker?](#why-use-docker)
    - [Wait, why not just use good old VMs?](#wait-why-not-just-use-good-old-vms)
  - [Docker concepts](#docker-concepts)
    - [Docker concepts - Images](#docker-concepts---images)
    - [Docker concepts - Containers](#docker-concepts---containers)
    - [Docker concepts - Volumes](#docker-concepts---volumes)
  - [Docker Workflow](#docker-workflow)
    - [Docker workflow - Client](#docker-workflow---client)
    - [Docker Workflow - Host (Daemon)](#docker-workflow---host-daemon)
    - [Docker workflow - Registry](#docker-workflow---registry)
  - [Installing and using Docker](#installing-and-using-docker)
    - [Create a Docker Image with Dockerfile](#create-a-docker-image-with-dockerfile)
    - [Dockerfile instructions](#dockerfile-instructions)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Docker


<!-- slide-column -->

Learn how to containerize your web applications with Docker and deploy them on cloud application platforms such as [Render][render].

**You will need**

* [Git][git]
* A [GitHub][github] account
* A [Render][render] account
* A [Docker][docker] account
* [Docker Desktop][docker-desktop] installed on your machine.

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



### What is Docker?

Docker is an open-source platform that automates the deployment, scaling, and management of applications inside lightweight, portable **containers**. It has revolutionized how developers build, ship, and run applications, making it simpler to create and manage consistent environments.

In essence, Docker streamlines the development lifecycle by allowing developers to work in standardized environments using local containers which provide your applications and services. Docker has become a key component of many toolchains, integrating smoothly with various tools and platforms.



### Who uses Docker?

<p class='center'><img src='images/stack-overflow-survey.png' /></p>

Almost everyone.

In the [2023 Stack Overflow Developer Survey][stack-overflow-survey],
56.61% of professional developers reported using Docker. In the fragmented
world of software development, this is a *significant* number, likely second only to [Git][git] in terms of adoption. This indicates that Docker is an essential tool to learn for aspiring developers seeking employment.



### Why use Docker?

* **Environment Consistency**: Apps run the same on your machine, your colleague's machine, and your boss's machine. No more "it works on my machine." It also means everyone executes the same commands to run the app, regardless of the computer. The operating system becomes irrelevant, which makes collaboration and deployment much easier.

* **Portability**: Docker containers can be moved across operating systems without needing to modify the codebase.

* **Isolation**: Docker maintains a clear boundary between your app and its dependencies. That means there are no more clashes between applications. This improves security and makes debugging simpler.

* **Scaling**: You can deploy as many instances of the container as needed.

* **DevOps**: Docker streamlines workflows between coding and deployment.



### Wait, why not just use good old VMs?

|                        | Virtual Machine  | Container                                     |
| :---                   | :---             | :---                                          |
| **Architecture**       | Full OS          | Application and dependencies                  |
| **Isolation**          | Complete isolation| Process-level isolation                       |
| **Performance**        | Slower, but full access to hardware resources | Faster, supports rapid scaling |

As usual, the choice depends on the use case. However, in the context of web development, containers make a lot of sense. They offer the speed and agility required in a dynamic web development environment, where rapid iteration and deployment are key. With their process-level isolation, they provide a balanced approach to security and resource efficiency. Their architecture, which includes only the application and its dependencies, simplifies deployment across different environments.



## Docker concepts
<!-- slide-column -->
<p class='center'><img src='images/docker-image.png' /></p>
<p class='center'>Images</p>

<!-- slide-column -->
<p class='center'><img src='images/docker-container.png' /></p>
<p class='center'>Containers</p>



### Docker concepts - Images
<!-- slide-column -->
<p class='center'><img src='images/docker-image.png' /></p>

<!-- slide-column -->
A Docker image is a **lightweight**, **standalone**, and **executable package** that includes everything needed to run a piece of software:

* Code
* Runtime
* Libraries
* System Tools
* Operating System

Think of a Docker image as a recipe containing both the ingredients and the instructions.



### Docker concepts - Containers
<!-- slide-column -->
<p class='center'><img class='w100' src='images/docker-container.png' /></p>

<!-- slide-column -->

A Docker Container is a **runnable instance** of a Docker Image. A Container takes everything specified in the Docker Image and follows its instructions by executing specified commands.

If the image is a recipe, then the container is the completed dish.

Multiple containers can be created from a single Docker Image.


### Docker concepts - Volumes
<!-- slide-column -->
<p class='center'><img class='w100' src='images/docker-volume.png' /></p>

<!-- slide-column -->
A Docker Volume is a **persistent data storage mechanism** that allows data to be shared between a container and a host machine, or among multiple containers.

It ensures data durability and persistence even if the container is stopped or removed.

Think of a Docker Volume as a shared folder that exists outside the container.



## Docker Workflow

<p class='center'><img class='w100' src='images/docker-architecture.webp' /></p>

The Docker workflow encompasses several key components that work together to manage the lifecycle of Docker containers: the **Client**, the **Daemon (Host)**, and the **Registry**.


### Docker workflow - Client
<p class='center'><img class='w70' src='images/docker-desktop.png' /></p>

The [Docker Client][docker-desktop] provides a **user interface** to issue commands to the **Docker Host**.

This interface can be used through the **command line** or with Docker Desktop (pictured above), a GUI implementation of the client.


### Docker Workflow - Daemon (Host)

The Docker daemon, or `dockerd`, is the **heart of the Docker platform**, running on the host machine where containers are deployed. It manages the entire lifecycle of Docker containers on the system.

`dockerd` listens for Docker API requests and **manages Docker objects such as images, containers, networks, and volumes**. It's the component that does the heavy lifting of building and running containers.

It is responsible for **pulling images from Docker registries and building new images**. It stores these images locally, providing a cache to speed up future container launches.

`dockerd` also handles **logging and monitoring** of container activity, providing insights into container performance and health.

`dockerd` and the Docker Client are often referred to together as the **Docker Engine**.


### Docker workflow - Registry
<!-- slide-column -->
<p class='center'><img src='images/docker-hub.png' /></p>

<!-- slide-column -->
A Docker Registry is a **storage and content delivery system** that holds named Docker images, available in different tagged versions.

The most well-known registry is **[Docker Hub][docker-hub]**, which is a public, cloud-based registry provided by Docker. Essentially, Docker Hub is to Docker what GitHub is to Git.

Besides Docker Hub, there are other registries like [Amazon ECR (Elastic Container Registry)][amazon-ecr], [Google Artifact Registry][google-artifact-registry], and private, self-hosted options.



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

[amazon-ecr]: https://aws.amazon.com/ecr/
[docker]: https://www.docker.com/
[docker-desktop]: https://www.docker.com/products/docker-desktop/
[docker-engine]: https://docs.docker.com/engine/
[docker-hub]: https://hub.docker.com/
[dockerfile-reference]: https://docs.docker.com/engine/reference/builder/
[git]: https://git-scm.com
[github]: https://github.com
[google-artifact-registry]: https://cloud.google.com/artifact-registry
[render]: https://render.com
[stack-overflow-survey]: https://survey.stackoverflow.co/2023/
