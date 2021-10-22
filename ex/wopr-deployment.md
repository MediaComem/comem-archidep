# Deploy a Sinatra & Svelte application with a Redis database

The goal of this exercice is to put in practice the knowledge acquired during
previous exercices to deploy a new application from scratch on your server.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [The goal](#the-goal)
  - [The application](#the-application)
- [Getting started](#getting-started)
  - [Install compilation tools](#install-compilation-tools)
  - [Optional: test in development mode](#optional-test-in-development-mode)
- [Create a systemd service](#create-a-systemd-service)
- [Serve the application through nginx](#serve-the-application-through-nginx)
- [Provision a TLS certificate](#provision-a-tls-certificate)
- [Set up an automated deployment with Git hooks](#set-up-an-automated-deployment-with-git-hooks)
  - [Allow your user to restart the service without a password](#allow-your-user-to-restart-the-service-without-a-password)
  - [Test the automated deployment](#test-the-automated-deployment)
- [Troubleshooting](#troubleshooting)
  - [`ENOENT open package.json`](#enoent-open-packagejson)
  - [`Could not locate Gemfile`](#could-not-locate-gemfile)
  - [`Could not find concurrent-ruby-1.1.5 in any of the sources`](#could-not-find-concurrent-ruby-115-in-any-of-the-sources)
  - [`rimraf: not found`](#rimraf-not-found)
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

The application you must deploy is a [tic-tac-toe web game][app] where you can
play against the computer. Its code is [available on GitHub][repo].

It uses:

* [Sinatra][sinatra], a [Ruby][ruby] microframework, for the backend.
* [Svelte][svelte], a JavaScript framework, for the frontend.
* [Redis][redis], an in-memory [NoSQL][nosql] database, for the database.

You do not need to know the specifics of these technologies. Your goal is only
to deploy the application, not modify it.



## Getting started

You may want to start by making sure you have installed all the requirements
described in the [project's README][readme] on your server.

* **How to install:** there are several methods to install Ruby and Node.js. You
  should look for installation instructions specific to your operating system
  (your AWS instance is running Ubuntu 20.04 Focal). Where possible, you should
  find instructions to install with the apt package manager.

  For Redis, you may follow step 1 of this article:
  https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-redis-on-ubuntu-20-04.
* **Check your ruby installation:** you can check that Ruby has been correctly
  installed with the following command:

  ```bash
  ruby -e 'puts "Ruby #{RUBY_VERSION} is installed and working"'
  ```
* **Check your Node.js installation:** you can check that Node.js has been
  correctly installed with the following command:

  ```bash
  node -e 'console.log(`Node.js ${process.version} is installed and working`)'
  ```
* **Check your Redis installation:** step 2 of the article mentionned above
  explains how to make sure your Redis server is running.

### Install compilation tools

When installing dependencies for the WOPR application, you will use the `npm`
command to download packages from [npm][npm], a package manager for JavaScript
and [Node.js][node]. Some of these packages may have components programmed in
C/C++ that must be compiled. This is done automatically for you by the `npm`
command, so you don't have to worry about it.

But you do have to make sure that you have [make][make] and a C/C++ compiler
installed so that npm can do its job. You can do that with the following
command:

```bash
$> sudo apt install -y g++ make
```

### Optional: test in development mode

Before attempting to set up the systemd service, nginx configuration and
automated deployment, you can run the application manually in development mode
to make sure it works. The [project's README][readme] explains how to run the
application and how to configure it.

You can set the `PORT` environment variable to `3001` for this simple test, as
that is one of the ports that should be open in your AWS instance's firewall.
Run the application on that port and visit http://W.X.Y.Z:3001 to check that it
works (replacing `W.X.Y.Z` by your server's IP address). Stop the application
with `Ctrl-C` once you are done.

> Note that you do not need to configure database access credentials as with the
> PHP todolist. The application tries to connect to Redis with the Redis
> connection URL `redis://localhost:6379/0` by default. This should work with a
> default Redis installation.
>
> It works out of the box for two reasons: Redis requires no user or password by
> default, and it's also a schema-less NoSQL database.



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

> **Hints:**
>
> * Skip all steps related to PHP FPM, since they are only valid for a PHP
>   application.
> * The `include` and `fastcgi_pass` directives used in the PHP FPM exercise
>   make no sense for a non-PHP application. You should replace them with a
>   [`proxy_pass`
>   directive](http://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_pass).
>   as [presented during the course][nginx-rp-conf].
> * Similarly, you can also point the nginx configuration directly to the
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
> * Update the `post-receive` hook. Compared to the PHP todolist, there are
>   additional steps which must be performed in the script for the automated
>   deployment to work correctly:
>
>   1. Dependencies must be installed again (in case there are new ones).
>   1. The web assets must be re-built so that changes to client-side code are
>      taken into account.
>   1. The systemd service must be restarted with `systemctl`. (Ruby code is not
>      reinterpreted on-the-fly as with PHP; the process must be restarted so
>      that the code is reloaded into memory).
> * Note: in the automated deployment exercice, it is mentionned that the
>   application will no longer work after changing the path to the repository in
>   the nginx configuration. In the case of the WOPR application, it will
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
`sudo systemctl restart wopr`  (assuming you have named your service `wopr`)
without entering a password, otherwise it will not work in a Git hook.

> A Git hook is not an interactive program. You are not running it yourself, so
> you are not available to enter your password where prompted.

Create a `wopr` Unix group:

```bash
$> sudo groupadd wopr
```

Add your user to that group (replacing `john_doe` with your username):

```bash
$> sudo usermod -a -G wopr john_doe
```

Make sure that your user has been added to the group successfully by looking for
it in the `/etc/group` file:

```bash
$> cat /etc/group | grep wopr
wopr:x:1005:john_doe
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
%wopr ALL=(ALL:ALL) NOPASSWD: /bin/systemctl restart wopr, /bin/systemctl status wopr, /bin/systemctl start wopr, /bin/systemctl stop wopr
```

Exit with `Ctrl-X` and save when prompted.

> This line allows any user in the `wopr` group to execute the listed commands
> with `sudo` without having to enter a password (hence the `NOPASSWD` option).
>
> You can test that it works by connecting to your server and running `sudo
> systemctl status one-chat-room`. It should no longer ask you for your
> password.

### Test the automated deployment

Clone your fork of the repository to your local machine, make sure you have
added a remote to your server, then commit and push a change to test the
automated deployment.

For example, some of the text displayed in the main page is [in the file
`src/app.svelte`][change].



## Troubleshooting

Here's a few tips about some problems you may encounter during this exercise.
Note that some of these errors can happen in various situations:

* When running a command manually from your terminal.
* When systemd tries to start your service.
* When your `post-receive` Git hook executes.

### `ENOENT open package.json`

If you see an error message similar to this:

```
npm ERR! code ENOENT
npm ERR! syscall open
npm ERR! path /path/to/package.json
```

You are probably executing the `npm ci` command in the wrong directory. It must
be executed in a directory that contains both a `package.json` and
`package-lock.json` files. These files describe a list of npm packages to
install, which the `npm` command will download.

For this exercise, you want to run this command in the directory where the WOPR
application's files are located (as explained in the project's README).

### `Could not locate Gemfile`

If you see an error message similar to this:

```
Could not locate Gemfile
```

You are probably executing the `bundle install --path vendor/bundle` command in
the wrong directory. It must be executed in a directory that contains a file
named `Gemfile`. This file describes a list of ruby packages to install, which
the `bundle` command will download.

For this exercise, you want to run this command in the directory where the WOPR
application's files are located (as explained in the project's README).

### `Could not find concurrent-ruby-1.1.5 in any of the sources`

If you see an error message similar to this:

```
Could not find concurrent-ruby-1.1.5 in any of the sources
Run `bundle install` to install missing gems.
```

You are probably trying to execute the WOPR application without having installed
its Ruby dependencies (with the `bundle install --path vendor/bundle` command).

> Note that `bundle install --path vendor/bundle` downloads Ruby packages to a
> `vendor` directory in the current working directory. This means that you must
> run it at least once in each directory from which you want to execute the WOPR
> application.

### `rimraf: not found`

If you see an error message similar to this:

```
> wopr@1.0.0 build /path/to/wopr
> npm run clean && npm run webpack

> wopr@1.0.0 clean /path/to/wopr
> rimraf public

sh: 1: rimraf: not found
```

You are probably trying to execute the `npm run build` command in the WOPR
application without having installed its JavaScript dependencies (with the `npm
ci` command).

> Note that the `npm ci` command downloads npm packages to a `node_modules`
> directory in the current working directory. This means that you must run it at
> least once in each directory from which you want to execute the WOPR
> application.

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
other than `wopr.service`, you must adapt the commands in the sudoers file to
use the correct service name).

> This error occurs because ordinarily, your own Unix user does not have the
> right to execute `sudo systemctl restart wopr` without you entering your
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
> `sudo` commands (like `sudo systemctl restart wopr`) without having to enter
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



[app]: https://comem-wopr.herokuapp.com
[auto-deploy-ex]: https://github.com/MediaComem/comem-archidep/blob/master/ex/git-automated-deployment.md
[automated-deployment-nginx-update]: https://github.com/MediaComem/comem-archidep/blob/master/ex/git-automated-deployment.md#update-the-todolist-nginx-configuration
[certbot-ex]: certbot-deployment.md
[change]: https://github.com/MediaComem/comem-wopr/blob/4b75cc6c2c83c2fce1723ce655a12d5537c0bfbd/src/app.svelte#L26-L30
[make]: https://www.gnu.org/software/make/
[nginx-php-fpm-ex]: nginx-php-fpm-deployment.md
[nginx-rp-conf]: https://mediacomem.github.io/comem-archidep/2020-2021/subjects/reverse-proxy/?home=MediaComem%2Fcomem-archidep%23readme#29
[node]: https://nodejs.org
[nosql]: https://en.wikipedia.org/wiki/NoSQL
[npm]: https://www.npmjs.com
[readme]: https://github.com/MediaComem/comem-wopr#readme
[redis]: https://redis.io
[repo]: https://github.com/MediaComem/comem-wopr
[ruby]: https://www.ruby-lang.org
[sinatra]: http://sinatrarb.com
[svelte]: https://svelte.dev
[systemd-ex]: systemd-deployment.md
