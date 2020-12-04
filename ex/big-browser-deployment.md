# Deploy a Nest.js application with a Redis database

The goal of this exercise is to put in practice the knowledge acquired during
the architecture & deployment course's exercises to deploy a new application
from scratch on a server.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [The goal](#the-goal)
  - [The application](#the-application)
- [Getting started](#getting-started)
- [Create a systemd service](#create-a-systemd-service)
- [Serve the application through nginx](#serve-the-application-through-nginx)
- [Set up an automated deployment with Git hooks](#bonus-set-up-an-automated-deployment-with-git-hooks)
  - [Allow your user to restart the service without a password](#allow-your-user-to-restart-the-service-without-a-password)
  - [Test the automated deployment](#test-the-automated-deployment)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## The goal

You must deploy the provided application in a similar way as the PHP todolist
in previous exercises:

* You must install the language and database necessary to run the application,
  which are not the same as for the PHP todolist.
* You must run the application as a systemd service.
* You must serve the application through nginx acting as a reverse proxy.
* You must provision a TLS certificate for the application and configure nginx
  to use it.
* You must set up an automated deployment via Git hooks for the application.

Additionally:

* The application must run in production mode (see its documentation).
* The application must restart automatically if your server is rebooted (i.e.
  your systemd service must be enabled).
* The application must be accessible **only through nginx**. It **must not** be
  exposed directly on a publicly accessible port other than 80 or 443 (in the
  AWS instances used in this course, the other publicly accessible ports are 22,
  3000 and 3001, with port 22 being already used by SSH).
* Clients accessing the application over HTTP must be redirected to HTTPS.

### The application

The application you must deploy is [Big Browser][app]. Its code is [available on
GitHub][repo].

It is developed with:

* [nest][nest] for the backend.

  > Nest is a [Node.js (server-side JavaScript)][node] framework for building
  > server-side applications with [TypeScript][ts].
* [Vue.js][vue] for the frontend.

  > Vue is a JavaScript framework for building client-side applications.
* [Redis][redis] for the database.

  > Redis is an in-memory [NoSQL][nosql] database, cache and message broker.

You do not need to know any of these technologies, as your goal is only to
install and run the application, not modify it.



## Getting started

You should start by **forking** the [repository][repo] with the `Fork` button,
and use your own copy of the repository instead of the provided one.  This will
make it easier for you to test the automated deployment at the end.

Then install the required dependencies and perform the required setup as
indicated in the [project's `README`][readme]. Where necessary, you will need to
find installation instructions for Ubuntu (version 20.04 Focal).

### Optional: test in development mode

Before attempting to set up the systemd service, nginx configuration and
automated deployment, you might want to simply run the application manually in
development mode to make sure it works.

You can do that with the following command on your server:

```bash
$> cd /path/to/application
$> PORT=3001 npm start
```

> You can set the `PORT` environment variable to `3001` for this simple test, as
> that is one of the ports that should be open in your AWS virtual machine's
> firewall.

Visit http://W.X.Y.Z:3001 to check that it works (replacing `W.X.Y.Z` by your
server's IP address).  Stop the application with `Ctrl-C` once you are done.

> Note that you did not need to configure database access credentials as with
> the PHP Todo List.
>
> It works out of the box for two reasons: Redis requires no user or password by
> default, and it's also a schema-less NoSQL database (databases and keys are
> created on-the-fly as they are accessed the first time).



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
>   1. The application must be re-built.
>   1. The systemd service must be restarted with `systemctl`. (Node.js code is
>      not reinterpreted on-the-fly as with PHP; the process must be restarted
>      so that the code is reloaded into memory).
> * Note: in the automated deployment exercice, it is mentionned that the
>   application will no longer work after changing the path to the repository in
>   the nginx configuration. In the case of the Big Browser application, it will
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
`sudo systemctl restart big-browser` (assuming you have named your service
`big-browser`) without entering a password, otherwise it will not work in a Git
hook.

> A Git hook is not an interactive program. You are not running it yourself, so
> you are not available to enter your password where prompted.

Create a `big-browser` Unix group:

```bash
$> sudo groupadd big-browser
```

Add your user to that group (replacing `john_doe` with your username):

```bash
$> sudo usermod -a -G big-browser john_doe
```

Make sure that your user has been added to the group successfully by looking
for it in the `/etc/group` file:

```bash
$> cat /etc/group | grep big-browser
big-browser:x:1005:john_doe
```

Make sure your default editor is `nano` (or whichever you are more comfortable
with):

```bash
$> sudo update-alternatives --config editor
```

Now you will edit the `sudoers` file to allow your user to run some specific
commands without a password.

**WARNING: be VERY careful when editing the `sudoers` file, as you may corrupt
your system if you introduce syntax errors.**

```bash
$> sudo visudo
```

Add the following line at the bottom of the file:

```
%big-browser ALL=(ALL:ALL) NOPASSWD: /bin/systemctl restart big-browser, /bin/systemctl status big-browser, /bin/systemctl start big-browser, /bin/systemctl stop big-browser
```

Exit with `Ctrl-X` and save when prompted.

> This line allows any user in the `big-browser` group to execute the listed
> commands with `sudo` without having to enter a password (hence the `NOPASSWD`
> option).
>
> You can test that it works by connecting to your server and running `sudo
> systemctl status one-chat-room`. It should no longer ask you for your
> password.

### Test the automated deployment

Clone your fork of the repository to your local machine, make sure you have
added a remote to your server, then commit and push a change to test the
automated deployment.

For example, you may change the title in the navbar, which is in [in the
`public/index.html`
file](https://github.com/mediacomem/big-browser/blob/8c38c2b3a2438374d7747169a52cf30669dab6c1/public/index.html#L14).



[app]: https://big-browser.herokuapp.com
[auto-deploy-ex]: https://github.com/MediaComem/comem-archidep/blob/master/ex/git-automated-deployment.md
[certbot-ex]: certbot-deployment.md
[nest]: https://nestjs.com
[nginx-install]: https://mediacomem.github.io/comem-archidep/2020-2021/subjects/reverse-proxy/?home=MediaComem%2Fcomem-archidep%23readme#18
[nginx-php-fpm-ex]: https://github.com/MediaComem/comem-archidep/blob/master/ex/nginx-php-fpm-deployment.md
[nginx-rp-conf]: https://mediacomem.github.io/comem-archidep/2020-2021/subjects/reverse-proxy/?home=MediaComem%2Fcomem-archidep%23readme#29
[node]: https://nodejs.org
[nosql]: https://en.wikipedia.org/wiki/NoSQL
[readme]: https://github.com/mediacomem/big-browser#readme
[redis]: https://redis.io
[repo]: https://github.com/mediacomem/big-browser
[systemd-ex]: https://github.com/MediaComem/comem-archidep/blob/master/ex/systemd-deployment.md
[systemd-reload]: https://mediacomem.github.io/comem-archidep/2020-2021/subjects/linux-process-management/?home=MediaComem%2Fcomem-archidep%23readme#10
[ts]: https://www.typescriptlang.org
[vue]: https://vuejs.org
