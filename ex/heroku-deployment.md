# Deploy PHP and Node.js applications to Heroku

The goal of this exercice is to deploy the PHP todolist and Node.js one chat room applications used in previous exercices,
but this time on Heroku instead of the Amazon Web Services cloud.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Deploy the PHP todolist application](#deploy-the-php-todolist-application)
- [Deploy the Node.js one chat room application](#deploy-the-nodejs-one-chat-room-application)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## Deploy the PHP todolist application

* Add the **free** [ClearDB MySQL addon](https://devcenter.heroku.com/articles/cleardb) in your Heroku app's *Resources* tab.
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
* Deploy the application to Heroku.

## Deploy the Node.js one chat room application

* Add the *free* [mLab MongoDB addon](https://elements.heroku.com/addons/mongolab) in your Heroku app's *Resources* tab.
* Deploy the application to Heroku.
