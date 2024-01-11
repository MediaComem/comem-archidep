<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Containerize an in-development static site using Docker](#containerize-an-in-development-static-site-using-docker)
  - [Legend](#legend)
  - [:gem: Requirements](#gem-requirements)
  - [:question: Run the app locally](#question-run-the-app-locally)
  - [:exclamation: Create a `.dockerignore` file](#exclamation-create-a-dockerignore-file)
  - [:exclamation: Create a Dockerfile and find a base image.](#exclamation-create-a-dockerfile-and-find-a-base-image)
  - [:exclamation: Create a group and user](#exclamation-create-a-group-and-user)
  - [:exclamation: Create a working directory](#exclamation-create-a-working-directory)
  - [:exclamation: Copy files to the working directory](#exclamation-copy-files-to-the-working-directory)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Containerize an in-development static site using Docker

In this exercise, you will apply your knowledge of Docker and Linux administration to containerize a static site built with the Parcel JavaScript bundler. The site you will be containerizing is a completed version of your final ProgWeb challenge.

You can complete this exercise directly on your local machine; there is **no** need to connect to your Azure VM.

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

## :gem: Requirements
* To follow this exercise, you will to have Docker installed on your machine. To do so, install [Docker Desktop][docker-desktop] and use the recommended settings.

* **Fork** and clone the [Lightness repository][lightness-repo]:

```bash
$> https://github.com/<your_username>/comem-progweb-lightness
```

* Open the project in your favorite text editor.

## :question: Run the app locally
You may want to see what it takes to run the app outside of a container. To do so, you can follow the instructions in the [Lightness repository's README][lightness-repo-installation].


## :exclamation: Create a `.dockerignore` file

> :books: The `.dockerignore` file is something we haven't seen in class, and plays a crucial role in optimizing the Docker build process. Similar to `.gitignore` in the  context of Git, the `.dockerignore` file specifies a pattern of files and directories to exclude from the context sent to the Docker daemon during the build process. When building an image, Docker sends the entire context (i.e., all files and directories located in the build's root directory) to the daemon. This can be inefficient and time-consuming, especially if the context includes large or unnecessary files. By defining what files or directories should be ignored, the .dockerignore file helps in reducing the build time, ensuring that only relevant files are sent to the daemon. This not only streamlines the build process but also results in smaller Docker images, as it avoids including unnecessary files that do not contribute to the functionality of the container. Additionally, excluding irrelevant files enhances security by preventing unwanted or sensitive files from being inadvertently included in the Docker image.

If you tested the Ligntness project in the previous step, you might have noticed that a bunch of folders were created when running `npm ci` and `npm run build`:

```bash
└── comem-progweb-lightness
    ├── package.json
    ├── package-lock.json
    ├── node_modules      <------ when running npm ci
    ├── dist              <------ when running npm run build
    └── src
        ├── app.js
        ├── index.html
        ├── modules
        │   ├── Color.js
        │   └── utils.js
        └── style.css
```

The `node_modules` folder in a Node.js project contains all the library dependencies that the project requires. These libraries are installed based on the definitions in the project's `package.json` file and can include a vast number of files and folders, specific to the environment in which they were installed. Including this folder in a Docker image is not recommended due to the potential for compatibility issues across different environments and the significant increase in the image size, which can lead to slower and less efficient deployments.


Excluding the `dist` folder, especially in projects built with Parcel, is recommended. The dist folder typically contains the output of the build process - bundled and optimized assets ready for deployment. When Dockerizing an application, the build process is usually performed within the Docker container itself, ensuring that the build environment matches the runtime environment. This guarantees that the application runs consistently across different environments.

**Given this information, create a `.dockerignore` file at the root of the project and exclude these irrelevant folders. The syntax is the same as `.gitignore` file.**

## :exclamation: Create a Dockerfile and find a base image.
To build a Docker image, you will need to create a `Dockerfile` at the root of the project, so go ahead and do that.

The first step when building an image is to choose a **base image**. A base image in a Dockerfile serves as the foundational layer upon which all other layers of a Docker container are built. It typically includes the operating system and essential system libraries, providing the basic environment and tools necessary for running applications and services within the container.

Given that our app's only requirement is **Node.js 20+**, explore [Docker Hub][docker-hub] to find a base image fulfilling this requirement. We recommend only using **Docker Official Images**.

> :space_invader: Using the Node base image in Docker without specifying a tag, like `node:latest`, can lead to unpredictable behaviors, as it always pulls the latest version, which may introduce breaking changes or incompatibilities. In contrast, specifying a tag like `node:20-alpine` ensures consistency and reliability; it uses a specific Node version (20 in this case) based on the lightweight and secure Alpine Linux distribution. This approach not only provides a stable and predictable environment but also results in a smaller and more efficient Docker image, benefiting from Alpine's minimalistic footprint.

**Given this information, insert the `FROM` instruction followed by the base image you chose at the top of your `Dockerfile`.**

## :exclamation: Create a group and user

**:warning: Friends don't let friends run containers as root**

By default, Docker containers run with the root privilege (uid 0), including the application that runs inside them. This is considered a significant security risk because it grants full administrative privileges inside the container. If an attacker gains access to the container, they could exploit these elevated privileges to perform malicious activities, such as accessing sensitive data, installing unauthorized software, or attacking other parts of the system. This is particularly dangerous because the effects can potentially extend beyond the container, especially if the container runtime is not properly isolated or if there are vulnerabilities in the host system. To mitigate this risk, it's best practice to run containers with a non-root user, thereby limiting the potential impact of a security breach.

The next step in your `Dockerfile` will be to create a new user and group that cannot access the rest of the system. In a traditional Linux environment, creating a group and user can be done using the following command:

```bash
$> addgroup -S lightness && adduser -S lightness -G lightness
```

This command does two things. First, it creates a new group named `lightness` with the `-S` flag indicating it's a system group, and then it creates a new user named `lightness`, adds them to the `lightness` group with `-G lightness`, and marks them as a system user with `-S`, reducing the privileges associated with this user and group.

**Given this information, insert the `RUN` instructions to your `Dockerfile`, followed by the command.**

## :exclamation: Create a working directory
Its a good idea to define dedicated workspace within the container for our app. It avoids the need for repetitive cd (change directory) commands and reduces the risk of file misplacement or path errors, ensuring that all operations are performed in the intended directory, thus making the Dockerfile more organized and error-resistant.

You can create this workspace by adding the following line to your `Dockerfile`:

```Dockerfile
WORKDIR /lightness
```

The `WORKDIR` instruction in a Dockerfile is used to set the working directory for any subsequent `RUN`, `CMD`, `ENTRYPOINT`, `COPY`, and `ADD` instructions in the Dockerfile.

## :exclamation: Copy files to the working directory
At this point, you have a base image, a new user and a working directory. However, none of your project files are actually anywhere in the image. Let's do that now by using the `COPY` instruction.

The `COPY` instruction follows the syntax `COPY <source> <destination>`. Here, `<source>` refers to the file(s) or directory(s) you want to copy from the Docker build context (the directory containing the Dockerfile and other resources), and `<destination>` is the path within the container where these files should be placed.

To copy everything in your project folder to the working directory, enter the following line in your `Dockerfile`:

```dockerfile
COPY . .
```

[docker]: https://www.docker.com/
[docker-desktop]: https://www.docker.com/products/docker-desktop/
[docker-hub]: https://hub.docker.com/search?q=&image_filter=official
[lightness-repo]: https://github.com/MediaComem/comem-progweb-lightness
[lightness-repo-installation]: https://github.com/MediaComem/comem-progweb-lightness?tab=readme-ov-file#-getting-started
