# Deploy web applications with a database to Heroku

The goal of this exercice is to deploy various applications with a database
component in the Heroku Platform-as-a-Service (PaaS) cloud instead of your own
server in the Infrastructure-as-a-Service (IaaS) Amazon Web Services cloud. This
illustrates the difference between the two cloud service models.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Requirements](#requirements)
- [Deploy the PHP Todolist application](#deploy-the-php-todolist-application)
  - [Optional: create a Heroku application (if you have a credit card)](#optional-create-a-heroku-application-if-you-have-a-credit-card)
  - [Add the free ClearDB MySQL add-on to your application](#add-the-free-cleardb-mysql-add-on-to-your-application)
  - [Update the PHP Todolist to use the `$CLEARDB_DATABASE_URL` environment variable](#update-the-php-todolist-to-use-the-cleardb_database_url-environment-variable)
  - [Deploy the application to Heroku](#deploy-the-application-to-heroku)
  - [Create the `todolist` table in the database](#create-the-todolist-table-in-the-database)
- [Deploy the Minesweeper application](#deploy-the-minesweeper-application)
  - [Create a Heroku application (if you have a credit card)](#create-a-heroku-application-if-you-have-a-credit-card)
  - [Add the free Heroku Postgres add-on to your application](#add-the-free-heroku-postgres-add-on-to-your-application)
  - [Add the required configuration to your application](#add-the-required-configuration-to-your-application)
  - [Update your Minesweeper application to the latest version](#update-your-minesweeper-application-to-the-latest-version)
  - [Deploy the application to Heroku](#deploy-the-application-to-heroku-1)
- [Deploy applications from previous years](#deploy-applications-from-previous-years)
  - [Deploy the RPS application](#deploy-the-rps-application)
    - [Optional: create a Heroku application (if you have a credit card)](#optional-create-a-heroku-application-if-you-have-a-credit-card-1)
    - [Add the free Heroku Postgres add-on to your application](#add-the-free-heroku-postgres-add-on-to-your-application-1)
    - [Update your RPS application to the latest version](#update-your-rps-application-to-the-latest-version)
    - [Deploy the application to Heroku](#deploy-the-application-to-heroku-2)
    - [Set up the database](#set-up-the-database)
  - [Deploy the WOPR application](#deploy-the-wopr-application)
    - [Optional: create a Heroku application (if you have a credit card)](#optional-create-a-heroku-application-if-you-have-a-credit-card-2)
    - [Add the free Heroku Redis add-on to your application](#add-the-free-heroku-redis-add-on-to-your-application)
    - [Deploy the application to Heroku](#deploy-the-application-to-heroku-3)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Requirements

To perform this exercise, you will need:

- A [Heroku][heroku] account.
- The [Heroku Command Line Interface (CLI)][heroku-cli] installed on your local
  machine.

  > macOS users should install [Homebrew][homebrew], a package manager for
  > macOS, in order to have the `brew` command mentioned in the Heroku CLI
  > installation instructions.

## Deploy the PHP Todolist application

This section explains how to deploy the PHP todolist used during the course on
Heroku.

The commands in this exercise must be executed **on your local machine** in the
Git repository where you have the PHP Todolist application. You do not need your
cloud server at all.

### Optional: create a Heroku application (if you have a credit card)

An existing Heroku application will be provided for you by the teacher.

However, if you have a credit card, do not hesitate to create the application
yourself in your Heroku account. We will only use free add-on, so no money will
be charged. (But Heroku requires the account to have a valid credit card to
use third-party database add-ons, even free ones.)

You can create an application from the main Heroku page once logged in:

![Create Heroku Application](../images/heroku-create-app.png)

### Add the free ClearDB MySQL add-on to your application

Add the **free** [ClearDB MySQL
add-on](https://devcenter.heroku.com/articles/cleardb) to your Heroku
application's resources:

![Add ClearDB Add-on](../images/heroku-add-cleardb.png)

**Be sure to select the free plan:**

![Choose ClearDB Plan](../images/heroku-choose-cleardb-plan.png)

> If you are using your own account and have not yet configured a credit card,
> Heroku will require you to do so at this stage (even with the free plan, but
> no money will be charged).

Go to your application's settings and reveal its configuration variables. These
are environment variables configured by Heroku for your application:

![Reveal Configuration Variables](../images/heroku-reveal-config-vars.png)

You should see a `CLEARDB_DATABASE_URL` variable there:

![Copy ClearDB URL](../images/heroku-copy-cleardb-url.png)

This URL was configured when you added the ClearDB MySQL add-on to your
application. This means that your application should use this variable to
configure its database connection.

### Update the PHP Todolist to use the `$CLEARDB_DATABASE_URL` environment variable

Unfortunately, the code of the PHP Todolist will not work out of the box on
Heroku. This is what the top of your `index.php` file should look like after
doing the previous exercises:

```php
define('BASE_URL', getenv('TODOLIST_BASE_URL') ?: '/');
define('DB_USER', getenv('TODOLIST_DB_USER') ?: 'todolist');
define('DB_PASS', getenv('TODOLIST_DB_PASS'));
define('DB_NAME', getenv('TODOLIST_DB_NAME') ?: 'todolist');
define('DB_HOST', getenv('TODOLIST_DB_HOST') ?: '127.0.0.1');
define('DB_PORT', getenv('TODOLIST_DB_PORT') ?: '3306');
```

This code expects to receive its database configuration in the form of various
separate variables like `$TODOLIST_DB_HOST` or `$TODOLIST_DB_PASS`. It will not
be able to use the `$CLEARDB_DATABASE_URL` variable on Heroku.

The documentation of the ClearDB MySQL add-on [shows how to use the variable from
PHP code](https://devcenter.heroku.com/articles/cleardb#using-cleardb-with-php).
Here are some changes you could make that would work:

```php
// Get a MySQL connection URL from the environment, or use one with default parameters.
// Support the $CLEARDB_DATABASE_URL variable from the ClearDB MySQL add-on on Heroku.
$dbDefaults = parse_url(getenv('CLEARDB_DATABASE_URL') ?: getenv('TODOLIST_DB_URL') ?: "mysql://todolist@127.0.0.1:3306/todolist");

// Get configuration from the environment or use default values from the connection URL.
define('BASE_URL', getenv('TODOLIST_BASE_URL') ?: '/');
define('DB_USER', getenv('TODOLIST_DB_USER') ?: $dbDefaults["user"]);
define('DB_PASS', getenv('TODOLIST_DB_PASS') ?: $dbDefaults["pass"]);
define('DB_NAME', getenv('TODOLIST_DB_NAME') ?: substr($dbDefaults["path"], 1));
define('DB_HOST', getenv('TODOLIST_DB_HOST') ?: $dbDefaults["host"]);
define('DB_PORT', getenv('TODOLIST_DB_PORT') ?: $dbDefaults["port"]);
```

Add and commit your changes with `git add index.php` and `git commit -m "Allow configuration with database URL"`.

### Deploy the application to Heroku

Move into the PHP Todolist repository **on your local machine**:

```bash
$> cd /path/to/projects/comem-archidep-php-todo-exercise
```

Add the `heroku` remote to your application:

```bash
$> heroku git:remote -a ad-john-doe-todo
```

Push your `main` (or `master`) branch to Heroku:

```bash
$> git push heroku main
```

The application's main page should be accessible at the URL indicated in the
deployment log. However, adding todo items will not work because the database
has not yet been initialized.

### Create the `todolist` table in the database

The database created by the ClearDB add-on is empty. You must create the
`todolist` table for the application to work. The following instructions
indicate how to do this with [MySQL
Workbench](https://www.mysql.com/products/workbench/), a free cross-platform SQL
client, but you can do it with any SQL client.

- Retrieve your database credentials from the `$CLEARDB_DATABASE_URL` environment
  variable. You can copy it from Heroku's web interface, or you can get it on the
  command line in your repository with the following command:

  ```bash
  $> heroku config
  === ad-john_doe-todo Config Vars
  CLEARDB_DATABASE_URL: mysql://23fbfc668f39e2:letmein@eu-cdbr-west-02.cleardb.net/heroku_1a84deeaab9449e?reconnect=true
  ```

  > The `$CLEARDB_DATABASE_URL` variable contains all the database credentials
  > and information in a single URL. The format is:
  >
  >     mysql://[username]:[password]@[host]:[port]/[database_name]
  >
  > In this example:
  >
  > - `23fbfc668f39e2` is the **username**.
  > - `letmein` is the **password**.
  > - `us-cdbr-iron-east-01.cleardb.net` is the address of the **host** server where the database is running.
  > - `heroku_1a84deeaab9449e` is the **database name**.
  >
  > Since the port is not specified in this connection URL, it is the default MySQL port: `3306`.

- Download, install and run [MySQL
  Workbench](https://www.mysql.com/products/workbench/).

  > You do not need to create an Oracle account; there is a link to skip account
  > creation at the bottom.)

- Create a new connection:

  ![Create MySQL Workbench Connection](../images/workbench-connection.png)

- Configure the connection parameters from the parameters in the
  `$CLEARDB_DATABASE_URL` variable:

  ![Configure MySQL Workbench Connection](../images/workbench-connection-params.png)

- Open the connection by double-clicking on it. It will ask you for the database
  password at this stage (which you will also find in the
  `$CLEARDB_DATABASE_URL` variable):

  ![Open MySQL Workbench Connection](../images/workbench-connection-open.png)

- Double-click on the table name in the Schemas tab on the left. Then execute
  the correct `CREATE TABLE` query:

  ![Create Todolist Table](../images/workbench-create-table.png)

  > You can find the correct query [in the PHP Todolist repository's
  > `todolist.sql`
  > file](https://github.com/MediaComem/comem-archidep-php-todo-exercise/blob/63ffa1067f17b76bb3cd7fca50fb62492c475c11/todolist.sql#L7-L13).

The application should work fine now.

## Deploy the Minesweeper application

This section explains how to deploy the same application as in the [Minesweeper
exercise](https://github.com/MediaComem/comem-archidep/blob/main/ex/minesweeper-deployment.md)
on Heroku.

The commands in this exercise must be executed **on your local machine** in the
Git repository where you have the Minesweeper application. You do not need your
cloud server at all.

### Create a Heroku application (if you have a credit card)

Create the application in your Heroku account. We will only use free add-ons, so
no money will be charged. You can create an application from the main Heroku
page once logged in:

![Create Heroku Application](../images/heroku-create-app.png)

### Add the free Heroku Postgres add-on to your application

Add the **free** [Heroku Postgres add-on][heroku-postgres] to your Heroku
application's resources:

![Add Postgres Add-on](../images/heroku-minesweeper-postgres.png)

**Be sure to select the free plan:**

![Choose Postgres Plan](../images/heroku-minesweeper-postgres-plan.png)

Go to your application's settings and reveal its configuration variables. You
should see a `DATABASE_URL` variable there:

![Postgres Database URL](../images/heroku-minesweeper-postgres-url.png)

As [documented by the Heroku Postgres add-on][heroku-postgres-database-url],
this environment variable is how database connection settings are provided to
your application.

### Add the required configuration to your application

Minesweeper has two configuration mechanisms: a local configuration file
(`config/local.exs`) or environment variables.

You cannot use the local configuration file on Heroku, because Heroku
applications run in a containerized environment where [the file system is
ephemeral](https://medium.com/geekculture/files-on-heroku-cd09509ed285). Any
files not committed into the Git repository will be lost every time the
application restarts. The local configuration file is ignored by Git (to avoid
committing sensitive values into the history) so it would be lost.

Heroku's preferred configuration mechanism is environment variables, so you
should use that since the Minesweeper application supports it. Still under
configuration variables, add the following variables:

- `MIX_ENV` must be set to `prod` to make sure that the Elixir application is
  compiled in production mode.
- `MINESWEEPER_SECRET_KEY_BASE` should be set to a long random string.

![Minesweeper configuration variables](../images/heroku-minesweeper-config.png)

### Update your Minesweeper application to the latest version

The version of the Minesweeper application you have deployed during the original
exercise only supported the `$MINESWEEPER_DATABASE_URL` environment variable to
configure PostgreSQL connection settings, and the `$MINESWEEPER_HTTP_PORT`
environment variable to configure the port to listen on.

A new version has been published which alternatively also supports the
`$DATABASE_URL` and `$PORT` environment variables, so that it works out of the
box with the [Heroku Postgres add-on][heroku-postgres] and Heroku itself.

Follow these instructions to update your fork of the Minesweeper repository:

- **On your local machine,** go into the directory where you cloned your fork:

  ```bash
  $> cd /path/to/projects/minesweeper
  ```

- Make sure you are on your `main` (or `master`) branch and that you have no
  uncommitted changes:

  ```bash
  $> git status
  On branch main
  Your branch is up to date with 'origin/main'.

  nothing to commit, working tree clean
  ```

  > If you have changes, you should commit them before moving on.

- Add the original repository as a remote:

  ```bash
  $> git remote add upstream https://github.com/MediaComem/minesweeper.git
  ```

- Fetch all changes from the new remote:

  ```bash
  $> git fetch upstream
  ```

- Merge the latest changes from the original repository into your main branch:

  ```bash
  $> git merge upstream/main
  ```

Your fork should now be up-to-date. You can push the updates to GitHub with `git push origin main` if you want, then continue with this exercise.

### Deploy the application to Heroku

Still in your local Minesweeper repository, add the `heroku` remote to your
application (assuming your Heroku application is named `ad-john-doe-mnswpr`):

```bash
$> heroku git:remote -a ad-john-doe-mnswpr
```

> Heroku will probably open your browser and ask you to log in at this point.

The [initial setup of the Minesweeper application][minesweeper-initial-setup]
indicates that you must create various things such as a database user, a
database, and the `uuid-ossp` extension. The Heroku Postgres addon already
manages the user and database for you. You can use the following command to
create the extension in the provided database:

```bash
$> heroku psql -c 'CREATE EXTENSION "uuid-ossp";'
```

Because the combination of Elixir and Node.js in one project is not standard for
Heroku, you must explicitly tell Heroku what [buildpacks][heroku-buildpacks] to
use:

```bash
$> heroku buildpacks:clear
$> heroku buildpacks:add heroku/nodejs
$> heroku buildpacks:add hashnuke/elixir
```

> This will tell Heroku to first compile the Node.js frontend of the Minesweeper
> application, then the Elixir/Phoenix backend.

Push the application to Heroku:

```bash
$> git push heroku main
```

The application should compile and be deployed automatically.

## Deploy applications from previous years

### Deploy the RPS application

This section explains how to deploy the same application as in the [Rock Paper
Scissors exercise
(RPS)](https://github.com/MediaComem/comem-archidep/blob/main/ex/rps-deployment.md)
on Heroku.

The commands in this exercise must be executed **on your local machine** in the
Git repository where you have the RPS application. You do not need your cloud
server at all.

#### Optional: create a Heroku application (if you have a credit card)

An existing Heroku application will be provided for you by the teacher.

However, if you have a credit card, do not hesitate to create the application
yourself in your Heroku account. We will only use free add-ons, so no money will
be charged. (But Heroku requires the account to have a valid credit card to use
database add-ons, even free ones.)

You can create an application from the main Heroku page once logged in:

![Create Heroku Application](../images/heroku-create-app.png)

#### Add the free Heroku Postgres add-on to your application

Add the **free** [Heroku Postgres add-on][heroku-postgres] to your Heroku
application's resources:

![Add Postgres Add-on](../images/heroku-postgres.png)

**Be sure to select the free plan:**

![Choose Postgres Plan](../images/heroku-postgres-plan.png)

Go to your application's settings and reveal its configuration variables. You
should see a `DATABASE_URL` variable there:

![Postgres Database URL](../images/heroku-postgres-url.png)

As [documented by the Heroku Postgres add-on][heroku-postgres-database-url],
this environment variable is how database connection settings are provided to
your application.

#### Update your RPS application to the latest version

The version of the RPS application you have deployed during the original
exercise only supported [the `$RPS_DATABASE_URL` environment
variable](https://github.com/MediaComem/rps/blob/cf206818cc1db8125a3417573882dd4663672a9d/src/server/config.ts#L25)
to configure PostgreSQL connection settings.

A new version has been published which also supports [the `$DATABASE_URL`
environment
variable](https://github.com/MediaComem/rps/blob/6139da63bc2f9f382ea5beb0ffcc3aff393a54c1/src/server/config.ts#L25),
so that it works out of the box with the [Heroku Postgres
add-on][heroku-postgres].

**If you have a clone of the [original
repository](https://github.com/MediaComem/rps)** on your machine, you can simply
update it with `git pull` and use that.

**If you have forked the repository**, follow these instructions to update your
fork:

- **On your local machine,** go into the directory where you cloned your fork:

  ```bash
  $> cd /path/to/projects/rps
  ```

- Add the original repository as a remote:

  ```bash
  $> git remote add upstream https://github.com/MediaComem/rps.git
  ```

- Merge the latest changes from the original repository into your main branch:

  ```bash
  $> git switch main
  $> git merge upstream/master
  ```

Your fork should now be up-to-date. You can push the updates to GitHub with `git push origin main` if you want, then continue with this exercise.

#### Deploy the application to Heroku

Move into the RPS application repository **on your local machine**:

```bash
$> cd /path/to/projects/rps
```

Add the `heroku` remote to your application (assuming your Heroku application is
named `ad-john-doe-rps`):

```bash
$> heroku git:remote -a ad-john-doe-rps
```

Push the application to Heroku:

```bash
$> git push heroku main
```

The application should be deployed, but it will not work yet. As you saw when
deploying on your own server, there are setup steps concerning the database
which you have not yet performed.

#### Set up the database

You do not need to create a database user or a database. The [Heroku Postgres
add-on][heroku-postgres] has taken care of this for you. However, this database
is empty and contains neither the `uuid-ossp` extension nor the tables that are
required for the application to work.

To create the extension, you can use the following command:

```bash
$> heroku psql -c 'CREATE EXTENSION "uuid-ossp";'
```

> The `heroku psql -c '...'` command executes arbitrary SQL statements in the
> context of the database provided by the Heroku Postgres add-on. This is
> equivalent to when you used `sudo -u postgres psql -d rps -c 'CREATE EXTENSION "uuid-ossp"'` during the original exercise to execute SQL statements in the
> database running on your own server.

You must then use the `npm run migrate` script to create the necessary database
tables. You can do this in the context of the Heroku server with the following
command:

```bash
$> heroku run npm run migrate
```

> The `heroku run ...` command executes arbitrary commands on the server where
> your deployed application is running.

Finally, restart the application so that it can retry connecting to the
database:

```
$> heroku restart
```

The application should now work!

> Note that on a free deployment, the WebSocket connection will drop after a
> while when Heroku puts the application to sleep. Free dynos are not
> appropriate for real-time applications running on Heroku.

### Deploy the WOPR application

This section explains how to deploy the same application as in the [WOPR
exercise](https://github.com/MediaComem/comem-archidep/blob/master/ex/wopr-deployment.md)
on Heroku.

The commands in this exercise must be executed **on your local machine** in the
Git repository where you have the WOPR application. You do not need your cloud
server at all.

#### Optional: create a Heroku application (if you have a credit card)

An existing Heroku application will be provided for you by the teacher.

However, if you have a credit card, do not hesitate to create the application
yourself in your Heroku account. We will only use free add-ons, so no money will
be charged. (But Heroku requires the account to have a valid credit card to
use database add-ons, even free ones.)

You can create an application from the main Heroku page once logged in:

![Create Heroku Application](../images/heroku-create-app.png)

#### Add the free Heroku Redis add-on to your application

Add the **free** [Heroku Redis
add-on](https://elements.heroku.com/addons/heroku-redis) to your Heroku
application's resources:

![Add Redis Add-on](../images/heroku-redis.png)

**Be sure to select the free plan:**

![Choose Redis Plan](../images/heroku-redis-plan.png)

Go to your application's settings and reveal its configuration variables. You
should see a `REDIS_URL` variable there:

![Redis Database URL](../images/heroku-redis-url.png)

Fortunately, the WOPR application [already takes into account the `$REDIS_URL`
environment
variable](https://github.com/MediaComem/comem-wopr/blob/7de462120783fdf771e68161ac21d5b51eca52d5/lib/wopr.rb#L64-L66),
so you will not have to make any changes to the code this time.

#### Deploy the application to Heroku

Move into the WOPR application repository **on your local machine**:

```bash
$> cd /path/to/projects/comem-wopr
```

Add the `heroku` remote to your application:

```bash
$> heroku git:remote -a ad-john-doe-wopr
```

The WOPR repository contains both a `Gemfile` file for Ruby packages and a
`package.json` file for npm packages. Heroku therefore cannot be sure whether
this is a Ruby or Node.js application. You must tell it what to do by
configuring buildpacks:

```bash
heroku buildpacks:set --index 1 heroku/ruby
heroku buildpacks:set --index 2 heroku/nodejs
```

> This tells Heroku to use the standard Ruby buildpack (it will install
> dependencies with `bundle install`), followed by the standard Node.js
> buildpack (it will install dependencies with `npm install`).
>
> Note that the repository also contains a
> [`Profile`](https://github.com/MediaComem/comem-wopr/blob/7de462120783fdf771e68161ac21d5b51eca52d5/Procfile)
> which tells Heroku which command to execute to run the application.

Push the application to Heroku:

```bash
$> git push heroku main
```

The application's main page should be accessible at the URL indicated in the
deployment log. It should also work!

> You do not need to configure the database for this application. This is
> because Redis is a schema-less NoSQL database. Values can be stored without
> having to create a database in advance.

[heroku]: https://www.heroku.com
[heroku-buildpacks]: https://devcenter.heroku.com/articles/buildpacks
[heroku-cli]: https://devcenter.heroku.com/articles/heroku-cli
[heroku-postgres]: https://elements.heroku.com/addons/heroku-postgresql
[heroku-postgres-database-url]: https://devcenter.heroku.com/articles/heroku-postgresql#provisioning-heroku-postgres
[homebrew]: https://brew.sh
[minesweeper-initial-setup]: https://github.com/MediaComem/minesweeper#initial-setup
