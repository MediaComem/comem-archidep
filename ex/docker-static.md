# Containerize a static site using Docker

In this exercise, you will apply your knowledge of Docker and Linux administration to containerize a static site built with the Vite JavaScript bundler. The site you will be containerizing is a completed version of your final ProgWeb challenge.

You can complete this exercise directly on your local machine; there is **no** need to connect to your Azure VM.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Legend](#legend)
- [:gem: Requirements](#gem-requirements)
- [:question: Run the app locally](#question-run-the-app-locally)
- [:exclamation: Create a `.dockerignore` file](#exclamation-create-a-dockerignore-file)
- [:exclamation: Create a Dockerfile and find a base image.](#exclamation-create-a-dockerfile-and-find-a-base-image)
- [:exclamation: Create a group and user](#exclamation-create-a-group-and-user)
- [:exclamation: Create a working directory](#exclamation-create-a-working-directory)
- [:exclamation: Copy files to the working directory and change permissions](#exclamation-copy-files-to-the-working-directory-and-change-permissions)
- [:exclamation: Switch user and install dependencies](#exclamation-switch-user-and-install-dependencies)
- [:exclamation: Launch the Vite development server](#exclamation-launch-the-vite-development-server)
- [:exclamation: Building and running the image](#exclamation-building-and-running-the-image)
- [:exclamation: Mapping Your Container's Ports](#exclamation-mapping-your-containers-ports)
- [:checkered_flag: What have I done?](#checkered_flag-what-have-i-done)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Legend

Parts of this guide are annotated with the following icons:

- :exclamation: A task you **MUST** perform to complete the exercise.
- :question: An optional step that you _may_ perform to make sure that
  everything is working correctly.
- :warning: **Critically important information about the exercise.**
- :gem: Tips on the exercise, reminders about previous exercises, or
  explanations about how this exercise differs from the previous one.
- :space_invader: More advanced tips on how to save some time. Challenges.
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


Excluding the `dist` folder, especially in projects built with Vite, is recommended. The dist folder typically contains the output of the build process - bundled and optimized assets ready for deployment. When Dockerizing an application, the build process is usually performed within the Docker container itself, ensuring that the build environment matches the runtime environment. This guarantees that the application runs consistently across different environments.

**Given this information, create a `.dockerignore` file at the root of the project and exclude these irrelevant folders. The syntax is the same as `.gitignore` file.**

## :exclamation: Create a Dockerfile and find a base image.
To build a Docker image, you will need to create a Dockerfile at the root of the project, so go ahead and do that.

The first step when building an image is to choose a **base image**. A base image in a Dockerfile serves as the foundational layer upon which all other layers of a Docker container are built. It typically includes the operating system and essential system libraries, providing the basic environment and tools necessary for running applications and services within the container.

Given that our app's only requirement is **Node.js 20+**, explore [Docker Hub][docker-hub] to find a base image fulfilling this requirement. We recommend only using **Docker Official Images**.

> :space_invader: Using the Node base image in Docker without specifying a tag, like `node:latest`, can lead to unpredictable behaviors, as it always pulls the latest version, which may introduce breaking changes or incompatibilities. In contrast, specifying a tag like `node:20-alpine` ensures consistency and reliability; it uses a specific Node version (20 in this case) based on the lightweight and secure Alpine Linux distribution. This approach not only provides a stable and predictable environment but also results in a smaller and more efficient Docker image, benefiting from Alpine's minimalistic footprint.

**Given this information, insert the `FROM` instruction followed by the base image you chose at the top of your Dockerfile.**

## :exclamation: Create a group and user

**:warning: Friends don't let friends run containers as root**

By default, Docker containers run with the root privilege (uid 0), including the application that runs inside them. This is considered a significant security risk because it grants full administrative privileges inside the container. If an attacker gains access to the container, they could exploit these elevated privileges to perform malicious activities, such as accessing sensitive data, installing unauthorized software, or attacking other parts of the system. This is particularly dangerous because the effects can potentially extend beyond the container, especially if the container runtime is not properly isolated or if there are vulnerabilities in the host system. To mitigate this risk, it's best practice to run containers with a non-root user, thereby limiting the potential impact of a security breach.

The next step in your Dockerfile will be to create a new user and group that cannot access the rest of the system. In a traditional Linux environment, creating a group and user can be done using the following command:

```bash
$> addgroup -S lightness && adduser -S lightness -G lightness
```

This command does two things. First, it creates a new group named `lightness` with the `-S` flag indicating it's a system group, and then it creates a new user named `lightness`, adds them to the `lightness` group with `-G lightness`, and marks them as a system user with `-S`, reducing the privileges associated with this user and group.

**Given this information, insert the `RUN` instructions to your Dockerfile, followed by the command.**

## :exclamation: Create a working directory
Its a good idea to define dedicated workspace within the container for our app. It avoids the need for repetitive cd (change directory) commands and reduces the risk of file misplacement or path errors, ensuring that all operations are performed in the intended directory, thus making the Dockerfile more organized and error-resistant.

You can create this workspace by adding the following line to your Dockerfile:

```Dockerfile
WORKDIR /lightness
```

The `WORKDIR` instruction in a Dockerfile is used to set the working directory for any subsequent `RUN`, `CMD`, `ENTRYPOINT`, `COPY`, and `ADD` instructions in the Dockerfile.

## :exclamation: Copy files to the working directory and change permissions
At this point, you have a base image, a new user and a working directory. However, none of your project files are actually anywhere in the image. Let's do that now by using the `COPY` instruction.

The `COPY` instruction follows the syntax `COPY <source> <destination>`. Here, `<source>` refers to the file(s) or directory(s) you want to copy from the Docker build context (the directory containing the Dockerfile and other resources), and `<destination>` is the path within the container where these files should be placed.

To copy everything in your project folder to the working directory, enter the following line in your Dockerfile:

```dockerfile
COPY . .
```

To ensure that our application runs under the `lightness` user with the necessary permissions, we need to adjust the permissions of the working directory. This involves setting the directory's permissions to allow the `lightness` user to read, write, and execute files within it. By doing this, we ensure that the `lightness` user can fully interact with the application files in the specified directory.

In a standard Linux environment, we would do this by running the following command, assuming we were in the correct directory:

```bash
$> chown -R lightness:lightness .
```
**:warning: Do not, I repeat, DO NOT run this in your terminal!!! :warning:**


**Execute the same command when building your Docker image by using the `RUN` instruction in your Dockerfile.**

## :exclamation: Switch user and install dependencies
Up to this point in our Docker environment, we have created a user named `lightness`, yet all operations have been executed with root privileges. While using the root user is fine for initial configuration tasks, it's essential to shift to the `lightness` user when we start working with our application files, in order to enhance security.

**To make this transition, employ the `USER` instruction in your Dockerfile.** This instruction changes the user context, meaning that all subsequent `RUN`, `CMD`, `ENTRYPOINT`, and `COPY` instructions in the Dockerfile will be executed under the `lightness` user, rather than the root.

You may then install the app's dependencies with the following line in your Dockerfile:

```dockerfile
RUN npm ci
```

## :exclamation: Launch the Vite development server
The last step in your Dockerfile will be to determine the command executed when running the container. This is done using the `CMD` instruction, which there can only be one of. In our case, this command will be launching the Vite developement server, or: `npm start`.

:warning: **Don't confuse `RUN` with `CMD`. `RUN` actually runs a command and commits the result; `CMD` doesn't execute anything at build time, but specifies the intended command for the image.**

> :space_invader: We are using the development server only for the sake of this basic exercise. Ideally, this app would first be built using `npm run build` then served with nginx or another production web server. Doing so with best practices in mind would require creating two container, which we will see next week with Docker Compose.

## :exclamation: Building and running the image
Your Dockerfile should now be ready to be built. To do so, navigate to your project directory in the command line and start the building process:

```bash
$> cd comem-progweb-lightness
$> docker build -t lightness .
```

Let's break down the second command:

1. `docker build`: This is the Docker command used to build an image from a Dockerfile and a "context". The context is typically a set of files at a specified location, which are required for building the image.

2. `-t lightness`: The `-t` flag stands for "tag". It allows you to assign a name to the image you're creating. In this case, the name (or tag) you're giving to your new Docker image is `lightness`. Naming images is crucial for identification and later use, especially when you want to run or push the image to a registry.

3. `.`: The dot at the end of the command represents the current directory, indicating that Docker should look for the Dockerfile in the current directory. This current directory is also considered as the build context sent to the Docker daemon. It means Docker includes the files and folders in this directory (except those specified in `.dockerignore`, if present) to build the image.

If the build succeeds, you should see it in your list of available images by running:

```bash
$> docker images
REPOSITORY     TAG       IMAGE ID       CREATED         SIZE
lightness      latest    44bdf838bf5b   2 minutes ago   599MB
```

You can now run the image by running:
```bash
$> docker run lightness
> lightness@1.1.0 start
> vite

  VITE v6.0.7  ready in 146 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Beautiful, it looks like the Vite developement server is up and running in our container. Let's try to visit the website by opening [http://localhost:5173](http://localhost:5173) is our navigator...

💥😢 **ERR_CONNECTION_REFUSED** 😢💥

Pause and think about what could possibly be wrong.

## :exclamation: Mapping Your Container's Ports
When you run a Docker container, it operates in its own isolated network environment. This means that services running inside the container, such as your Vite development server, aren't automatically accessible outside of it. To make your application accessible from your host machine (or outside the container's network), you need to map the container's ports to your host's ports. This is where the `-p` or `--publish` flag in the `docker run` command becomes essential.

The Vite server inside your container is set to listen on port 5173. However, this port is only exposed within the container's private network. To access your application from a web browser on your host machine, you must map the container's port 5173 to a port on your host machine. For example, if you want to access the application via port 8080 on your local machine, you would start the container with the following command:

```bash
$> docker run -p 8080:5173 lightness
```

Here, `-p 8080:5173` instructs Docker to forward traffic coming into your host's port 8080 to port 5173 on the container. As a result, when you navigate to [http://localhost:8080](http://localhost:8080) on your browser, Docker routes these requests to port 5173 on the container, where your Vite server is listening. 🎉 **Success** 🎉

This port mapping is crucial for web development and testing with Docker, as it bridges the gap between the isolated container environment and your accessible host network, allowing you to interact with your web application as if it were running natively on your local machine. Remember, port numbers on both sides of the colon can be changed based on your needs and the availability of ports on your system.

> :space_invader: For clarity and best practice, it's advisable to specify in your Dockerfile which ports the container is expected to use, by incorporating the `EXPOSE` instruction. While this instruction doesn't actually open or map any ports, it serves as an important form of documentation. It informs anyone using the image about the ports that the application within the container is set to listen on. This helps users understand how to interact with the containerized application and can guide them in setting up proper port mappings when they run the container.

## :checkered_flag: What have I done?
Through this exercise, you've taken a static site built with the Vite JavaScript bundler and transformed it into a containerized application, harnessing the power and flexibility of Docker. You started by setting up your environment, creating a .dockerignore file to optimize the build process, and crafting a Dockerfile with a carefully chosen base image. You've learned the importance of security by running the container as a non-root user, and you've mastered the intricacies of setting up a working directory, copying project files, and managing file permissions within the Docker environment. Launching the Vite development server inside the container and making it accessible via port mapping were critical steps that brought your application to life. Additionally, you've documented the exposed ports in your Dockerfile, thereby enhancing the clarity and usability of your Docker image.


[docker]: https://www.docker.com/
[docker-desktop]: https://www.docker.com/products/docker-desktop/
[docker-hub]: https://hub.docker.com/search?q=&image_filter=official
[dockerfile-reference]: https://docs.docker.com/engine/reference/builder/
[lightness-repo]: https://github.com/MediaComem/comem-progweb-lightness
[lightness-repo-installation]: https://github.com/MediaComem/comem-progweb-lightness?tab=readme-ov-file#-getting-started
