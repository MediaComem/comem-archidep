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

## :exclamation: Prerequisites
* To follow this exercise, you will to have Docker installed on your machine. To do so, install [Docker Desktop][docker-desktop] and follow use the recommended settings.

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

Given this information, create a `.dockerignore` file at the root of the project and exclude these irrelevant folders. The syntax is the same as `.gitignore` file.

## Create a Dockerfile and find a base image.

[docker]: https://www.docker.com/
[docker-desktop]: https://www.docker.com/products/docker-desktop/
[lightness-repo]: https://github.com/MediaComem/comem-progweb-lightness
[lightness-repo-installation]: https://github.com/MediaComem/comem-progweb-lightness?tab=readme-ov-file#-getting-started
