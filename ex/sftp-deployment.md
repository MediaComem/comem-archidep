# Deploy a PHP application with SFTP

This guide describes how to deploy a PHP application over SFTP on a server with PHP and MySQL installed,
using the PHP development server.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Setup](#setup)
  - [Install MySQL](#install-mysql)
  - [Install PHP](#install-php)
- [Use a real password](#use-a-real-password)
- [Upload the application](#upload-the-application)
- [Initialize the database](#initialize-the-database)
  - [Make sure it worked](#make-sure-it-worked)
  - [Troubleshooting](#troubleshooting)
- [Update the configuration](#update-the-configuration)
- [Run the PHP development server](#run-the-php-development-server)
- [End result](#end-result)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->





## Setup

Use the previous PHP Todolist Exercice. Clone the [PHP Todolist
Exercice][php-todolist] on your machine if you do not have it.

### Install MySQL

**Connect to your server.**

Update your package lists and install the MySQL database server:

```bash
$> sudo apt update

$> sudo apt install mysql-server
```

APT should automatically run MySQL after installation.
You can check this with the following command:

```bash
$> sudo systemctl status mysql
```

Secure your installation:

```bash
$> sudo mysql_secure_installation

Securing the MySQL server deployment.

Connecting to MySQL using a blank password.

VALIDATE PASSWORD PLUGIN can be used to test passwords
and improve security. It checks the strength of password
and allows the users to set only those passwords which are
secure enough. Would you like to setup VALIDATE PASSWORD plugin?

Press y|Y for Yes, any other key for No: y

There are three levels of password validation policy:

LOW    Length >= 8
MEDIUM Length >= 8, numeric, mixed case, and special characters
STRONG Length >= 8, numeric, mixed case, special characters and dictionary file

Please enter 0 = LOW, 1 = MEDIUM and 2 = STRONG: 1
Please set the password for root here.

New password: ***
Re-enter new password: ***

Estimated strength of the password: 100
Do you wish to continue with the password provided?(Press y|Y for Yes, any other key for No) : y

By default, a MySQL installation has an anonymous user,
allowing anyone to log into MySQL without having to have
a user account created for them. This is intended only for
testing, and to make the installation go a bit smoother.
You should remove them before moving into a production
environment.

Remove anonymous users? (Press y|Y for Yes, any other key for No) : y
Success.

Normally, root should only be allowed to connect from
'localhost'. This ensures that someone cannot guess at
the root password from the network.

Disallow root login remotely? (Press y|Y for Yes, any other key for No) : y
Success.

By default, MySQL comes with a database named 'test' that
anyone can access. This is also intended only for testing,
and should be removed before moving into a production
environment.

Remove test database and access to it? (Press y|Y for Yes, any other key for No) : y
 - Dropping test database...
Success.

 - Removing privileges on test database...
Success.

Reloading the privilege tables will ensure that all changes
made so far will take effect immediately.

Reload privilege tables now? (Press y|Y for Yes, any other key for No) : y
Success.

All done!
```

### Install PHP

Here you will install the bare minimum:

* The PHP FastCGI process manager.
* The PHP MySQL extension.

> In this exercise, you will execute your PHP application directly from the
> command line, without using a web server like Apache.

Simply run this command to install both:

```bash
$> sudo apt install php-fpm php-mysql
```





## Use a real password

The `todolist.sql` creates a `todolist` user with the password `chAngeMeN0w!` by
default. You should change the password to a more secure value. Make sure that
the password you choose is strong enough per the minimum password requirements
you chose when you secured the MySQL installation.

> It is good practice to create a different user and password for each
> application that connects to the MySQL database server. That way, if one of
> the applications is compromised, it cannot access or modify the databases of
> the other applications (provided you configured appropriate access
> privileges).
>
> Notably, you should never use the MySQL root password to connect an
> application to its database. You, the system administrator, should be the only
> person who knows that password.





## Upload the application

Use an SFTP client like [FileZilla][filezilla] to upload the application to the
server.

Connect to your server first, using your SSH public key for authentication. Then
copy the application to `/home/john_doe/todolist`.





## Initialize the database

Go into the uploaded directory on the server:

```bash
$> hostname
john-doe.archidep.online

$> cd /home/john_doe/todolist
```

Execute the project's SQL file to create the database and table:

```bash
$> sudo mysql < todolist.sql
```

### Make sure it worked

To make sure everything worked, you can check that the table was created in the
MySQL database server. You do not have a phpMyAdmin web interface to administer
the database server, since you are installing everything on your server
yourself, and you did not install that.

Use the following command and SQL queries to first connect to the MySQL database
server as the administrator (the MySQL `root` user), then display the `todo`
table's schema:

```bash
$> sudo mysql -u root

> connect todolist;

> show create table todo;
+-------+----------------------------------------------------+
| Table | Create Table                                       |
+-------+----------------------------------------------------+
| todo  | CREATE TABLE `todo` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `title` varchar(2048) NOT NULL,
  `done` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1 |
+-------+----------------------------------------------------+
1 row in set (0.00 sec)
```

> Everything went well if the table was created, since the creation of that
> table is the last step of the `todolist.sql` script.

You may exit the interactive MySQL console like most shells by typing `exit`.

### Troubleshooting

An error may occur here. For example, MySQL may tell you the `todolist` user's
password in the script is not strong enough, depending on the settings you
selected when securing the MySQL installation.

To start over, connect to the MySQL server as an administrator and type the
following queries:

```bash
$> sudo mysql -u root

> drop table todolist.todo;
> drop user todolist@localhost;
> drop database todolist;
```

> Some of these commands may cause errors if the `todolist.sql` script could not
> execute entirely. For example, if the script could not create the `todolist`
> user and/or the `todo` table, the first `drop table todolist.todo;` query will
> fail with:
>
> `ERROR 1051 (42S02): Unknown table 'todolist.todo'`
>
> That's fine. Running the 3 queries will make sure you have nothing left that
> may have been created by the `todolist.sql` script, so you can start over with
> a clean state.





## Update the configuration

Update the first few lines of the `index.php` file with the correct configuration:

```php
define('BASE_URL', '/');
define('DB_USER', 'todolist');
define('DB_PASS', 'chAngeMeN0w!');
define('DB_NAME', 'todolist');
define('DB_HOST', '127.0.0.1');
define('DB_PORT', '3306');
```





## Run the PHP development server

Also in the uploaded directory on the server, run a [PHP development
server][php-dev-server] on port 3000:

```bash
$> php -S 0.0.0.0:3000
```

> You **must really use `0.0.0.0` for the `php -S` command, and not your
> server's IP address**. `0.0.0.0` is not an actual IP address; it is a special
> notation that tells the PHP development server to accept connections on any IP
> address.

You should be able to access the application in a browser at your server's IP
address and the correct port (e.g. `W.X.Y.Z:3000`).





## End result

![Diagram](sftp-deployment.png)

> [PDF version](sftp-deployment.pdf).





[filezilla]: https://filezilla-project.org/
[php-dev-server]: https://www.php.net/manual/en/features.commandline.webserver.php
[php-todolist]: https://github.com/MediaComem/comem-archidep-php-todo-exercise
