# Docker Compose

<!-- slide-column -->

Learn the basics of [Docker Compose][docker-compose], a tool for defining and
running **multi-container applications**.

<!-- slide-include ../../BANNER.md -->

<!-- slide-column 60 -->

<img class="w100" src="./images/docker-compose.jpg" />

<!-- slide-container -->

**You will need**

* A [Docker][docker] account
* [Docker Desktop][docker-desktop] installed on your machine
  * *[Docker Compose][docker-compose] is included with Docker Desktop*

**Recommended reading**

* [Docker](../docker/)

<!-- START doctoc -->
<!-- END doctoc -->



## The Docker philosophy

<!-- slide-column -->

A container is **ephemeral**: The same container may not run in perpetuity. Many
replicas may be launched. New containers will replace crashed ones.

<!-- slide-column 65 -->

<img class="w100" src="./images/ephemeral-resource.jpg" />

<!-- slide-container -->

* Any code running in your container should be included in the image. **If the
  code needs revision, update the image** and run a new container.
* Pass **configuration** via environment variables.
* Do not manage **persistent storage** within containers. Delegate storage to
  another container (e.g. running a database), or mount a volume to keep data
  when a container is created again.

### The Docker philosophy: isolation

> Docker containers are **isolated services**, not VM replacements.

<p class="center">
  <img class="w85" src="./images/docker-isolation.png" />
</p>

### Single responsibility principle

A container should have **only one mission**: Containers allow subdividing the
functions of a system into smaller collaborating pieces.

* A Docker image should **contain what it needs** to provide its service and run
  as quickly as possible, and nothing else! Minimize your dependencies.
* For maximum efficiency and isolation, each container should address one
specific area of concern and **delegate other functions to other containers**,
  e.g. a web application container will delegate storage to a separate database
  container.



## What is Docker Compose?

Docker Compose is a tool for defining and running multi-container applications,
making it easy to manage services, networks, and volumes in a single,
comprehensible YAML configuration file. Then, using the command line, you can:

* Start, stop, and rebuild services
  * `docker compose up [service]`
  * `docker compose stop [service]`
  * `docker compose build [service]`
* View the status of running services
  * `docker compose ps [service]`
* Stream the log output of running services
  * `docker compose logs [--follow] [service]`
* Run a one-off command on a service
  * `docker-compose run <service> <command> [args...]`

## Why use Docker Compose?

* **Simplified control**: Orchestrate multi-container applications in a single
  file, making your application environment easy to replicate.
* **Efficient collaboration**: Compose files are easy to share, facilitating
  collaboration among developers, operations teams, and other stakeholders.
* **Rapid application development**: Compose caches its configuration. When you
  restart a service that has not changed, Compose re-uses the existing
  containers. Re-using containers means that you can make changes to your
  environment very quickly.
* **Portability across environments**: Compose supports variables to customize
  your containers for different environments or users.

## Common use cases of Docker Compose

Compose can be used in many different ways. Some common use cases are outlined below.
Development environments

When you're developing software, the ability to run an application in an isolated environment and interact with it is crucial. The Compose command line tool can be used to create the environment and interact with it.

The Compose file provides a way to document and configure all of the application's service dependencies (databases, queues, caches, web service APIs, etc). Using the Compose command line tool you can create and start one or more containers for each dependency with a single command (docker compose up).

Together, these features provide a convenient way for you to get started on a project. Compose can reduce a multi-page "developer getting started guide" to a single machine-readable Compose file and a few commands.
Automated testing environments

An important part of any Continuous Deployment or Continuous Integration process is the automated test suite. Automated end-to-end testing requires an environment in which to run tests. Compose provides a convenient way to create and destroy isolated testing environments for your test suite. By defining the full environment in a Compose file, you can create and destroy these environments in just a few commands:

 docker compose up -d

 ./run_tests

 docker compose down

Single host deployments

Compose has traditionally been focused on development and testing workflows, but with each release we're making progress on more production-oriented features.

For details on using production-oriented features, see Compose in production.



## References

* [Docker Compose][docker-compose]
* [Containers philosophy](https://dev.to/iblancasa/containers-philosophy-2714)
* [The First Thing You Should Know When Learning About Docker Containers](https://medium.com/factualopinions/the-first-thing-you-should-know-when-learning-about-docker-containers-e0de29ddb6c3)



[docker]: https://www.docker.com
[docker-compose]: https://docs.docker.com/compose/
[docker-desktop]: https://www.docker.com/products/docker-desktop/
