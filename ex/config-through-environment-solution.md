# Solution: [Configure a PHP application through environment variables](./config-through-environment.md)

<!-- START doctoc -->
<!-- END doctoc -->

The configuration at the top of your `index.php` file in your PHP todolist
repository should look like this:

```
define('BASE_URL', getenv('TODOLIST_BASE_URL') ?: '/');

// Database connection parameters.
define('DB_USER', getenv('TODOLIST_DB_USER') ?: 'todolist');
define('DB_PASS', getenv('TODOLIST_DB_PASS'));
define('DB_NAME', getenv('TODOLIST_DB_NAME') ?: 'todolist');
define('DB_HOST', getenv('TODOLIST_DB_HOST') ?: '127.0.0.1');
define('DB_PORT', getenv('TODOLIST_DB_PORT') ?: '3306');
```

You should have at least three copies of the PHP todolist repository with this
version of the code:

* Your fork of the PHP todolist repository on GitHub (e.g.
  https://github.com/JohnDoe/comem-archidep-php-todo-exercise, assuming
  `JohnDoe` is your GitHub username).
* Your local clone of that repository on your machine, which you used to make
  the changes asked in the exercise.
* Your clone of that repository on your Azure server.

At the end of the exercise, the repository on your Azure server should have no
uncommitted changes, i.e. the `git status` command should print "nothing to
commit, working tree clean" when executed in the `~/todolist-repo` directory on
your server.
