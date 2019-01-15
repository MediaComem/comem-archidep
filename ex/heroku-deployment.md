# Deploy PHP and Node.js applications to Heroku

The goal of this exercice is to deploy the PHP todolist and Node.js one chat room applications used in previous exercices,
but this time on Heroku instead of the Amazon Web Services cloud.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Deploy the PHP todolist application](#deploy-the-php-todolist-application)
- [Deploy the Node.js one chat room application](#deploy-the-nodejs-one-chat-room-application)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## Deploy the PHP todolist application

> The changes and commands below must be done **on your local machine**
> in the Git repository where you have your PHP todolist application.

* Add the **free** [ClearDB MySQL addon](https://devcenter.heroku.com/articles/cleardb) to your Heroku app's resources
  (you can do this on the command line or in Heroku's web dashboard in your application's *Resources* tab).
* Update the configuration section at the start of `index.php` with this code:

  ```php
  $dbDefaults = parse_url(getenv('CLEARDB_DATABASE_URL') ?: getenv('TODOLIST_DB_URL') ?: "mysql://todolist@127.0.0.1:3306/todolist");

  define('BASE_URL', getenv('TODOLIST_BASE_URL') ?: '/');
  define('DB_USER', getenv('TODOLIST_DB_USER') ?: $dbDefaults["user"]);
  define('DB_PASS', getenv('TODOLIST_DB_PASS') ?: $dbDefaults["pass"]);
  define('DB_NAME', getenv('TODOLIST_DB_NAME') ?: substr($dbDefaults["path"], 1));
  define('DB_HOST', getenv('TODOLIST_DB_HOST') ?: $dbDefaults["host"]);
  define('DB_PORT', getenv('TODOLIST_DB_PORT') ?: $dbDefaults["port"]);
  ```

  > This code allows the application to be configured through the `$CLEARDB_DATABASE_URL` environment variable,
  > as specified in the [plugin's documentation](https://devcenter.heroku.com/articles/cleardb#using-cleardb-with-php).

  Add and commit your changes with `git add index.php` and `git commit -m "Allow configuration with database URL"`.
* Add the `heroku` remote to your application:

  ```bash
  heroku git:remote -a ad-john-doe-todo
  ```
* Deploy the application to Heroku:

  ```bash
  git push heroku master
  ```

  The application's main page should be accessible at the URL indicated in the deployment log.
  However, adding todo items will not work because the database has not yet been initialized.
* Retrieve your database credentials:

  ```bash
  $> heroku config
  === ad-john_doe-todo Config Vars
  CLEARDB_DATABASE_URL: mysql://b2f75923a99dc2:letmein@us-cdbr-iron-east-01.cleardb.net/heroku_d8804d429adb0e0?reconnect=true
  ```

  > The `$CLEARDB_DATABASE_URL` variable contains all the database credentials in a single URL.
  > The format is:
  >
  >     mysql://[username]:[password]@[host]:[port]/[database_name]
  >
  > In this example:
  >
  > * `b2f75923a99dc2` is the **username**.
  > * `letmein` is the **password**.
  > * `us-cdbr-iron-east-01.cleardb.net` is the address of the **host** server where the database is running.
  > * `heroku_d8804d429adb0e0` is the **database name**.
  >
  > Since the port is not specified in this connection URL, it is the default MySQL port: `3306`.
* Create the `todolist` table in the database.

  The database created by the ClearDB addon is empty.
  You must create the `todolist` table for the application to work.
  The following instructions indicate how to do this with [TeamSQL](https://teamsql.io),
  a free cross-platform SQL client, but you can do it with your favorite SQL client.

  * Install [TeamSQL](https://teamsql.io) and open it.
    Create an account if asked.
  * Create a new TeamSQL connection with your database credentials:

    ![Create TeamSQL connection](../images/teamsql-connection.png)
  * Execute the correct `CREATE TABLE` query in the database:

    ![Execute TeamSQL query](../images/teamsql.png)

    > You can find the correct query in the repository's `todolist.sql` file.

  The application should work fine now.

## Deploy the Node.js one chat room application

> The changes and commands below must be done **on your local machine**
> in the Git repository where you have the One Chat Room application.

* Add the *free* [mLab MongoDB addon](https://elements.heroku.com/addons/mongolab) in your Heroku app's *Resources* tab.
* Add the `heroku` remote to your application:

  ```bash
  heroku git:remote -a ad-john-doe-chat
  ```
* Deploy the application to Heroku:

  ```bash
  git push heroku master
  ```

  The application should be functional and accessible at the URL indicated in the deployment log.

  > You do not need to configure the database for this application.
  > This is because MongoDB is a schema-less NoSQL database;
  > Databases and collections are created automatically on-the-fly when first accessed.
