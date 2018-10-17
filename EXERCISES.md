# COMEM+ Architecture & Deployment Exercises

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Version control](#version-control)
  - [Collaborative exercise (graded)](#collaborative-exercise-graded)
  - [Clone a repository from a server](#clone-a-repository-from-a-server)
  - [Push a repository to a server](#push-a-repository-to-a-server)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Version control

### Collaborative exercise (graded)

Follow the instructions in the [exercise repository][php-todo-ex].

### Clone a repository from a server

The goal of this exercise is to demonstrate how to retrieve a project's source code with Git while connected to a remote server.

Perform the following tasks:

* Connect to the `archidep-2018.media` exercise server with SSH.
* Clone your team's solution repository from the collaborative exercise somewhere in your home directory.
  * If you have not completed the collaborative exercise, you can try doing the same with the [base repository][php-todo-ex].

### Push a repository to a server

The goal of this exercise is to demonstrate how to push a project's source code to a server with Git, from your local machine.

Perform the following tasks:

* Connect to the `archidep-2018.media` exercise server with SSH.
* Create a new empty repository in your home directory.
  * *Hint:* use the `mkdir`, `cd` and `git init` commands.
* Disconnect from the exercise server.
* Move into your team's solution repository from the collaborative exercise
  * If you have not completed the collaborative exercise, you can clone the [base repository][php-todo-ex] instead with the `git clone` command, and move into that.
* Add a new remote pointing to the repository you created on the exercise server.
  * *Hint:* the command to add a remote is `git remote add <name> <url>`
  * *Hint:* the URL syntax for an SSH remote is `ssh://user@host:path/to/repo`
* Push the `master` branch to the new remote
  * *Hint:* the syntax of the push command is `git push [origin] [branch]`





[php-todo-ex]: https://github.com/MediaComem/comem-archidep-php-todo-exercise
