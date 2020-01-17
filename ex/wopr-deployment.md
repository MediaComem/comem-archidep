# Deploy a Sinatra & Svelte application with a Redis database

The goal of this exercice is to put in practice the knowledge acquired during
previous exercices to deploy a new application from scratch on your server.

**This exercise is part of the course evaluation.**

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [The goal](#the-goal)
  - [The application](#the-application)
- [Getting started](#getting-started)
  - [Optional: test in development mode](#optional-test-in-development-mode)
- [Create a systemd service](#create-a-systemd-service)
- [Serve the application through nginx](#serve-the-application-through-nginx)
- [Set up an automated deployment with Git hooks](#set-up-an-automated-deployment-with-git-hooks)
  - [Allow your user to restart the service without a password](#allow-your-user-to-restart-the-service-without-a-password)
  - [Test the automated deployment](#test-the-automated-deployment)
- [Complete the exercise](#complete-the-exercise)

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
  (your AWS instance is running Ubuntu 18.04 Bionic). Where possible, you should
  find instructions to install with the apt package manager.

  For Redis, you may follow step 1 of this article:
  https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-redis-on-ubuntu-18-04.
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

### Optional: test in development mode

Before attempting to set up the systemd service, nginx configuration and
automated deployment, you can run the application manually in development mode
to make sure it works. The [project's README][readme] explains how to run the
application and how to configure it.

You can set the `PORT` environment variable to `3001` for this simple test, as
that is one of the ports that should be open in your AWS instance's firewall.
Run the application on that port and visit http://1.2.3.4:3001 to check that it
works (replacing `1.2.3.4` by your server's IP address). Stop the application
with `Ctrl-C` once you are done.

> Note that you do not need to configure database access credentials as with the
> PHP todolist. The application tries to connect to Redis with the Redis
> connection URL `redis://localhost:6379/0` by default. This should work with a
> default Redis installation.
>
> It works out of the box for two reasons: Redis requires no user or password by
> default, and it's also a schema-less NoSQL database.



## Create a systemd service

Create a systemd service file and enable this new service like in the [systemd
exercise][systemd-ex]. You must of course adapt the information in the service
file to the application you are trying to deploy. We suggest you name the
service `wopr`.

* **Absolute command path:** when setting the `ExecStart` directive in a systemd
  unit file, you must use the absolute path to the command your want to run
  (e.g. `/usr/bin/php` instead of just `php`). To find the path to a command,
  you can use the `which` command:

  ```bash
  $> which php
  /usr/bin/php
  ```
* **Use a private port:** you may use ports 3000 and 3001 for tests, but
  remember that in the final setup, you must use a port that is not publicly
  exposed.



## Serve the application through nginx

Create an nginx configuration to serve the application like in the [nginx
PHP-FPM exercise][nginx-php-fpm-ex]. You must of course adapt the information in
the nginx configuration to the application you are trying to deploy.

* **Use a simple `proxy_pass` directive:** In the PHP-FPM exercise, you had to
  use FasctCGI (nginx's `fastcgi_pass` directive) to get nginx to communicate
  with the PHP Todolist, because PHP applications do not listen on a port.

  For this exercise, you can remove the `include` and `fastcgi_pass` directives
  and use a simply `proxy_pass` as [presented during the course][nginx-rp-conf].
  Nginx will simply proxy the request to the specific host and port.



## Set up an automated deployment with Git hooks

Make it so that the application can be automatically deployed via a Git hook
like in the [previous exercise][previous-ex].

* **Update the `post-receive` hook:** Ruby and Node.js applications are loaded
  into memory when they are started. In order for your automated deployment to
  take source code changes into account, you must add the following steps to your script:

  1. Re-build the application's web assets (see the [project's README][readme])
     so that changes to Svelte code are taken into account.
  2. Restart the application's systemd service so that changes to the Ruby code
     are taken into account. You can do that with `sudo systemctl restart
     my-service`.

### Allow your user to restart the service without a password

In order for the new `post-receive` hook to work, your user must be able to run
`sudo systemctl restart my-service` without entering a password, since you will
not be here to enter your password when the Git hook runs.

Create a `wopr` Unix group:

```bash
$> sudo groupadd wopr
```

Add your user to that group (replacing `john_doe` with your username):

```bash
$> sudo usermod -a -G wopr john_doe
```

Make sure that your user has been added to the group successfully by looking for it in the `/etc/group` file:

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

> That line allows any user in the `wopr` group to execute the listed commands with `sudo`
> without having to enter a password (hence the `NOPASSWD` option).

### Test the automated deployment

Commit a change and push it to your repository on the server to test the
automated deployment. For example, the text of the main page's buttons is [in
the file `src/app.svelte`][change].



## Complete the exercise

Send an email to the teacher with the URL to your deployed application.



[app]: https://comem-wopr.herokuapp.com
[change]: https://github.com/MediaComem/comem-wopr/blob/master/src/app.svelte#L17
[nginx-php-fpm-ex]: nginx-php-fpm-deployment.md
[nginx-rp-conf]: https://mediacomem.github.io/comem-archidep/2019-2020/subjects/reverse-proxy/?home=MediaComem%2Fcomem-archidep%23readme#29
[node]: https://nodejs.org
[nosql]: https://en.wikipedia.org/wiki/NoSQL
[previous-ex]: git-automated-deployment.md
[readme]: https://github.com/MediaComem/comem-wopr#readme
[redis]: https://redis.io
[repo]: https://github.com/MediaComem/comem-wopr
[ruby]: https://www.ruby-lang.org
[sinatra]: http://sinatrarb.com
[svelte]: https://svelte.dev
[systemd-ex]: systemd-deployment.md
