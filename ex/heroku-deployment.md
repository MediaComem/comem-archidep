# Deploy web applications with a database to Heroku

The goal of this exercice is to deploy the PHP Todolist and Ruby WOPR
applications used in previous exercices, but this time on Heroku
(Platform-as-a-Service) instead of the Amazon Web Services cloud
(Infrastructure-as-a-Service).

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Deploy the PHP Todolist application](#deploy-the-php-todolist-application)
  - [Optional: create a Heroku application (if you have a credit card)](#optional-create-a-heroku-application-if-you-have-a-credit-card)
  - [Add the free ClearDB MySQL addon to your application](#add-the-free-cleardb-mysql-addon-to-your-application)
  - [Update the PHP Todolist to use the `$CLEARDB_DATABASE_URL` environment variable](#update-the-php-todolist-to-use-the-cleardb_database_url-environment-variable)
  - [Deploy the application to Heroku](#deploy-the-application-to-heroku)
  - [Create the `todolist` table in the database](#create-the-todolist-table-in-the-database)
- [Deploy the WOPR application](#deploy-the-wopr-application)
  - [Optional: create a Heroku application (if you have a credit card)](#optional-create-a-heroku-application-if-you-have-a-credit-card-1)
  - [Add the free Heroku Redis addon to your application](#add-the-free-heroku-redis-addon-to-your-application)
  - [Deploy the application to Heroku](#deploy-the-application-to-heroku-1)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## Deploy the PHP Todolist application

The commands in this exercise must be executed **on your local machine** in the
Git repository where you have the PHP Todolist application. You do not need your
AWS server.

### Optional: create a Heroku application (if you have a credit card)

An existing Heroku application will be provided for you by the teacher.

However, if you have a credit card, do not hesitate to create the application
yourself in your Heroku account. We will only use free addons, so no money will
be charged. (But Heroku requires the account to have a valid credit card to
use database add-ons, even free ones.)

You can create an application from the main Heroku page once logged in:

![Create Heroku Application](../images/heroku-create-app.png)

### Add the free ClearDB MySQL addon to your application

Add the **free** [ClearDB MySQL
addon](https://devcenter.heroku.com/articles/cleardb) to your Heroku
application's resources:

![Add ClearDB Addon](../images/heroku-add-cleardb.png)

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

This URL was configured when you added the ClearDB MySQL addon to your
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

The documentation of the ClearDB MySQL addon [shows how to use the variable from
PHP code](https://devcenter.heroku.com/articles/cleardb#using-cleardb-with-php).
Here are some changes you could make that would work:

```php
// Get a MySQL connection URL from the environment, or use one with default parameters.
// Support the $CLEARDB_DATABASE_URL variable from the ClearDB MySQL addon on Heroku.
$dbDefaults = parse_url(getenv('CLEARDB_DATABASE_URL') ?: getenv('TODOLIST_DB_URL') ?: "mysql://todolist@127.0.0.1:3306/todolist");

// Get configuration from the environment or use default values from the connection URL.
define('BASE_URL', getenv('TODOLIST_BASE_URL') ?: '/');
define('DB_USER', getenv('TODOLIST_DB_USER') ?: $dbDefaults["user"]);
define('DB_PASS', getenv('TODOLIST_DB_PASS') ?: $dbDefaults["pass"]);
define('DB_NAME', getenv('TODOLIST_DB_NAME') ?: substr($dbDefaults["path"], 1));
define('DB_HOST', getenv('TODOLIST_DB_HOST') ?: $dbDefaults["host"]);
define('DB_PORT', getenv('TODOLIST_DB_PORT') ?: $dbDefaults["port"]);
```

Add and commit your changes with `git add index.php` and `git commit -m "Allow
configuration with database URL"`.

### Deploy the application to Heroku

Move into the PHP Todolist repository **on your local machine**:

```bash
$> cd /path/to/projects/comem-archidep-php-todo-exercise
```

Add the `heroku` remote to your application:

```bash
$> heroku git:remote -a ad-john-doe-todo
```

Push the application to Heroku:

```bash
$> git push heroku master
```

The application's main page should be accessible at the URL indicated in the
deployment log. However, adding todo items will not work because the database
has not yet been initialized.

### Create the `todolist` table in the database

The database created by the ClearDB addon is empty. You must create the
`todolist` table for the application to work. The following instructions
indicate how to do this with [MySQL
Workbench](https://www.mysql.com/products/workbench/), a free cross-platform SQL
client, but you can do it with any SQL client.

* Retrieve your database credentials from the `$CLEARDB_DATABASE_URL` environment
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
  > * `23fbfc668f39e2` is the **username**.
  > * `letmein` is the **password**.
  > * `us-cdbr-iron-east-01.cleardb.net` is the address of the **host** server where the database is running.
  > * `heroku_1a84deeaab9449e` is the **database name**.
  >
  > Since the port is not specified in this connection URL, it is the default MySQL port: `3306`.
* Download, install and run [MySQL
  Workbench](https://www.mysql.com/products/workbench/). (You do not need to
  create an Oracle account; there is a link to skip account creation at the
  bottom.)
* Create a new connection:

  ![Create MySQL Workbench Connection](../images/workbench-connection.png)
* Configure the connection parameters from the parameters in the
  `$CLEARDB_DATABASE_URL` variable:

  ![Configure MySQL Workbench Connection](../images/workbench-connection-params.png)
* Open the connection by double-clicking on it. It will ask you for the database
  password at this stage (which you will also find in the
  `$CLEARDB_DATABASE_URL` variable):

  ![Open MySQL Workbench Connection](../images/workbench-connection-open.png)
* Double-click on the table name in the Schemas tab on the left. Then execute
  the correct `CREATE TABLE` query:

  ![Create Todolist Table](../images/workbench-create-table.png)

  > You can find the correct query [in the PHP Todolist repository's
  > `todolist.sql`
  > file](https://github.com/MediaComem/comem-archidep-php-todo-exercise/blob/63ffa1067f17b76bb3cd7fca50fb62492c475c11/todolist.sql#L7-L13).

The application should work fine now.



## Deploy the WOPR application

The commands in this exercise must be executed **on your local machine** in the
Git repository where you have the WOPR application. You do not need your AWS
server.

```bash
$> cd /path/to/projects/comem-wopr
```

### Optional: create a Heroku application (if you have a credit card)

An existing Heroku application will be provided for you by the teacher.

However, if you have a credit card, do not hesitate to create the application
yourself in your Heroku account. We will only use free addons, so no money will
be charged. (But Heroku requires the account to have a valid credit card to
use database add-ons, even free ones.)

You can create an application from the main Heroku page once logged in:

![Create Heroku Application](../images/heroku-create-app.png)

### Add the free Heroku Redis addon to your application

Add the **free** [Heroku Redis
addon](https://elements.heroku.com/addons/heroku-redis) to your Heroku
application's resources:

![Add Redis Addon](../images/heroku-redis.png)

**Be sure to select the free plan:**

![Choose Redis Plan](../images/heroku-redis-plan.png)

Go to your application's settings and reveal its configuration variables. You
should see a `REDIS_URL` variable there:

![Redis Database URL](../images/heroku-redis-url.png)

Fortunately, the WOPR application [already takes into account the `$REDIS_URL`
environment
variable](https://github.com/MediaComem/comem-wopr/blob/7de462120783fdf771e68161ac21d5b51eca52d5/lib/wopr.rb#L64-L66),
so you will not have to make any changes to the code this time.

### Deploy the application to Heroku

Move into the WOPR application repository **on your local machine**:

```bash
$> cd /path/to/projects/comem-wopr
```

Add the `heroku` remote to your application:

```bash
$> heroku git:remote -a ad-john-doe-wopr
```

Push the application to Heroku:

```bash
$> git push heroku master
```

The application's main page should be accessible at the URL indicated in the
deployment log. It should also work!

> You do not need to configure the database for this application. This is
> because Redis is a schema-less NoSQL database. Values can be stored without
> having to create a database in advance.
