# Deploy a Node.js & Svelte application with a PostgreSQL database

The goal of this exercice is to put in practice the knowledge acquired during
previous exercices to deploy a new application from scratch on your server.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [The goal](#the-goal)
  - [The application](#the-application)
- [Getting started](#getting-started)
  - [Install the requirements](#install-the-requirements)
  - [Perform the initial setup](#perform-the-initial-setup)
  - [Optional: test the application](#optional-test-the-application)
- [Create a systemd service](#create-a-systemd-service)
- [Serve the application through nginx](#serve-the-application-through-nginx)
- [Provision a TLS certificate](#provision-a-tls-certificate)
- [Set up an automated deployment with Git hooks](#set-up-an-automated-deployment-with-git-hooks)
  - [Allow your user to restart the service without a password](#allow-your-user-to-restart-the-service-without-a-password)
  - [Test the automated deployment](#test-the-automated-deployment)
- [Troubleshooting](#troubleshooting)
  - [`ENOENT`](#enoent)
  - [`error: password authentication failed for user`](#error-password-authentication-failed-for-user)
  - [`permission denied to create extension "uuid-ossp"`](#permission-denied-to-create-extension-uuid-ossp)
  - [`remote: sudo: no tty present and no askpass program specified`](#remote-sudo-no-tty-present-and-no-askpass-program-specified)
  - [`code=exited, status=200/CHDIR`](#codeexited-status200chdir)
  - [`502 Bad Gateway`](#502-bad-gateway)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## The goal

You must deploy the provided application in a similar way as the PHP todolist in
previous exercises:

* You must install the language(s) and database necessary to run the
  application, which are not the same as for the PHP todolist.
* You must run the application as a systemd service.
* You must serve the application through nginx acting as a reverse proxy.
* You must provision a TLS certificate for the application and configure nginx
  to use it.
* You must set up an automated deployment via Git hooks for this application.

Additionally:

* The application must run in production mode (see its documentation).
* The application must restart automatically if your server is rebooted (i.e.
  your systemd service must be enabled).
* The application must be accessible **only through nginx**. It **must not** be
  exposed directly on a publicly accessible port. In the AWS virtual machines
  used in this course, ports 3000 and 3001 are open for testing. Do not use
  these ports in the final setup.
* Clients accessing the application over HTTP must be redirected to HTTPS.

### The application

The application you must deploy is a [rock-paper-scissors real-time web
game][app]. Its code is [available on GitHub][repo].

It uses:

* [Express.js][express], a [Node.js][node] framework, for the backend.
* [Svelte][svelte], a JavaScript framework, for the frontend.
* [PostgreSQL][postgres], an open source relational database.

You do not need to know the specifics of these technologies. Your goal is only
to deploy the application, not modify it.



## Getting started

### Install the requirements

You may want to start by making sure you have installed all the requirements
described in the [project's README][readme] on your server:

* **How to install Node.js:** there are several methods to install Node.js. One
  of the simplest is to use the [binary distributions provided by
  NodeSource][node-install]. You should look for installation instructions
  specific to your operating system (your AWS instance is running Ubuntu 20.04
  Focal). Where possible, you should find instructions for the apt package
  manager.
* **How to install PostgreSQL:** you can follow the official instructions on the
  Downloads page of the [PostgreSQL website][postgres]. You should look for
  installation instructions specific to your operating system (your AWS instance
  is running Ubuntu 20.04 Focal).
* **Check your Node.js installation:** you can check that Node.js has been
  correctly installed by displaying the version of the `node` command:

  ```bash
  $> node --version
  v14.15.1
  ```

  You can also check that Node.js is working correctly by running the following
  command:

  ```bash
  $> node -e 'console.log(1 + 2)'
  3
  ```
* **Check your PostgreSQL installation:** you can check that PostgreSQL has been
  correctly installed by displaying the version of the `psql` command:

  ```bash
  $> psql --version
  psql (PostgreSQL) 13.1 (Ubuntu 13.1-1.pgdg20.04+1)
  ```

  You can also verify that PostgreSQL is running by listing available databases,
  also with the `psql` command:

  ```bash
  $> sudo -u postgres psql -l
                                List of databases
     Name    |  Owner   | Encoding | Collate |  Ctype  |   Access privileges
  -----------+----------+----------+---------+---------+-----------------------
   postgres  | postgres | UTF8     | C.UTF-8 | C.UTF-8 |
   template0 | postgres | UTF8     | C.UTF-8 | C.UTF-8 | =c/postgres          +
             |          |          |         |         | postgres=CTc/postgres
   template1 | postgres | UTF8     | C.UTF-8 | C.UTF-8 | =c/postgres          +
             |          |          |         |         | postgres=CTc/postgres
  (3 rows)
  ```

### Perform the initial setup

You must also perform the **initial setup** instructions indicated in the
[project's README][readme].

> * **Note:** PostgreSQL listens on port 5432 by default.
> * **Note:** the setup instructions use the `createuser` and `createdb`
>   commands. These commands are binaries that come with the PostgreSQL server
>   and can be used to manage PostgreSQL users and databases on the command
>   line:
>
>   * The `createuser --pwprompt rps` command creates a PostgreSQL user named
>     "rps" and asks you to define a password for that user. The application
>     should use this PostgreSQL username and password to connect to the
>     database.
>   * The `createdb --owner rps rps` command creates an empty PostgreSQL
>     database named "rps" and owned by the "rps" user. This is the database
>     that the application will use.
>
>   This is equivalent to [part of the `todolist.sql`
>   script](https://github.com/MediaComem/comem-archidep-php-todo-exercise/blob/5d46e9fcf974d3d74d5eec838c512798f02581e1/todolist.sql#L1-L8)
>   you executed when first deploying the PHP todolist.
>
>   If you prefer using SQL, you could instead connect to the database as the
>   `postgres` user (equivalent to MySQL's `root` user) with `sudo -u postgres
>   psql` and run equivalent [`CREATE
>   USER`](https://www.postgresql.org/docs/13/sql-createuser.html) and [`CREATE
>   DATABASE`](https://www.postgresql.org/docs/13/sql-createdatabase.html)
>   queries.
> * **Note:** the `npm run migrate` command you are asked to run will execute
>   [the RPS application's database
>   migrations](https://github.com/MediaComem/rps/blob/627e80fcdfa8e5e4b4cfe66b9ff372a0d25e889f/src/server/migrations/20201209165252_init.ts)
>   which are written in code. The migration scripts will connect to the
>   database and create the necessary table(s).
>
>   This is equivalent to the [rest of the `todolist.sql`
>   script](https://github.com/MediaComem/comem-archidep-php-todo-exercise/blob/5d46e9fcf974d3d74d5eec838c512798f02581e1/todolist.sql#L12-L18)
>   you executed when first deploying to the PHP todolist.
> * **Note:** on the command line, PostgreSQL uses [peer
>   authentication](https://www.postgresql.org/docs/13/auth-peer.html) based on
>   your Unix username by default. This is why the commands are prefixed with
>   `sudo -u postgres`, which executes them as the `postgres` Unix user which
>   was created when you installed PostgreSQL. You can verify the existence of
>   this user with the command `cat /etc/passwd | grep postgres`.

### Optional: test the application

Before attempting to set up the systemd service, nginx configuration and
automated deployment, you can run the application manually to make sure it
works. The [project's README][readme] explains how to run the application and
how to configure it.

You can set the `PORT` environment variable to `3001` for this simple test, as
that is one of the ports that should be open in your AWS instance's firewall.
Run the application on that port and visit http://W.X.Y.Z:3001 to check that it
works (replacing `W.X.Y.Z` by your server's IP address). Stop the application
with `Ctrl-C` once you are done.



## Create a systemd service

Create and enable a systemd unit file like in the [systemd
exercise][systemd-ex]. Make the necessary changes to run the one chat room
application instead of the PHP todolist.

> **Hints:**
>
> * You will find the correct command to run the application in [the project's
>   `README`][readme]. Remember that systemd requires absolute paths to
>   commands.
> * You may want to set the `PORT` environment variable to choose the port on
>   which the application will listen. You can use the publicly accessible 3001
>   port temporarily for testing, but you should use another free port that is
>   not exposed to complete the exercise, since one of the requirements is to
>   expose the application only through nginx.

Once you have enabled and started the service, it should start automatically the
next time you restart the server with `sudo reboot`.

> **Advanced hint:** if you know what you are doing, you can already set up the
> automated deployment project structure at this point, so that you can point
> your systemd configuration to the correct directory. That way you will not
> have to modify it later.



## Serve the application through nginx

Create an nginx configuration to serve the application like in the [nginx
PHP-FPM exercise][nginx-php-fpm-ex].

Note that to make the real-time WebSocket part of the application work, you will
have to configure nginx to also [proxy the WebSocket
connection](http://nginx.org/en/docs/http/websocket.html), as this is not
enabled by default. You should add the following directives after `proxy_pass`:

```
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "Upgrade";
proxy_set_header Host $host;
```

> **Hints:**
>
> * Skip all steps related to PHP FPM, since they are only valid for a PHP
>   application.
> * The `include` and `fastcgi_pass` directives used in the PHP FPM exercise
>   make no sense for a non-PHP application. You should replace them with a
>   [`proxy_pass`
>   directive](http://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_pass).
>   as [presented during the course][nginx-rp-conf].
> * **Advanced:** you can also point the nginx configuration directly to the
>   automated deployment structure. That way you will not have to modify it
>   later.



## Provision a TLS certificate

Obtain and configure a TLS certificate to serve the application over HTTPS like
in the [certbot exercise][certbot-ex].



## Set up an automated deployment with Git hooks

Change your deployment so that the application can be automatically updated via
a Git hook like in the [automated deployment exercise][auto-deploy-ex].

> **Hints:**
>
> * Once you have set up the new directories, make sure to update your systemd
>   unit file to point to the correct directory.
>
>   Note that the new directory is a fresh deployment, so you have to repeat
>   part of the [initial setup][initial-setup] you performed in the original
>   directory. You do not have to create or migrate the database again, and your
>   hook will handle most of the setup, but you must manually configure the
>   `.env` file in this new deployment directory as well.
> * Update the `post-receive` hook. Compared to the PHP todolist, there are
>   additional steps which must be performed in the script for the automated
>   deployment to work correctly:
>
>   1. Dependencies must be updated (in case there are new or upgraded ones).
>   1. Pre-build the application again (so that changes are taken into account).
>   1. Migrate the database to the latest version (to take new database
>      migrations into account).
>   1. The systemd service must be restarted with `systemctl`. (Node.js code is
>      not reinterpreted on-the-fly as with PHP; the process must be restarted
>      so that the code is reloaded into memory).
>
>   The commands to perform these steps must be added to your `post-receive`
>   hook script.
> * Note: in the automated deployment exercice, it is mentionned that the
>   application will no longer work after changing the path to the repository in
>   the nginx configuration. In the case of the RPS application, it will
>   continue to work, because the application serves its static files on its
>   own, without nginx's help.
>
>   When using `fastcgi_pass`, nginx is asking the PHP FastCGI Process Manager
>   (PHP-FPM) to find and execute the PHP files in the `root` directory
>   specified by the configuration. When you change that `root` to a directory
>   that is empty (at that stage in the exercise), it will not find the PHP
>   files anymore, and return a 404 Not Found error.
>
>   When using `proxy_pass`, nginx is simply forwarding the request to the given
>   address and port. The application listens on that port and is capable of
>   serving its own files, regardless of nginx's configuration. So the
>   application will keep working even after changing the `root`.

### Allow your user to restart the service without a password

In order for the new `post-receive` hook to work, your user must be able to run
`sudo systemctl restart rps`  (assuming you have named your service `rps`)
without entering a password, otherwise it will not work in a Git hook.

> A Git hook is not an interactive program. You are not running it yourself, so
> you are not available to enter your password where prompted.

Create a `rps` Unix group:

```bash
$> sudo groupadd rps
```

Add your user to that group (replacing `john_doe` with your username):

```bash
$> sudo usermod -a -G rps john_doe
```

Make sure that your user has been added to the group successfully by looking for
it in the `/etc/group` file:

```bash
$> cat /etc/group | grep rps
rps:x:1005:john_doe
```

Make sure your default editor is `nano` (or whichever you are more comfortable
with):

```bash
$> sudo update-alternatives --config editor
```

Now you will edit the `sudoers` file to allow your user to run some specific
commands without a password.

**WARNING: be careful when editing the `sudoers` file, as you may corrupt your
system if you introduce errors.**

```bash
$> sudo visudo
```

Add the following line at the bottom of the file:

```
%rps ALL=(ALL:ALL) NOPASSWD: /bin/systemctl restart rps, /bin/systemctl status rps, /bin/systemctl start rps, /bin/systemctl stop rps
```

Exit with `Ctrl-X` and save when prompted.

> This line allows any user in the `rps` group to execute the listed commands
> with `sudo` without having to enter a password (hence the `NOPASSWD` option).
>
> You can test that it works by connecting to your server and running `sudo
> systemctl status rps`. It should no longer ask you for your password.

### Test the automated deployment

Clone your fork of the repository to your local machine, make sure you have
added a remote to your server, then commit and push a change to test the
automated deployment.

The only thing you can change with the pre-built version of the application is
the [title of the page which comes from the `package.json` file][change]. Make
sure you can commit a change to the title and deploy it automatically by pushing
the commit to your server.

> If your server is powerful enough to perform a full build, you could modify
> anything such as some text in one of the `src/website/*.svelte` components.
> But this then requires a full build with `npm run build`, which is impractical
> on small cloud servers.



## Troubleshooting

Here's a few tips about some problems you may encounter during this exercise.
Note that some of these errors can happen in various situations:

* When running a command manually from your terminal.
* When systemd tries to start your service.
* When your `post-receive` Git hook executes.

### `ENOENT`

If you see an error message similar to this, or generally any `ENOENT` error
message when running an `npm` command:

```
npm ERR! code ENOENT
npm ERR! syscall open
npm ERR! path /path/to/package.json
```

You are probably executing an `npm` command (such as `npm ci` or `npm start`) in
the wrong directory. `npm` commands should generally be executed in a directory
that contains the project's `package.json` file. This file describes project
information required by the various `npm` commands, such as the list of packages
to install or appropriate commands to run.

For this exercise, you want to run this command in the directory where the RPS
application's files are located (as explained in the project's README).

### `error: password authentication failed for user`

If you see an error similar to this when migrating the database or starting the
application:

```
error: password authentication failed for user "rps"
```

It means that the RPS application or its database migration scripts cannot
connect to the database. Are you sure that you followed all the setup
instructions and performed all necessary configuration? Did you properly
configure the PostgreSQL connection settings?

> Just like the PHP todolist required the correct configuration to successfully
> connect to its MySQL database, the RPS application also requires configuration
> to connect to its PostgreSQL database.

### `permission denied to create extension "uuid-ossp"`

If you see an error similar to this when migrating the database:

```
migration file "20201209165252_init.js" failed
migration failed with error: CREATE EXTENSION "uuid-ossp"; - permission denied to create extension "uuid-ossp"
error: CREATE EXTENSION "uuid-ossp"; - permission denied to create extension "uuid-ossp"
```

It is due to a difference in behavior between versions 12 and 13 of PostgreSQL.
You have probably installed version 12 which requires more permissions to create
this extension than version 13. The original instructions of the exercise did
not take this into account.

To fix the issue, create the extension yourself, as is now indicated in the
[initial setup instructions of the RPS
repository](https://github.com/MediaComem/rps#initial-setup):

```bash
$> sudo -u postgres psql -d rps -c 'CREATE EXTENSION "uuid-ossp"'
```

You also need to update the RPS application to the latest version to get a fix
of the migration script. If you cloned the application directly from
`https://github.com/MediaComem/rps`, you can simply go into the repository, pull
the latest changes, and download the precompiled build again:

```bash
$> cd /path/to/rps
$> git pull
$> npm run build:precompiled
```

> **If you have forked the repository and cloned your fork on your server
> instead of the original repository**, you must update your fork before pulling
> the latest changes on the server.
>
> **On your local machine,** clone your own RPS repository (replacing `JohnDoe`
> with your GitHub username), add the original RPS repository as a remote, merge
> the latest changes into your master branch, and push those changes to update
> your fork on GitHub:
>
> ```bash
> $> cd /path/to/projects
> $> git clone git@github.com:JohnDoe/rps.git
> $> cd rps
> $> git remote add upstream https://github.com/MediaComem/rps.git
> $> git checkout master
> $> git merge upstream/master
> $> git push origin master
> ```
>
> Then, **connect to your server** and perform the same instructions as
> previously mentionned (pull the latest changes and download the precompiled
> build):
>
> ```bash
> $> cd /path/to/rps
> $> git pull
> $> npm run build:precompiled
> ```

You should then be able to run `npm run migrate` successfully.

### `remote: sudo: no tty present and no askpass program specified`

If you see an error message similar to this when your Git hook is triggered:

```
remote: sudo: no tty present and no askpass program specified
```

It means that you have not performed the following step correctly: [Allow your
user to restart the service without a
password](#allow-your-user-to-restart-the-service-without-a-password). Make sure
that the list of authorized `systemctl` commands in the sudoers file match the
name of your service (if you named your systemd configuration file something
other than `rps.service`, you must adapt the commands in the sudoers file to
use the correct service name).

> This error occurs because ordinarily, your own Unix user does not have the
> right to execute `sudo systemctl restart rps` without you entering your
> password to gain administrative rights. A Git hook is executed in a
> non-interactive context: it can only print information, and you cannot
> interact with it (e.g. give it input) while it is running. This means that it
> cannot ask for your password, so any `sudo` command will fail by default.
>
> This is what the error message indicates: `no tty present` means that there is
> no interactive terminal (`tty` comes from the terminology of the 1970s: it
> means a **t**ele**ty**pewriter, which was one of the first terminals).
>
> The instructions mentioned above grant your user the right to execute specific
> `sudo` commands (like `sudo systemctl restart rps`) without having to enter
> your password. Once that is done, these commands will work from the Git hook
> as well.

### `code=exited, status=200/CHDIR`

If you see an error message similar to this in your systemd service's status:

```
code=exited, status=200/CHDIR
```

It means that systemd failed to move into the directory you specified (`CHDIR`
means **ch**ange **dir**ectory). Check your systemd configuration file to make
sure that the working directory you have configured is the correct one and
really exists.

### `502 Bad Gateway`

If you see this error in your browser when trying to access an nginx site you
have configured, it means that nginx cannot reach the proxy address you have
defined. Check your nginx configuration to make sure that you are using the
correct address and port. Are you sure your application is actually listening on
that port?



[app]: http://rps.simon-oulevay.archidep.online
[auto-deploy-ex]: https://github.com/MediaComem/comem-archidep/blob/master/ex/git-automated-deployment.md
[automated-deployment-nginx-update]: https://github.com/MediaComem/comem-archidep/blob/master/ex/git-automated-deployment.md#update-the-todolist-nginx-configuration
[certbot-ex]: certbot-deployment.md
[change]: https://github.com/MediaComem/rps/blob/369c511ce013b760fba8d2f9663b5d951370ae7e/package.json#L3
[express]: https://expressjs.com
[initial-setup]: https://github.com/MediaComem/rps#initial-setup
[make]: https://www.gnu.org/software/make/
[nginx-php-fpm-ex]: nginx-php-fpm-deployment.md
[nginx-rp-conf]: https://mediacomem.github.io/comem-archidep/2020-2021/subjects/reverse-proxy/?home=MediaComem%2Fcomem-archidep%23readme#29
[node]: https://nodejs.org
[node-install]: https://github.com/nodesource/distributions/blob/master/README.md
[nosql]: https://en.wikipedia.org/wiki/NoSQL
[npm]: https://www.npmjs.com
[postgres]: https://www.postgresql.org
[readme]: https://github.com/MediaComem/rps#readme
[redis]: https://redis.io
[repo]: https://github.com/MediaComem/rps
[svelte]: https://svelte.dev
[systemd-ex]: systemd-deployment.md
