# Set up an automated deployment with Git hooks

This guide describes how to automatically deploy a PHP application when pushing commits to a server.

It assumes that you have performed the previous [nginx & PHP FPM exercise][php-fpm-ex].

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Set up directories](#set-up-directories)
- [Update the Systemd configuration](#update-the-systemd-configuration)
- [Update the todolist nginx configuration](#update-the-todolist-nginx-configuration)
- [Create a bare Git repository on the server](#create-a-bare-git-repository-on-the-server)
  - [Add a `post-receive` hook to the Git repository](#add-a-post-receive-hook-to-the-git-repository)
- [Add the server's Git repository as a remote](#add-the-servers-git-repository-as-a-remote)
- [Make an automated deployment](#make-an-automated-deployment)
- [Commit a change to the project and deploy it](#commit-a-change-to-the-project-and-deploy-it)
- [End result](#end-result)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## Set up directories

**Connect to your server.**

Create two directories, `todolist-automated` and `todolist-automated-repo`, in your home directory:

```bash
$> cd
$> mkdir todolist-automated
$> mkdir todolist-automated-repo
```

The `todolist-automated-repo` directory will be the Git repository,
Later you will add it as a remote in your local Git repository,
so that you can push commits to it.

The `todolist-automated` directory will contain the currently deployed version of the code.
The goal is that every time you push commits to the repository, this directory is automatically updated.



## Update the Systemd configuration

In previous exercises you configured Systemd to manage the PHP todolist
application in the `todolist-repo` directory. You specified the path to the
repository with the `WorkingDirectory` option.

Edit that configuration:

```bash
$> sudo nano /etc/systemd/system/todolist.service
```

Udpate `todolist-repo` to `todolist-automated` in the `WorkingDirectory` option
so that Systemd looks in the correct directory.

Restart the service:

```bash
$> sudo systemctl restart todolist
```



## Update the todolist nginx configuration

In previous exercises you configured nginx to serve the PHP application from the `todolist-repo` directory.
Edit that configuration:

```bash
$> sudo nano /etc/nginx/sites-available/todolist
```

Change `todolist-repo` to `todolist-automated` so that nginx looks in the correct directory.

Tell nginx to reload its configuration:

```bash
$> sudo nginx -s reload
```

The site at http://todolist.john-doe.archidep.tech should not work anymore
You should get a `404 Not Found` error from nginx
(since there are no files in the `todolist-automated` directory yet).



## Create a bare Git repository on the server

Git will not let you push commits to a normal repository with a working tree,
so you need to use a bare repository instead, with only its git directory:

```bash
$> cd ~/todolist-automated-repo
$> git init --bare
Initialized empty Git repository in /home/john_doe/todolist-automated-repo/
```

> A bare repository is a repository with only a git directory and no working tree.
> The project's files are not checked out.
> It's used mostly on servers for sharing or automation.

### Add a `post-receive` hook to the Git repository

Copy this script and replace `john_doe` by your username:

```
#!/usr/bin/env bash
set -e

echo Checking out latest version...
export GIT_DIR=/home/john_doe/todolist-automated-repo
export GIT_WORK_TREE=/home/john_doe/todolist-automated
git checkout -f main
cd "$GIT_WORK_TREE"

echo Deployment successful
```

:warning: If your repo has a `master` branch instead of a `main` branch, replace
`main` by `master` in the `git checkout -f main` command in your hook.

> This script will take the latest version of the code in the `todolist-automated-repo` repository
> and checkout a working tree in the `todolist-automated` directory (the one nginx is serving files out of).

Open `post-receive` file in the repository's `hooks` directory:

```bash
$> nano hooks/post-receive
```

Paste the contents.
Exit with `Ctrl-X` and save when prompted.

Make the hook executable:

```bash
$> chmod +x hooks/post-receive
```

Make sure the permissions of the hook are correct:

```bash
$> ls -l hooks/post-receive
-rwxrwxr-x 1 john_doe john_doe 239 Jan 10 20:55 hooks/post-receive
```

> It should have the `x` (e**x**ecute) permission for owner, group and others.



## Add the server's Git repository as a remote

**Disconnect from the server. The following steps happen on your local machine.**

Go to the PHP todolist repository on your local machine:

```bash
$> cd /path/to/projects/comem-archidep-php-todo-exercise
```

Git can communicate over SSH, so you can add an [SSH remote][git-ssh-protocol]
(replace `john_doe` with your username and `W.X.Y.Z` with your server's IP address):

```bash
$> git remote add archidep john_doe@W.X.Y.Z:todolist-automated-repo
```



## Make an automated deployment

From your local machine, push the latest version of the `main` branch to the remote on your server:

```bash
$> git push archidep main
Enumerating objects: 36, done.
Counting objects: 100% (36/36), done.
Delta compression using up to 8 threads
Compressing objects: 100% (19/19), done.
Writing objects: 100% (36/36), 15.09 KiB | 15.09 MiB/s, done.
Total 36 (delta 16), reused 36 (delta 16)

remote: Checking out latest version...
remote: Deployment successful

To W.X.Y.Z:todolist-automated-repo
 * [new branch]      main -> main
```

:warning: If your repo has a `master` branch instead of a `main` branch, replace
`main` by `master` in the `git push archidep main` command in your hook.

> If you have set up your `post-receive` hook correctly,
> you will see its `echo` commands displayed when you run `git push`.
> In the above example, they are the two lines starting with `remote:`.

The site at http://todolist.john-doe.archidep.tech should work again.

Additionally, if you **connect to the server**,
the `todolist-automated` directory should contain the latest version of the project's files,
as checked out by the `post-receive` hook:

```bash
$> ls ~/todolist-automated
LICENSE.txt  README.md  images  index.php  todolist.sql  update.sh
```



## Commit a change to the project and deploy it

**On your local machine,** make a visible change to the project's `index.php` file.

> For example, look for the `<strong>TodoList</strong>` title tag and change the title.

Commit and push your changes:

```bash
$> git add .

$> git commit -m "Change title"

$> git push archidep main
...
remote: Checking out latest version...
remote: Deployment successful
To W.X.Y.Z:todolist-automated-repo
   4ea6994..2faf028  main -> main
```

Visit http://todolist.john-doe.archidep.tech again. Your changes should have
been deployed automatically!



## End result

![Diagram](git-automated-deployment.png)

> [PDF version](git-automated-deployment.pdf).



[git-ssh-protocol]: https://git-scm.com/book/en/v2/Git-on-the-Server-The-Protocols#_the_ssh_protocol
[php-fpm-ex]: nginx-php-fpm-deployment.md
