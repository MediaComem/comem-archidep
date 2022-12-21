# Deploy web applications with a database to Render

The goal of this exercice is to deploy the same [PHP Todolist][repo] application as in previous exercises, but this time on the Render Platform-as-a-service (PaaS) cloud instead of your own server in the Infrastructure-as-a-Service (IaaS) Microsoft Azure Web Services cloud. This illustrates the difference between the two cloud service models.


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

This guide assumes that you are familiar with [git][git-slides] and that you have a basic understanding of what a Platform-as-a-Service is.

**You will also need to [register a Render account][render-register]**.

> :warning: Although you *could* work on this exercise from your Azure server, we suggest follow the exercise on your local machine.

## :exclamation: Getting code updates from upstream

When you started working on the Todolist application, you forked an existing codebase from a GitHub repository. While you were working on your configuration, the team with access to the original repository implemented the changes necessary for a deployment PaaS in a branch called ``docker-postgres``.

By default, your fork should've stopped tracking changes from the original repo, which is also referred to as the **upstream**. Let's reconfigure our repository so that it can fetch data from there.

> :question: If you do not remember where the Todolist repository is stored on your local machine, you can simply clone it again from GitHub by running ``git clone https://github.com/username/comem-archidep-php-todo-exercise.git``. Don't forget to replace the placeholder with your GitHub handle.

From the terminal, travel to your repository and add the upstream repository as a remote:

```bash
$> cd comem-archidep-php-todo-exercise
$> git remote add upstream https://github.com/MediaComem/comem-archidep-php-todo-exercise.git
```

>:gem: Unlike the [automated deployment exercise][automated-deployment-ex], the goal of this remote is not be used for pushing. We will instead reference this remote for fetching data.

Not let's fetch data from the upstream:

```bash
$> git fetch upstream
remote: Enumerating objects: 11, done.
remote: Counting objects: 100% (11/11), done.
remote: Compressing objects: 100% (6/6), done.
remote: Total 11 (delta 4), reused 11 (delta 4), pack-reused 0
Unpacking objects: 100% (11/11), 3.20 KiB | 545.00 KiB/s, done.
From https://github.com/MediaComem/comem-archidep-php-todo-exercise
 * [new branch]      docker-postgres -> upstream/docker-postgres
 * [new branch]      main            -> upstream/main
 * [new branch]      master          -> upstream/master
```
As you can see, this gives us access to upstream branches, including one called ``upstream/docker-postgres``. The next step is to create our own branch and copy the contents of the upstream.

```bash
$> git checkout -b docker-postgres upstream/docker-postgres
branch 'docker-postgres' set up to track 'upstream/docker-postgres'.
Switched to a new branch 'docker-postgres'
```

This command will create a new branch on **your** repository, based on the contents of the upstream branch. This command automatically switches you to the new branch.

If you browser through the project in a code editor, you should now be able to see changes to ``todolist.sql``, as well as a mysterious new ``Dockerfile``.

Let's push this new branch to GitHub:
 ```bash
 $> git push origin
 ...
  * [new branch]      docker-postgres -> docker-postgres
 ```


>:books: Let's note that this whole step has nothing to do with PaaS deployments in and of themselves. It is just a corollary of some code changes that had to be made for the Todolist to work with Postgres and the fact that we didn't you to have to implement those changes manually.



[automated-deployment-ex]: https://github.com/MediaComem/comem-archidep/blob/main/ex/git-automated-deployment.md
[repo]: https://github.com/MediaComem/comem-archidep-php-todo-exercise
[git-slides]: https://mediacomem.github.io/comem-archidep/2022-2023/subjects/git/?home=MediaComem%2Fcomem-archidep%23readme#1
[render-register]: https://dashboard.render.com/register
