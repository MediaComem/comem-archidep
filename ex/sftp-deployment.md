# Basic SFTP Deployment

This guide describes how to deploy a PHP application over SFTP on a server with PHP and MySQL installed,
using the PHP development server.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Setup](#setup)
- [Upload the application](#upload-the-application)
- [Initialize the database](#initialize-the-database)
- [Run the PHP development server](#run-the-php-development-server)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->




## Setup

Use the previous PHP Todolist Exercice.
Clone the [PHP Todolist Exercice][php-todolist] on your machine if you do not have it.

Follow the [PHP & MySQL setup instructions](./php-mysql-setup.md).





## Upload the application

Use an SFTP client like [Cyberduck][cyberduck] to upload the application to the server.





## Initialize the database

Go into the uploaded directory on the server:

```bash
$> hostname
my-name.archidep-2018.media

$> cd /path/to/uploaded/application
```

Execute the project's SQL file to create the database and table:

```bash
$> sudo mysql < todolist.sql
```




## Run the PHP development server

Also in the uploaded directory on the server, run a PHP development server on port 3000:

```bash
$> php -S 3000
```

You should be able to access the application in a browser at the correct IP address and port (e.g. `1.1.1.1:3000`).





[cyberduck]: https://cyberduck.io
[php-todolist]: https://github.com/MediaComem/comem-archidep-php-todo-exercise
