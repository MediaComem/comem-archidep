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
- [Bonus: set up an automated deployment with Git hooks](#bonus-set-up-an-automated-deployment-with-git-hooks)
    - [Allow your user to restart the service without a password](#allow-your-user-to-restart-the-service-without-a-password)
    - [Test the automated deployment](#test-the-automated-deployment)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## The goal

You must deploy the provided application in a similar way as the PHP Todo List
and One Chat Room application deployed during the course:

* You must install the language and database necessary to run the application.
* You must run the application as a systemd service.
* You must serve the application through nginx acting as a reverse proxy.
* *Bonus:* you can set up an automated deployment via Git hooks for the
  application.

Additionally:

* The application must be accessible **only through nginx**.  It **must not**
  be exposed directly on a publicly accessible port (in the AWS virtual
  machines used for this exercise, the publicly accessible ports are 22, 80, 443,
  3000 and 3001, some of them already used by SSH or nginx).

### The application

The application you must deploy is [Big Browser][app].
Its code is [available on GitHub][repo].

It is developed with:

* [nest][nest] for the backend.

  > Nest is a [Node.js (server-side JavaScript)][node] framework for building
  > server-side applications with [TypeScript][ts].
* [Vue.js][vue] for the frontend.

  > Vue is a JavaScript framework for building client-side applications.
* [Redis][redis] for the database.

  > Redis is an in-memory [NoSQL][nosql] database, cache and message broker.

You do not need to know any of these technologies,
as your goal is only to install and run the application, not modify it.



## Getting started

You should start by **forking** the [repository][repo] with the `Fork` button,
and use your own copy of the repository instead of the provided one.  This will
make it easier for you to test the automated deployment at the end.

Then perform the required setup as described in the [project's
`README`][readme].  Where necessary, you will need to find installation
instructions for Ubuntu (version 18.04 Bionic).

Before attempting to set up the systemd service, nginx configuration and
automated deployment, you might want to simply run the application manually in
development mode to make sure it works.

You can do that with the following command on your server:

```bash
$> cd /path/to/application
$> PORT=3001 npm start
```

> We suggest you set the `PORT` environment variable to `3001` for this simple
> test, as that is one of the ports that should be open in your AWS virtual
> machine's firewall.

Visit http://1.2.3.4:3001 to check that it works (replacing `1.2.3.4` by your
server's IP address).  Stop the application with `Ctrl-C` once you are done.

> Note that you did not need to configure database access credentials as with
> the PHP Todo List.
>
> It works out of the box for two reasons: Redis requires no user or password
> by default, and it's also a schema-less NoSQL database (databases and keys
> are created on-the-fly as they are accessed the first time).



## Create a systemd service

Create and enable a systemd service file like in the [systemd
exercise][systemd-ex], with the following changes:

* Name the file `big-browser.service` instead of `todolist.service`.
* Update the `Description` parameter.
* Update the `ExecStart` parameter with the correct command to start the
  application (the production command indicated the the [project's
  `README`][readme]).

  * *Hint:* `ExecStart` only accepts absolute command paths.
    Use `which <command>` to find the absolute path of `<command>`.
* Update the `WorkingDirectory` parameter with the correct directory.
* Update the `Environment` parameter to set the `BIG_BROWSER_PORT` variable
  instead of the `TODOLIST_DB_PASS` variable.
  * *Hint:* you can use 3001 for tests (publicly accessible), but use 4000 (or
    any other port that is not exposed) to complete the exercise.
* Update the `After` parameter.
  * *Hint:* use `systemctl list-unit-files|grep redis` to find the correct
    service.

> Once you have enabled the service, it should start automatically the next
> time you restart the server with `sudo reboot`.



## Serve the application through nginx

[Install nginx][nginx-install] and create an nginx configuration to serve the
application like in the [nginx PHP-FPM exercise][nginx-php-fpm-ex], with the
following changes:

* Skip all steps related to PHP FPM, since they are only relevant for a PHP
  application.
* Name the nginx configuration file `big-browser` instead of `todolist`.
* Update the `server_name` directive to `john-doe.remediations.archidep.media`
  (replacing `john-doe` by your username).
* Update the `root` directive to the correct directory.
* Replace the `include` and `fastcgi_pass` directives by a `proxy_pass`
  directive.  You can look at the example provided [presented during the
  course][nginx-rp-conf].  Use the port number you configured at the previous
  step.

> If you used port 3000 or 3001 until now, remember that the application must
> only be accessible through nginx. You should change the port to a non-public
> port like 4000, and update and [reload the systemd unit file][systemd-reload]
> and nginx configuration file.



## Bonus: set up an automated deployment with Git hooks

Make it so that the application can be automatically deployed via a Git hook
like in the [Git automated deployment exercise][auto-deploy-ex], with the
following changes:

* Update the directory names (use `big-browser` instead of `todolist`).
* Update your `big-browser.service` systemd file to point to the new
  `big-browser-automated` directory.
  * Run `sudo systemctl daemon-reload` and `sudo systemctl restart big-browser`
    to restart the service.
* Update the `post-receive` hook.  Compared to the PHP todolist, there are
  three additional steps which must be performed in the script for the
  application to run correctly:

  1. Dependencies must be installed with `npm ci`.
  2. The application must be built with `npm run build`.
  3. The systemd service must be restarted with `sudo systemctl restart
     big-browser` (Node.js code is not reinterpreted on-the-fly as with PHP;
     the process must be restarted so that the code is reloaded into memory).

> Note: in the Git automated deployment exercice, it is mentionned that the
> application will no longer work after changing the path to the repository in
> the nginx configuration. In the case of the Big Browser application, it will
> continue to work, because the application serves its static files on its own,
> without nginx's help. Therefore, changing the path has no effect as long as
> the `proxy_pass` directive still points to the correct port.

### Allow your user to restart the service without a password

In order for the new `post-receive` hook to work, your user must be able to run
`sudo systemctl restart big-browser` without entering a password, as that will
not work well in a Git hook.

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

> That line allows any user in the `big-browser` group to execute the listed
> commands with `sudo` without having to enter a password (hence the `NOPASSWD`
> option).

### Test the automated deployment

Clone your fork of the repository to your local machine, make sure you have
added a remote to your server, then commit and push a change to test the
automated deployment.

For example, you may change the title in the navbar, which is in [in the
`public/index.html`
file](https://github.com/mediacomem/big-browser/blob/8c38c2b3a2438374d7747169a52cf30669dab6c1/public/index.html#L14).



[app]: https://big-browser.herokuapp.com
[auto-deploy-ex]: https://github.com/MediaComem/comem-archidep/blob/master/ex/git-automated-deployment.md
[nest]: https://nestjs.com
[nginx-install]: https://mediacomem.github.io/comem-webdev-docs/2018-2019/subjects/reverse-proxy/?home=MediaComem%2Fcomem-archidep%23readme#18
[nginx-php-fpm-ex]: https://github.com/MediaComem/comem-archidep/blob/master/ex/nginx-php-fpm-deployment.md
[nginx-rp-conf]: https://mediacomem.github.io/comem-webdev-docs/2018-2019/subjects/reverse-proxy/?home=MediaComem%2Fcomem-archidep%23readme#29
[node]: https://nodejs.org
[nosql]: https://en.wikipedia.org/wiki/NoSQL
[readme]: https://github.com/mediacomem/big-browser#readme
[redis]: https://redis.io
[repo]: https://github.com/mediacomem/big-browser
[systemd-ex]: https://github.com/MediaComem/comem-archidep/blob/master/ex/systemd-deployment.md
[systemd-reload]: https://mediacomem.github.io/comem-webdev-docs/2018-2019/subjects/linux-process-management/?home=MediaComem%2Fcomem-archidep%23readme#10
[ts]: https://www.typescriptlang.org
[vue]: https://vuejs.org
