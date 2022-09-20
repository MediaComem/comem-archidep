# Push a Git repository to a server

<!-- START doctoc -->
<!-- END doctoc -->

The goal of this exercise is to demonstrate how to push a project's source code to a server with Git, from your local machine.

Perform the following tasks:

- Connect to the `archidep.ch` exercise server with SSH.
- Create a new empty repository in your home directory.
  - _Hint:_ use the `mkdir`, `cd` and `git init` commands.
- Switch to another branch in the repository.

  (This is necessary because Git will not let you push to a branch that is checked out (it could overwrite files).
  Since we want to push the main branch to the server later, you must switch to another branch first.)

  - _Hint:_ use the `git checkout -b` command.

- Disconnect from the exercise server.
- Move into your team's solution repository from the collaborative exercise.
  - If you have not completed the collaborative exercise, you can clone the [base repository](https://github.com/MediaComem/comem-archidep-php-todo-exercise) instead with the `git clone` command, and move into that.
- Add a new remote pointing to the repository you created on the exercise server.
  - _Hint:_ the command to add a remote is `git remote add <name> <url>`
  - _Hint:_ the URL syntax for an SSH remote is `ssh://user@host/path/to/repo`
- Push the `main` branch to the new remote.
  - _Hint:_ the syntax of the push command is `git push [origin] [branch]`
- Connect to the `archidep.ch` exercise server with SSH.
- Move into the repository you created earlier.
- Checkout the `main` branch and make sure your code is there (e.g. with `ls`).
