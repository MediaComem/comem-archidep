# Deploy Minesweeper, a Phoenix (Elixir) & Alpine.js application with a PostgreSQL database

The goal of this exercice is to put in practice the knowledge acquired during
previous exercices to deploy a new application from scratch on your server.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [The goal](#the-goal)
- [Legend](#legend)
- [The application](#the-application)
  - [:books: What the hell are Elixir, Erlang/OTP and PostgreSQL?](#books-what-the-hell-are-elixir-erlangotp-and-postgresql)
- [:warning: Before starting the exercise](#warning-before-starting-the-exercise)
- [:warning: A note about the project's documentation](#warning-a-note-about-the-projects-documentation)
- [:exclamation: Getting started](#exclamation-getting-started)
  - [:exclamation: Fork the repository](#exclamation-fork-the-repository)
  - [:exclamation: Install the requirements](#exclamation-install-the-requirements)
    - [:question: Check that everything has been correctly installed](#question-check-that-everything-has-been-correctly-installed)
  - [:exclamation: Perform the initial setup](#exclamation-perform-the-initial-setup)
  - [:books: What sorcery is this?](#books-what-sorcery-is-this)
  - [:question: Optional: run the automated tests](#question-optional-run-the-automated-tests)
  - [:question: Optional: run the application in development mode](#question-optional-run-the-application-in-development-mode)
  - [:exclamation: Run the application in production mode](#exclamation-run-the-application-in-production-mode)
- [:exclamation: Create a systemd service](#exclamation-create-a-systemd-service)
- [:exclamation: Serve the application through nginx](#exclamation-serve-the-application-through-nginx)
- [:exclamation: Provision a TLS certificate](#exclamation-provision-a-tls-certificate)
- [:exclamation: Set up an automated deployment with Git hooks](#exclamation-set-up-an-automated-deployment-with-git-hooks)
  - [:gem: Allowing your user to restart the service without a password](#gem-allowing-your-user-to-restart-the-service-without-a-password)
  - [:space_invader: Allowing the dedicated `minesweeper` Unix user to control the Systemd service](#space_invader-allowing-the-dedicated-minesweeper-unix-user-to-control-the-systemd-service)
  - [:exclamation: Test the automated deployment](#exclamation-test-the-automated-deployment)
- [:boom: Troubleshooting](#boom-troubleshooting)
  - [:boom: `Could not find a Mix.Project`](#boom-could-not-find-a-mixproject)
  - [:boom: `Note no mix.exs was found in the current directory`](#boom-note-no-mixexs-was-found-in-the-current-directory)
  - [:boom: `password authentication failed for user "minesweeper"`](#boom-password-authentication-failed-for-user-minesweeper)
  - [:boom: `:eaddrinuse (address already in use)`](#boom-eaddrinuse-address-already-in-use)
  - [:boom: `remote: sudo: no tty present and no askpass program specified`](#boom-remote-sudo-no-tty-present-and-no-askpass-program-specified)
  - [:boom: `code=exited, status=200/CHDIR`](#boom-codeexited-status200chdir)
  - [:boom: `502 Bad Gateway`](#boom-502-bad-gateway)
  - [:boom: I forgot to fork the Minesweeper repository and I have already cloned it](#boom-i-forgot-to-fork-the-minesweeper-repository-and-i-have-already-cloned-it)
  - [:boom: I don't remember the password I used for the `minesweeper` PostgreSQL user](#boom-i-dont-remember-the-password-i-used-for-the-minesweeper-postgresql-user)
  - [:boom: System debugging](#boom-system-debugging)
  - [:boom: PostgreSQL debugging](#boom-postgresql-debugging)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## The goal

You must deploy the provided application in a similar way as the PHP todolist in
previous exercises:

* Install the language(s) and database necessary to run the application (which
  are different than for the PHP todolist).
* Run the application as a systemd service.
* Serve the application through nginx acting as a reverse proxy.
* Provision a TLS certificate for the application and configure nginx to use it.
* Set up an automated deployment via Git hooks for this application.

Additionally:

* The application **MUST** run in production mode (see its documentation).
* The application **MUST** restart automatically if your server is rebooted
  (i.e. your systemd service must be enabled).
* The application **MUST** be accessible **only through nginx**. It **MUST NOT**
  be exposed directly on a publicly accessible port. In the cloud servers used
  in this course, ports 3000 and 3001 should be open for testing. **DO NOT** use
  these ports in the final setup.
* Clients accessing the application over HTTP **MUST** be redirected to HTTPS.

As an optional bonus challenge:

* Create a dedicated Unix user (e.g. `minesweeper`) other than your personal
  user (e.g. `john_doe`) to run the application.
* This user should be a system user, not a login user. It should not
  be able to log in with a password, although you can set up SSH public key
  authentication for the automated deployment.
* Clone the project's repository with the dedicated user instead of your
  personal user.
* Configure systemd to run the application as the dedicated user instead of your
  personal user.
* Set up the automated deployment with the dedicated user instead of your
  personal user.
* Use the application's local configuration file instead of environment
  variables (see its documentation), and set up file/directory permissions so
  that only the dedicated user has access to the configuration file (the `root`
  user will of course have access as well).



## Legend

Parts of this guide are annotated with the following icons:

* :exclamation: A task you **MUST** perform to complete the exercise.
* :question: An optional step that you *may* perform to make sure that
  everything is working correctly. But you can skip it because it is not
  necessary.
* :warning: **Critically important information about the exercise.**
* :gem: Tips on the exercise, reminders about previous exercises, or
  explanations about how this exercise differs from the previous one.
* :books: Additional information that you can read if you want to know more
  about the commands and tools used during this exercise.
* :space_invader: More advanced tips on how to save some time, or tips about the
  bonus challenge.
* :boom: Troubleshooting tips: how to fix common problems you might encounter.



## The application

The application you must deploy is a [Minesweeper][minesweeper] web game. Its
code is [available on GitHub][repo].

### :books: What the hell are Elixir, Erlang/OTP and PostgreSQL?

The application uses the following ~~buzzword salad~~ technologies:

* The backend has been developed with [Phoenix][phoenix], an Elixir web
  framework that improves the tried and true [Model-View-Controller (MVC)][mvc]
  architecture with a fresh set of functional ideas.
  * [Elixir][elixir] is a dynamic, functional language for building scalable and
    maintainable applications. Elixir leverages the Erlang VM, known for running
    low-latency, distributed, and fault-tolerant systems (for example, Discord
    uses Elixir.)
  * [Erlang/OTP][erlang] is a programming language and a set of libraries used
    to build massively scalable soft real-time systems with requirements on high
    availability. Erlang's runtime system has built-in support for concurrency,
    distribution and fault tolerance. Some of its uses are in telecoms (90% of
    all internet traffic goes through routers and switches that use Erlang),
    banking, e-commerce, computer telephony and instant messaging (for example,
    WhatApp uses Erlang).
* The frontend has been developed with [Alpine.js][alpinejs], a lightweight
  [JavaScript][js] framework for composing behavior directly in your markup.
  * You will also use [Node.js][node], a server-side JavaScript runtime, to
    download JavaScript libraries and tools.
* [PostgreSQL][postgres] is a powerful, open source object-relational database
  system with over 30 years of active development that has earned it a strong
  reputation for reliability, feature robustness, and performance.

You do not need to know the specifics of these technologies. Your goal is only
to deploy the application as indicated by the instructions. You will not need to
modify it except for a very small change at the end to test your automated
deployment.



## :warning: Before starting the exercise

**Your Azure server has limited memory (about 1GB of RAM).** Unfortunately, this
may not be enough memory to run the MySQL database server, the PostgreSQL
database server, PHP-FPM, the PHP todolist and the Minesweeper application,
mainly because MySQL unfortunately consumes a lot of memory for such a small
server.

To be safe, you should temporarily stop and disable MySQL with the following
commands:

```bash
$> sudo systemctl stop mysql
$> sudo systemctl disable mysql
```

Note that this will temporarily break the PHP todolist.

You can also stop, disable and remove the following programs which are not
required for this course, saving some more memory:

```bash
$> sudo systemctl stop gdm
$> sudo systemctl disable gdm
$> sudo apt remove snapd --purge
```

To avoid warnings later, you should also install the following packages which
are required to install the application and some of its dependencies:

```bash
$> sudo apt install inotify-tools gnupg
```



## :warning: A note about the project's documentation

The [project's README][readme] explains how to set up and run the application.
That README is generic: it is not written specifically for this exercise.

The instructions on **this page** explain the exercise step-by-step.

The instructions in the project's README will be useful to you at various
points, but be careful not to blindly copy-paste and execute commands from it
without understanding what you are doing in the context of the exercise.



## :exclamation: Getting started

### :exclamation: Fork the repository

You must [fork][fork] the [application's repository][repo] to your own GitHub
account, because this exercise requires that you make changes to the application
later, after setting up the automated deployment with Git hooks.

:warning: Use your own repository's HTTPS clone URL instead of the one indicated
in the project's README. This way you will have push access to your repository.

### :exclamation: Install the requirements

You may want to start by making sure you have installed all the requirements
described in the [project's README][readme] on your server:

* **How to install Elixir and Erlang/OTP:** the [Elixir website][elixir] gives
  you very straightforward installation instructions to install both Elixir and
  Erlang/OTP. You should look for installation
  instructions specific to Ubuntu, the Linux distribution used on your server.
* **How to install Node.js:** there are several methods to install Node.js. One
  of the simplest is to use the [binary distributions provided by
  NodeSource][node-install]. You should look for installation instructions
  specific to Ubuntu, the Linux distribution used on your server. If possible,
  you should find instructions for the apt package manager (using the `apt` or
  `apt-get` command).
* **How to install PostgreSQL:** you can follow the official instructions on the
  Downloads page of the [PostgreSQL website][postgres]. You should look for
  installation instructions specific to Ubuntu, the Linux distribution used on
  your server.

#### :question: Check that everything has been correctly installed

* You can check that **Elixir has been correctly installed** by displaying the
  version of the `elixir` command:

  ```bash
  $> elixir --version
  Erlang/OTP 24 [erts-12.1.5] [source] [64-bit] [smp:1:1] [ds:1:1:10] [async-threads:1] [jit]

  Elixir 1.13.0 (compiled with Erlang/OTP 24)
  ```

  > It's not a problem if you don't have these exact versions installed, as long
  > as you have Erlang/OTP 24.x and Elixir 1.12.x or 1.13.x.

  You can also check that Elixir is working correctly by running the following
  command:

  ```bash
  $> elixir --eval "IO.puts(1 + 2)"
  3
  ```
* You can check that **Node.js has been correctly installed** by displaying the
  version of the `node` command:

  ```bash
  $> node --version
  v16.13.1
  ```

  > It's not a problem if you don't have this exact version installed, as long
  > as you have version 16.x.

  You can also check that Node.js is working correctly by running the following
  command:

  ```bash
  $> node -e 'console.log(1 + 2)'
  3
  ```
* You can check that **PostgreSQL has been correctly installed** by displaying
  the version of the `psql` command:

  ```bash
  $> psql --version
  psql (PostgreSQL) 12.9 (Ubuntu 12.9-0ubuntu0.20.04.1)
  ```

  You can verify that PostgreSQL is running by showing the status of its Systemd
  service:

  ```bash
  $> sudo systemctl status postgresql
  ● postgresql.service - PostgreSQL RDBMS
      Loaded: loaded (/lib/systemd/system/postgresql.service; enabled; vendor preset: enabled)
      Active: active (exited) since Fri 2021-12-10 20:54:52 UTC; 3 days ago
    Main PID: 2724 (code=exited, status=0/SUCCESS)
        Tasks: 0 (limit: 1087)
      Memory: 0B
      CGroup: /system.slice/postgresql.service

  Dec 10 20:54:52 john-doe.archidep.tech systemd[1]: Starting PostgreSQL RDBMS...
  Dec 10 20:54:52 john-doe.archidep.tech systemd[1]: Finished PostgreSQL RDBMS.
  ```

  You can also verify that PostgreSQL is working by listing available databases,
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

  > Note that **PostgreSQL runs on port 5432 by default**, which you can verify
  > by checking the `port` setting in its configuration file:
  >
  > ```bash
  > $> cat /etc/postgresql/12/main/postgresql.conf | grep '^port'
  > port = 5432
  > ```

### :exclamation: Perform the initial setup

You must perform the **initial setup** instructions indicated in the [project's
README][readme].

> :gem: When installing the application's dependencies with the `mix deps.get`
> command, you can answer yes if Mix asks you to install Hex:
>
> ```bash
> $> mix deps.get
> Could not find Hex, which is needed to build dependency :phoenix
> Shall I install Hex? (if running non-interactively, use "mix local.hex --force") [Yn] y
> ```

### :books: What sorcery is this?

:books: The setup instructions use the `createuser` and `createdb` commands.
These commands are binaries that come with the PostgreSQL server and can be used
to manage PostgreSQL users and databases on the command line:

* The **`createuser --interactive --pwprompt minesweeper` command** creates a
  PostgreSQL user named "minesweeper" and asks you to define a password for that
  user. The application will use this PostgreSQL username and password to
  connect to the database.
* The **`createdb --owner minesweeper minesweeper` command** creates an empty
  PostgreSQL database named "minesweeper" and owned by the "minesweeper" user.
  This is the database that the application will use.
* You will also use the `psql` command, which is PostgreSQL's command line
  client, to create the [uuid-ossp extension][postgres-uuid-ossp]. The
  application uses this extension to generate random [UUIDs][uuid] that identify
  various entities managed by the application (games & moves).

:books: This setup is equivalent to [part of the `todolist.sql`
script](https://github.com/MediaComem/comem-archidep-php-todo-exercise/blob/5d46e9fcf974d3d74d5eec838c512798f02581e1/todolist.sql#L1-L8)
you executed when first deploying the PHP todolist.

If you prefer using SQL, you could instead connect to the database as the
`postgres` user (equivalent to MySQL's `root` user) with `sudo -u postgres psql`
and run equivalent [`CREATE
USER`](https://www.postgresql.org/docs/13/sql-createuser.html) and [`CREATE
DATABASE`](https://www.postgresql.org/docs/13/sql-createdatabase.html) queries,
as well as the [`CREATE
EXTENSION`](https://www.postgresql.org/docs/13/sql-createextension.html) query.

Note that on the command line, PostgreSQL uses [peer
authentication](https://www.postgresql.org/docs/13/auth-peer.html) based on the
Unix username by default. This is why the commands are prefixed with `sudo -u
postgres` to execute them as the `postgres` Unix user. This user was created
when you installed PostgreSQL and has administrative privileges on the entire
PostgreSQL cluster. You can verify the existence of this user with the command
`cat /etc/passwd | grep postgres`.

:books: The setup instructions use the **`mix` command**. [Mix][mix] is the
dependency manager and build tool of the [Elixir][elixir] ecosystem, much like
[Composer][composer] for [PHP][php] or [npm][npm] for [Node.js][node].

* The [**`mix deps.get` command**][mix-deps-get] is used to download all of the
  Minesweeper Elixir application's dependencies, i.e. the Elixir/Erlang
  libraries it requires to work, like the [Phoenix][phoenix] web framework.
  Phoenix is a web framework written in [Elixir][elixir] much like
  [Laravel][laravel] is a web framework written in [PHP][php].

  The dependencies and which versions to install are [listed in the
  application's `mix.exs` file][app-deps]. They are downloaded from [Hex][hex],
  the package registry for the Elixir and Erlang ecosystems, and saved into the
  `deps` directory.
* The [**`mix compile` command**][mix-compile] compiles the application's Elixir
  source files from the `lib` and `test` directories into the `_build`
  directory. This step is necessary because Elixir is a compiled language which
  must be compiled to [BEAM][beam] bytecode (the BEAM is the [Elixir &
  Erlang/OTP][erlang] runtime), much like [Java][java] must be compiled to [Java
  Virtual Machine][jvm] bytecode (the JVM is the Java runtime).
* The **`mix frontend.install` command** is an
  [alias](https://github.com/MediaComem/minesweeper/blob/ca3e6fb2956afc751274ce2589ff9490c90c5e00/mix.exs#L70)
  for the [`scripts/install-frontend.sh`
  script](https://github.com/MediaComem/minesweeper/blob/ca3e6fb2956afc751274ce2589ff9490c90c5e00/scripts/install-frontend.sh)
  which will download the JavaScript dependencies required by the application's
  [Alpine.js][alpinejs] frontend. The script uses [npm][npm], the
  [Node.js][node] & [JavaScript][js] package manager which is installed
  alongside Node.js.

  The dependencies and which versions to install are [listed in the
  application's `assets/package.json`
  file](https://github.com/MediaComem/minesweeper/blob/ca3e6fb2956afc751274ce2589ff9490c90c5e00/assets/package.json#L10-L26).
  They are downloaded from the [npm repository][npm] and saved into the
  `assets/node_modules` directory.
* The [`mix ecto.migrate` command][mix-ecto-migrate] command executes [the
  application's database
  migrations](https://github.com/MediaComem/minesweeper/blob/ca3e6fb2956afc751274ce2589ff9490c90c5e00/priv/repo/migrations/20210921151550_initial_schema.exs).
  These migrations are Elixir programs that will connect to the database and
  create the table(s) required by the application.

  This is equivalent to [the rest of the `todolist.sql`
  script](https://github.com/MediaComem/comem-archidep-php-todo-exercise/blob/5d46e9fcf974d3d74d5eec838c512798f02581e1/todolist.sql#L12-L18)
  you executed when first deploying the PHP todolist.

:books: The configuration you are instructed to perform either through the
`config/local.exs` file or through environment variables is equivalent to the
[configuration of the PHP
todolist](https://github.com/MediaComem/comem-archidep-php-todo-exercise/blob/5d46e9fcf974d3d74d5eec838c512798f02581e1/index.php#L3-L15)
which you improved during the course using environment variables, except that
the Minesweeper application has two configuration mechanisms: a local
configuration file and/or environment variables. You can use either or both. It
does not matter which you choose. Both are equally valid way of configuring the
Minesweeper application.

:books: Note that the PHP todolist used separate database connection settings
(`TODOLIST_DB_NAME`, `TODOLIST_DB_USER`, `TODOLIST_DB_PASS`, `TODOLIST_DB_HOST`,
`TODOLIST_DB_PORT`), while the Minesweeper application uses a database
connection URL specified with `MINESWEEPER_DATABASE_URL` or in the configuration
file). This URL contains the same settings in one value. This is possible
because the [syntax of an URL][url] is
`<scheme>://<user>:<password>@<host>:<port>/<path>`, therefore all database
connection parameters can be specified in one URL:
`ecto://myuser:mypassword@localhost:5432/mydatabasename`. ([Ecto][ecto] is the
[Object-Relational Mapper (ORM)][orm] used with the [Phoenix][phoenix]
framework, much like [Eloquent][eloquent] is the ORM used with the
[Laravel][laravel] framework.)

### :question: Optional: run the automated tests

The Minesweeper application includes an automated test suite. [Automated
tests][automated-tests] are programs that check that the application works by
simulating input and checking output. They are not a replacement for manual
testing by humans, but programs can test mundane, repetitive tasks much faster
and much more reliably than a human can.

The [project's README][readme] explains how to set up and run the automated
tests.

Running these tests is entirely optional, but it will make sure that everything
is working properly, including that:

* The application executes correctly with the Elixir and Erlang/OTP versions you
  have installed.
* The application can successfully connect to the database.
* The structure of the database is correct (if you have run the database
  migrations).
* The application behaves as specified.

> :books: If you are curious, the source code for these tests is in [the `test`
> directory](https://github.com/MediaComem/minesweeper/tree/main/test).
>
> :books: Note that running the automated tests requires compiling the
> application in test mode with `MIX_ENV=test mix compile`. You have already
> compiled the application in the initial setup, but the compilation of Elixir
> programs is done separately for each environment. This allows libraries to
> behave differently depending on the environment, for example to optimize for
> faster compilation and refresh time in development, or to optimize for low
> memory and faster execution in production, or to enable special features
> specifically for testing.

### :question: Optional: run the application in development mode

Before running the application in production mode and attempting to set up the
systemd service, nginx configuration and automated deployment, you can manually
run the application in development mode to make sure it works. The [project's
README][readme] explains how to do this.

You can set the `http.port` parameter in the local configuration file or the
`MINESWEEPER_HTTP_PORT` environment variable to `3001` for this simple test, as
that is one of the ports that should be open in your server's firewall. Run the
application on that port and visit http://W.X.Y.Z:3001 to check that it works
(replacing `W.X.Y.Z` by your server's IP address). Stop the application by
typing `Ctrl-C` **twice** once you are done.

> :books: For your information, running the application in development mode will
> use [Webpack], a static module bundler for JavaScript applications, to take
> the [Alpine.js][alpinejs] frontend source files and assets in the `assets`
> directory, and bundle them into the `priv/static` directory. You can see the
> generated files with `ls priv/static`.

### :exclamation: Run the application in production mode

Follow the instructions in the [project's README][readme] to run the application
in production mode.

> :books: You will once again recompile the application, this time in production
> mode.
>
> :books: To run an Elixir application in production, you must assemble a [Mix
> release][mix-release]. This is basically the compiled application along with
> the [Erlang/OTP][erlang] runtime, the [BEAM][beam], all packaged in a
> directory which can be deployed anywhere. Actually, once you have created the
> release, you could even copy it to a system where Elixir and Erlang are not
> installed and run it there, as long as it uses the same architecture and
> operating system as those it was compiled on.
>
> :books: The `MIX_ENV=prod mix do frontend.build, phx.digest` command used in
> the instructions bundles the frontend's files in production mode, compressing
> and digesting them. To "digest" a web asset is to include a hash of its
> contents in the filename [for the purposes of caching][webpack-caching]. This
> optimizes the delivery of web assets to browsers especially when they come
> back to your website after having already visited once.
>
> :books: You can list the `priv/static` directory to see the digested assets:
> `ls priv/static`. Observe that a file named
> `priv/static/favicon-a8ca4e3a2bb8fea46a9ee9e102e7d3eb.ico` (the hash may
> differ) has appeared. The hash part of the filename
> (`a8ca4e3a2bb8fea46a9ee9e102e7d3eb` in this case) depends on the content. When
> the content changes, the hash changes. This means you can instruct client
> browsers to cache web assets indefinitely, since you know that an asset's name
> will not change as long as its content does not change as well and,
> conversely, that an asset's name will always change if it has been modified.



## :exclamation: Create a systemd service

Create and enable a systemd unit file like in the [systemd
exercise][systemd-ex]. Make the necessary changes to run the Minesweeper
application instead of the PHP todolist.

> * :gem: You will find the correct command to run the application in [the
>   project's `README`][readme].
>
>   Remember that systemd requires absolute paths to commands. The script to run
>   is not in your PATH, so you cannot use `which` to determine where it is, but
>   it's easy to determine its absolute path by combining the path to the
>   repository and the relative path to the script.
> * :gem: You may need to set the `http.port` parameter in the local
>   configuration file or the `MINESWEEPER_HTTP_PORT` environment variable to
>   choose the port on which the application will listen. You can use the
>   publicly accessible 3001 port temporarily for testing, but you should use
>   another free port that is not exposed to complete the exercise, since one of
>   the requirements is to expose the application only through nginx.

Once you have enabled and started the service, it should start automatically the
next time you restart the server with `sudo reboot`.

> :space_invader: If you know what you are doing, you can already set up the
> automated deployment project structure at this point, so that you can point
> your systemd configuration to the correct directory. That way you will not
> have to modify it later.



## :exclamation: Serve the application through nginx

Create an nginx proxy configuration to serve the application like in the [nginx
PHP-FPM exercise][nginx-php-fpm-ex].

The `root` directive in your nginx configuration should point to the
`priv/static` directory in the repository since that is the directory that
contains the application's public web assets.

> * :gem: Use an absolute path for the `root` directive.
> * :gem: Do not follow steps related to PHP FPM, since they are only valid for
>   a PHP application.
> * :gem: The `include` and `fastcgi_pass` directives used in the PHP FPM
>   exercise make no sense for a non-PHP application. You should replace them
>   with a [`proxy_pass`
>   directive](http://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_pass).
>   as [presented during the course][nginx-rp-conf].
> * :space_invader: You can also point the nginx configuration directly to the
>   automated deployment structure. That way you will not have to modify it
>   later.



## :exclamation: Provision a TLS certificate

Obtain and configure a TLS certificate to serve the application over HTTPS like
in the [certbot exercise][certbot-ex].



## :exclamation: Set up an automated deployment with Git hooks

Change your deployment so that the application can be automatically updated via
a Git hook like in the [automated deployment exercise][auto-deploy-ex].

Once you have set up the new directories, make sure to update your systemd unit
file and nginx configuration file to point to the correct directories.

Because the new directory is a fresh deployment, you may have to repeat part of
the [initial setup][initial-setup] you performed in the original directory. Your
hook will handle most of the setup, but if you used the `config/local.exs`
configuration file, you must copy it to the new deployment directory as well.
You can use the `cp <source> <target>` command for this.

Complete the `post-receive` hook. Compared to the PHP todolist, there are
additional steps which must be performed in the script for the automated
deployment to work correctly:

  * Backend and frontend dependencies must be updated in case there are new or
    upgraded ones. The PHP todolist had no dependencies so you did not need to
    do this.
  * The database must be migrated to take any new migrations into account.
  * The Alpine.js frontend must be rebuilt in case changes were made to the
    frontend source files.
  * The Elixir application must be recompiled and the release must be
    reassembled in case changes were made to the backend source files.
  * The systemd service must be restarted with `systemctl`. (Unlike PHP, code
    in most other languages is not reinterpreted on-the-fly; the service must
    be restarted so that the program is reloaded into memory as a new process).

The [project's README][readme] explains how to do all of this except restarting
the Systemd service, which you can easily do with `sudo systemctl restart
<service>`. You should run the appropriate commands in your `post-receive` hook
script.

> :gem: In the automated deployment exercice, it is mentionned that the
> application will no longer work after changing the path to the repository in
> the nginx configuration. In the case of the Minesweeper application, it will
> continue to work, because the application serves its static files on its own,
> without nginx's help.
>
> :books: When using `fastcgi_pass`, nginx is asking the PHP FastCGI Process
> Manager (PHP-FPM) to find and execute the PHP files in the `root` directory
> specified by the configuration. When you change that `root` to a directory
> that is empty (at that stage in the exercise), it will not find the PHP files
> anymore, and return a 404 Not Found error.
>
> :books: When using `proxy_pass`, nginx is simply forwarding the request to the
> given address and port. The Minesweeper application listens on that port and
> is capable of serving its own files, regardless of nginx's configuration. So
> the application will keep working even after changing the `root`.

### :gem: Allowing your user to restart the service without a password

In order for the new `post-receive` hook to work, your user must be able to run
`sudo systemctl restart minesweeper` (assuming you have named your service
`minesweeper`) without entering a password, otherwise it will not work in a Git
hook. This is because a Git hook is not an interactive program. You are not
running it yourself, so you are not available to enter your password where
prompted.

If you are using the administrator user account that came with your Azure VM to
run the application, it already has the right to use `sudo` without a password.

> :books: This has been automatically configured for you in the
> `/etc/sudoers.d/90-cloud-init-users` file.

### :space_invader: Allowing the dedicated `minesweeper` Unix user to control the Systemd service

If you are trying to complete the bonus challenge, you will need to allow the
`minesweeper` user run the necessary `sudo systemctl ...` commands without a
password as well.

Make sure your default editor is `nano` (or whichever you are more comfortable
with):

```bash
$> sudo update-alternatives --config editor
```

When you created the `minesweeper` Unix user, your server created a
corresponding Unix group with the same name by default. Now you will add a file
in the `/etc/sudoers.d` directory to allow users in the `minesweeper` Unix group
to run some specific commands without a password.

```bash
$> sudo visudo -f /etc/sudoers.d/minesweeper
```

> :books: The [`visudo` command][visudo] allows you to edit the sudoers file in
> a safe fashion. It will refuse to save a sudoers file with a syntax error
> (which could potentially corrupt your system or lock you out of your
> administrative privileges).

Add the following line to the file:

```
%minesweeper ALL=(ALL:ALL) NOPASSWD: /bin/systemctl restart minesweeper, /bin/systemctl status minesweeper, /bin/systemctl start minesweeper, /bin/systemctl stop minesweeper
```

> :books: This line allows any user in the `minesweeper` group to execute the
> listed commands with `sudo` without having to enter a password (hence the
> `NOPASSWD` option).

Exit with `Ctrl-X` if you are using Nano or with Esc then `:wq` if you are using
Vim.

> :gem: If you are using nano, the filename you are asked to confirm will be
> `/etc/sudoers.d/minesweeper.tmp` instead of `/etc/sudoers.d/minesweeper`. This
> is normal, because `visudo` uses a temporary file to validate your changes
> before saving the actual file. You may confirm without changes.

You can test that it works by first switching to the `minesweeper` user with
`sudo su - minesweeper` and then running `sudo systemctl status minesweeper`. It
should run the command without asking you for any password (only for the
specific commands listed in the file your created).

### :exclamation: Test the automated deployment

Clone your fork of the repository to your local machine, make sure you have
added a remote pointing to your server, then commit and push a change to test
the automated deployment.

Here's some visible changes you could easily make:

* Change the [navbar title in the
  `lib/minesweeper_web/templates/layout/app.html.eex`
  file](https://github.com/MediaComem/minesweeper/blob/ca3e6fb2956afc751274ce2589ff9490c90c5e00/lib/minesweeper_web/templates/layout/app.html.eex#L13).
* Change the [difficulty levels in the
  `lib/minesweeper_web/templates/home/index.html.eex`
  file](https://github.com/MediaComem/minesweeper/blob/ca3e6fb2956afc751274ce2589ff9490c90c5e00/lib/minesweeper_web/templates/home/index.html.eex#L5-L8).



## :boom: Troubleshooting

Here's a few tips about some problems you may encounter during this exercise.
Note that some of these errors can happen in various situations:

* When running a command manually from your terminal.
* When systemd tries to start your service.
* When your `post-receive` Git hook executes.

### :boom: `Could not find a Mix.Project`

If you see an error message similar to this:

```bash
$> mix somecommand
** (Mix) Could not find a Mix.Project, please ensure you are running Mix in a directory with a mix.exs file
```

You are probably executing a `mix` command (such as `mix deps.get` or `mix
compile`) in the wrong directory. `mix`commands must generally be executed in a
directory that contains a project's `mix.exs` file. This file describes project
information required by the various `mix` commands, such as the list of
dependencies to install or appropriate commands to run.

In this exercise, you want to run `mix` commands in the directory where the
Minesweeper application's files are located, i.e. the directory that you
creating when cloning the repository.

### :boom: `Note no mix.exs was found in the current directory`

If you see an error message similar to this:

```bash
$> mix frontend.install
** (Mix) The task "frontend.install" could not be found
Note no mix.exs was found in the current directory
```

The problem is the same as the previous one. You are executing a `mix` command
in the wrong directory.

### :boom: `password authentication failed for user "minesweeper"`

If you see an error similar to this when migrating the database or starting the
application:

```
[error] Postgrex.Protocol (#PID<0.351.0>) failed to connect: ** (Postgrex.Error) FATAL 28P01 (invalid_password) password authentication failed for user "minesweeper"
```

It means that the Minesweeper application or its database migration scripts
cannot connect to the database:

* Are you sure that you followed all the setup instructions and performed all
  necessary configuration?
* Did you properly create the `minesweeper` PostgreSQL user and database?
* Did you properly configure the database connection URL in the Minesweeper's
  `config/local.exs` file or with the `$MINESWEEPER_DATABASE_URL` environment
  variable?

  Are you using the correct password?

> Just like the PHP todolist required the correct configuration to successfully
> connect to its MySQL database, the Minesweeper application also requires the
> correct configuration to connect to its PostgreSQL database.

### :boom: `:eaddrinuse (address already in use)`

If you see an error similar to this when running the application:

```
[error] Failed to start Ranch listener MinesweeperWeb.Endpoint.HTTP in :ranch_tcp:listen([cacerts: :..., key: :..., cert: :..., port: 3000]) for reason :eaddrinuse (address already in use)

[notice] Application minesweeper exited: Minesweeper.Application.start(:normal, []) returned an error: shutdown: failed to start child: MinesweeperWeb.Endpoint
    ** (EXIT) shutdown: failed to start child: {:ranch_listener_sup, MinesweeperWeb.Endpoint.HTTP}
        ** (EXIT) shutdown: failed to start child: :ranch_acceptors_sup
            ** (EXIT) {:listen_error, MinesweeperWeb.Endpoint.HTTP, :eaddrinuse}
[notice] Application phoenix_live_reload exited: :stopped
[notice] Application file_system exited: :stopped
[notice] Application plug_cowboy exited: :stopped
[notice] Application cowboy_telemetry exited: :stopped
[notice] Application cowboy exited: :stopped
[notice] Application ranch exited: :stopped
[notice] Application cowlib exited: :stopped
[notice] Application jason exited: :stopped
[notice] Application phoenix_html exited: :stopped
[notice] Application postgrex exited: :stopped
[notice] Application ecto_sql exited: :stopped
[notice] Application db_connection exited: :stopped
[notice] Application connection exited: :stopped
[notice] Application phoenix_ecto exited: :stopped
[notice] Application ecto exited: :stopped
[notice] Application decimal exited: :stopped
[notice] Application runtime_tools exited: :stopped
** (Mix) Could not start application minesweeper: Minesweeper.Application.start(:normal, []) returned an error: shutdown: failed to start child: MinesweeperWeb.Endpoint
    ** (EXIT) shutdown: failed to start child: {:ranch_listener_sup, MinesweeperWeb.Endpoint.HTTP}
        ** (EXIT) shutdown: failed to start child: :ranch_acceptors_sup
            ** (EXIT) {:listen_error, MinesweeperWeb.Endpoint.HTTP, :eaddrinuse}
```

It means that there is already an application or other process listening on the
port Minesweeper is trying to listen on (port `3000` by default). You should use
the `http.port` parameter in the local configuration file or the
`$MINESWEEPER_HTTP_PORT` environment variable to change the port, for example if
you are trying to run the application in development mode:

```bash
$> MINESWEEPER_HTTP_PORT=4321 mix phx.server
```

### :boom: `remote: sudo: no tty present and no askpass program specified`

If you see an error message similar to this when your Git hook is triggered:

```
remote: sudo: no tty present and no askpass program specified
```

It means that you have created a dedicated Unix user but you have not performed
the following step correctly: [Allow the dedicated `minesweeper` Unix user to
control the Systemd
service](#allow-the-dedicated-minesweeper-unix-user-to-control-the-systemd-service).

Make sure that the list of authorized `systemctl` commands in the sudoers file
match the name of your service (if you named your systemd configuration file
something other than `minesweeper.service`, you must adapt the commands in the
`/etc/sudoers.d/minesweeper` file to use the correct service name).

> This error occurs because ordinarily, your own Unix user does not have the
> right to execute `sudo systemctl restart minesweeper` without you entering
> your password to gain administrative rights. A Git hook is executed in a
> non-interactive context: it can only print information, and you cannot
> interact with it (e.g. give it input) while it is running. This means that it
> cannot ask for your password, so any `sudo` command will fail by default.
>
> This is what the error message indicates: `no tty present` means that there is
> no interactive terminal (`tty` comes from the terminology of the 1970s: it
> means a **t**ele**ty**pewriter, which was one of the first terminals).
>
> The instructions mentioned above grant your user the right to execute specific
> `sudo` commands (like `sudo systemctl restart minesweeper`) without having to
> enter your password. Once that is done, these commands will work from the Git
> hook as well.

### :boom: `code=exited, status=200/CHDIR`

If you see an error message similar to this in your systemd service's status:

```
code=exited, status=200/CHDIR
```

It means that systemd failed to move into the directory you specified (`CHDIR`
means **ch**ange **dir**ectory). Check your Systemd unit file to make sure that
the working directory you have configured is the correct one and really exists.

### :boom: `502 Bad Gateway`

If you see this error in your browser when trying to access an nginx site you
have configured, it means that nginx cannot reach the proxy address you have
defined. Check your nginx configuration to make sure that you are using the
correct address and port. Are you sure your application is actually listening on
that port?

### :boom: I forgot to fork the Minesweeper repository and I have already cloned it

You may have cloned the exercise's repository directly:

```bash
$> git remote -v
origin  https://github.com/MediaComem/minesweeper.git (fetch)
origin  https://github.com/MediaComem/minesweeper.git (push)
```

Then you won't have push access because this repository does not belong to you.
[Fork][fork] the repository, then change your clone's remote URL by running this
command in your clone's directory on the server (replacing `MyGitHubUser` with
your GitHub username):

```bash
$> git remote set-url origin https://github.com/MyGitHubUser/minesweeper.git
```

### :boom: I don't remember the password I used for the `minesweeper` PostgreSQL user

You can change it with the following command:

```bash
$> sudo -u postgres psql -c '\password minesweeper'
```

### :boom: System debugging

You can display the logs of your `minesweeper` Systemd service with the
following command:

```bash
$> sudo journalctl -u minesweeper
```

If the application does not seem to work after running the Systemd service,
there might be an error message in these logs that can help you identify the
issue.

### :boom: PostgreSQL debugging

You can list available databases with the following command:

```bash
$> sudo -u postgres psql -l
```

You can connect to a database with the following command:

```bash
$> sudo -u postgresql psql <database-name>
minesweeper=#
```

Note that the prompt has changed, because you are now connected to the
interactive PostgreSQL console. You can obtain help by typing the `\?` command
(`q` to exit the help page), or type SQL queries. For example, here's how to
list the tables in the current database and count the number of rows in the
`games` table:

```
minesweeper=# \d
                List of relations
 Schema |       Name        | Type  |    Owner
--------+-------------------+-------+-------------
 public | games             | table | minesweeper
 public | moves             | table | minesweeper
 public | schema_migrations | table | minesweeper
(3 rows)

minesweeper=# select count(*) from games;
 count
-------
     2
(1 row)
```

Run the `exit` command when you are done to exit the PostgreSQL console.



[alpinejs]: https://alpinejs.dev
[app-config]: https://github.com/MediaComem/minesweeper#configuration
[app-deps]: https://github.com/MediaComem/minesweeper/blob/ca3e6fb2956afc751274ce2589ff9490c90c5e00/mix.exs#L40-L57
[auto-deploy-ex]: https://github.com/MediaComem/comem-archidep/blob/master/ex/git-automated-deployment.md
[automated-deployment-nginx-update]: https://github.com/MediaComem/comem-archidep/blob/master/ex/git-automated-deployment.md#update-the-todolist-nginx-configuration
[automated-tests]: https://en.wikipedia.org/wiki/Test_automation
[beam]: https://en.wikipedia.org/wiki/BEAM_(Erlang_virtual_machine)
[certbot-ex]: certbot-deployment.md
[composer]: https://getcomposer.org
[ecto]: https://hexdocs.pm/ecto/Ecto.html
[elixir]: https://elixir-lang.org
[eloquent]: https://laravel.com/docs/8.x/eloquent
[erlang]: https://www.erlang.org
[fork]: https://docs.github.com/en/get-started/quickstart/fork-a-repo
[hex]: https://hex.pm
[initial-setup]: https://github.com/MediaComem/minesweeper#initial-setup
[java]: https://www.oracle.com/java/
[js]: https://en.wikipedia.org/wiki/JavaScript
[jvm]: https://en.wikipedia.org/wiki/Java_virtual_machine
[laravel]: https://laravel.com
[make]: https://www.gnu.org/software/make/
[minesweeper]: https://en.wikipedia.org/wiki/Minesweeper_(video_game)
[mix]: https://hexdocs.pm/mix/Mix.html
[mix-compile]: https://hexdocs.pm/mix/1.12/Mix.Tasks.Compile.html
[mix-deps-get]: https://hexdocs.pm/mix/1.12/Mix.Tasks.Deps.Get.html
[mix-ecto-migrate]: https://hexdocs.pm/ecto_sql/Mix.Tasks.Ecto.Migrate.html
[mix-phx-digest]: https://hexdocs.pm/phoenix/Mix.Tasks.Phx.Digest.html
[mix-release]: https://hexdocs.pm/mix/1.12/Mix.Tasks.Release.html
[mvc]: https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller
[nginx-php-fpm-ex]: nginx-php-fpm-deployment.md
[nginx-proxy-pass]: http://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_pass
[nginx-rp-conf]: https://mediacomem.github.io/comem-archidep/2020-2021/subjects/reverse-proxy/?home=MediaComem%2Fcomem-archidep%23readme#29
[node]: https://nodejs.org
[node-install]: https://github.com/nodesource/distributions/blob/master/README.md
[node-lts]: https://nodejs.org/en/about/releases/
[npm]: https://www.npmjs.com
[orm]: https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping
[phoenix]: https://www.phoenixframework.org
[php]: https://www.php.net
[postgres]: https://www.postgresql.org
[postgres-uuid-ossp]: https://www.postgresql.org/docs/current/uuid-ossp.html
[readme]: https://github.com/MediaComem/minesweeper#readme
[repo]: https://github.com/MediaComem/minesweeper
[systemd-ex]: systemd-deployment.md
[url]: https://en.wikipedia.org/wiki/URL#Syntax
[uuid]: https://en.wikipedia.org/wiki/Universally_unique_identifier
[visudo]: https://linux.die.net/man/8/visudo
[webpack]: https://webpack.js.org
[webpack-caching]: https://webpack.js.org/guides/caching/
