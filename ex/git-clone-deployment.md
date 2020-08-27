# Deploy a PHP application with Git

This guide describes how to deploy a PHP application much like the [previous exercise](sftp-deployment.md)
but using Git to put the code on the server instead of SFTP.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Setup](#setup)
- [Clone the repository](#clone-the-repository)
- [Update the configuration](#update-the-configuration)
- [Run the PHP development server](#run-the-php-development-server)
- [End result](#end-result)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->




## Setup

Make sure you have done the [previous exercise](sftp-deployment.md) and the [Git
collaboration](https://github.com/MediaComem/comem-archidep-php-todo-exercise)
exercise first. If you were not Bob during the collaboration exercise (i.e. the
person who owns the fork), create your own fork of the repository so that you
can modify it independently.

Stop your `php -S` command if it is still running.





## Clone the repository

Instead of manually uploading files through SFTP, you will connect to the server
through SSH and clone the repository from GitHub.

Copy your repository's public HTTP URL, and clone it (replace `MyUser`):

```bash
$> cd

$> git clone https://github.com/MyUser/comem-archidep-php-todo-exercise.git todolist-repo
```

Those commands will create a new `todolist-repo` directory in your home directory.





## Update the configuration

Go into the cloned repository:

```bash
$> cd ~/todolist-repo
```

Update the first few lines of `index.php` with the same configuration as for the previous exercise:

```php
define('BASE_URL', '/');
define('DB_USER', 'todolist');
define('DB_PASS', 'chAngeMeN0w!');
define('DB_NAME', 'todolist');
define('DB_HOST', '127.0.0.1');
define('DB_PORT', '3306');
```




## Run the PHP development server

Still in the cloned repository, run a PHP development server on port 3000:

```bash
$> php -S 0.0.0.0:3000
```

You should be able to access the application in a browser at the correct IP
address and port (e.g. `1.2.3.4:3000`).





## End result

![Diagram](git-clone-deployment.png)

> [PDF version](git-clone-deployment.pdf).





[php-todolist]: https://github.com/MediaComem/comem-archidep-php-todo-exercise
