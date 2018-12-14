# COMEM+ Architecture & Deployment Exercises

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Version control](#version-control)
  - [Collaborative exercise (graded)](#collaborative-exercise-graded)
  - [Clone a repository from a server](#clone-a-repository-from-a-server)
  - [Push a repository to a server](#push-a-repository-to-a-server)
- [Unix](#unix)
  - [Permissions](#permissions)
  - [Pipelines](#pipelines)
- [Basic deployment](#basic-deployment)
  - [Run your own virtual server on Amazon Web Services (bonus)](#run-your-own-virtual-server-on-amazon-web-services-bonus)
  - [Deploy a PHP application with SFTP](#deploy-a-php-application-with-sftp)

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
* Switch to another branch in the repository.

  (This is necessary because Git will not let you push to a branch that is checked out (it could overwrite files).
  Since we want to push the master branch to the server later, you must switch to another branch first.)
  * *Hint:* use the `git checkout -b` command.
* Disconnect from the exercise server.
* Move into your team's solution repository from the collaborative exercise.
  * If you have not completed the collaborative exercise, you can clone the [base repository][php-todo-ex] instead with the `git clone` command, and move into that.
* Add a new remote pointing to the repository you created on the exercise server.
  * *Hint:* the command to add a remote is `git remote add <name> <url>`
  * *Hint:* the URL syntax for an SSH remote is `ssh://user@host/path/to/repo`
* Push the `master` branch to the new remote.
  * *Hint:* the syntax of the push command is `git push [origin] [branch]`
* Connect to the `archidep-2018.media` exercise server with SSH.
* Move into the repository you created earlier.
* Checkout the `master` branch and make sure your code is there (e.g. with `ls`).





## Unix

### Permissions

* Create a `/home/YOURUSER/alice` directory.

  **Solution:**

  ```bash
  $> cd ~
  $> mkdir alice
  ```
* The `alice` user must be able to traverse, but not read this directory.

  **Solution with symbolic mode:**

  ```bash
  $> chmod o-x alice
  ```

  **Solution with octal mode:**

  ```bash
  $> chmod 751 alice
  ```
* The directory must contain a `readable.txt` file that `alice` can read from, but not write to.

  **Solution:**

  ```bash
  $> echo "some content" > readable.txt
  ```
* The directory must contain a `writable.txt` file that `alice` can read from and write to.

  **Solution with chmod with symbolic or octal mode:**

  ```bash
  $> echo "some other content" > writable.txt
  $> chmod o+w writable.txt
  $> chmod 666 writable.txt
  ```

  **Solution with chown:**

  ```bash
  $> echo "some other content" > writable.txt
  $> sudo chown alice writable.txt
  ```

### Pipelines

Download the exercice file to your computer with the following command:

```bash
$> curl -L https://git.io/fAjRa > rainbow.txt
```

Display the file:

```bash
$> cat rainbow.txt
Somewhere over the rainbow
...
```

Use command pipelines and stream redirections to:

* Count the number of lines and characters in the text.

  **Solution:**

  ```bash
  $> cat rainbow.txt | wc -l
  50
  $> cat rainbow.txt | wc -m
  1284
  ```

  **Solution counting the number of characters excluding new lines:**

  ```bash
  $> cat rainbow.txt | fold -w 1 | wc -l
  1242
  ```
* Print the lines of the text containing the word `rainbow`.

  **Solution:**

  ```bash
  $> cat rainbow.txt | grep rainbow
  Somewhere over the rainbow
  Somewhere over the rainbow
  Somewhere over the rainbow
  The colors of the rainbow so pretty in the sky
  Oh, somewhere over the rainbow
  ```

* Do the same but without any duplicates.

  **Solution:**

  ```bash
  $> cat rainbow.txt | grep rainbow | sort | uniq
  Oh, somewhere over the rainbow
  Somewhere over the rainbow
  The colors of the rainbow so pretty in the sky
  ```
* Print the second word of each line in the text.

  **Solution:**

  ```bash
  $> cat rainbow.txt | cut -d ' ' -f 2
  over
  up
  the
  in

  over
  fly
  ...
  ```
* Compress the text and save it to `rainbow.txt.gz`.

  **Solution:**

  ```bash
  $> cat rainbow.txt | gzip -c > rainbow.txt.gz
  ```
* Count the number of times the letter `e` or the word `the` is used.

  **Solution for the letter `e`:**

  ```bash
  $> cat rainbow.txt | fold -w 1 | grep e | wc -l
  131
  ```

  **Solution for the word `the`:**

  ```bash
  $> cat rainbow.txt | tr '[:upper:]' '[:lower:]' | tr -s '[[:punct:][:space:]]' '\n' | grep -w the | wc -l
  ```
* Display a list of the unique words in the text along with the number of times each word is used,
  sorted from the least used to the most used.

  **Solution:**

  ```bash
  cat rainbow.txt | tr '[:upper:]' '[:lower:]' | tr -s '[[:punct:][:space:]]' '\n' | sort | uniq -c | sort -bn
  ```





## Basic deployment

### Run your own virtual server on Amazon Web Services (bonus)

Follow the [instructions](ex/aws-setup.md).

### Deploy a PHP application with SFTP

Follow the [instructions](ex/sftp-deployment.md).






[php-todo-ex]: https://github.com/MediaComem/comem-archidep-php-todo-exercise
