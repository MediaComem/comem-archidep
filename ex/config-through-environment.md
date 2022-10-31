# Configure a PHP application through environment variables

The goal of this exercise is to improve the configuration step of the [previous
exercise](git-clone-deployment.md) by using environment variables instead of
hardcoded configuration values.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Legend](#legend)
- [:tip: Setup](#tip-setup)
- [:exclamation: Update the configuration](#exclamation-update-the-configuration)
- [:exclamation: Pull the latest version from the server](#exclamation-pull-the-latest-version-from-the-server)
- [:exclamation: Run the PHP development server](#exclamation-run-the-php-development-server)
- [:checkered_flag: What have I done?](#checkered_flag-what-have-i-done)
  - [Architecture](#architecture)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Legend

Parts of this guide are annotated with the following icons:

- :exclamation: A task you **MUST** perform to complete the exercise.
- :question: An optional step that you _may_ perform to make sure that
  everything is working correctly.
- :warning: **Critically important information about the exercise.**
- :gem: Tips on the exercise, reminders about previous exercises, or
  explanations about how this exercise differs from the previous one.
- :space_invader: More advanced tips on how to save some time.
- :books: Additional information about the exercise or the commands and tools
  used.
- :checkered_flag: The end of the exercise.
- :boom: Troubleshooting tips: how to fix common problems you might encounter.

## :tip: Setup

Make sure you have completed the [previous exercise](git-clone-deployment.md)
and the [Git
collaboration](https://github.com/MediaComem/comem-archidep-php-todo-exercise)
exercise first.

Stop your `php -S` command if it is still running.

> :gem: You can use Ctrl-C to stop any command currently running in your
> terminal.

## :exclamation: Update the configuration

**On your local machine (NOT on the server):** clone the repository if you do
not have it already:

```bash
$> cd /path/to/projects
$> git clone git@github.com:MyUser/comem-archidep-php-todo-exercise.git
```

> :gem: Make sure that you are cloning a repository that belongs to you, because
> you are going to modify it.
> [Fork](https://guides.github.com/activities/forking/) one of your colleagues'
> repositories if necessary.

Modify the first few lines of `index.php` to take configuration values from the
environment if available.

For example, instead of:

```php
define('BASE_URL', '/');
```

Use this:

```php
define('BASE_URL', getenv('TODOLIST_BASE_URL') ?: '/');
```

With this code, the `BASE_URL` variable will be equal to the value of the
`TODOLIST_BASE_URL` environment variable if it has been set, or it will default
to `/` if the environment variable is not available.

> This is accomplished using the [PHP shorthand ternary operator
> `?:`][php-shorthand-comparisons].

Do **NOT** set a default value for the password, as it is a bad practice to
hardcode sensitive values (as mentionned in the [Config section of The
Twelve-Factor App](https://12factor.net/config)). The definition of the
`DB_PASS` variable should have no default and look like this:

```php
define('DB_PASS', getenv('TODOLIST_DB_PASS'));
```

Make sure to update the definitions of all other variables (`DB_USER`,
`DB_NAME`, `DB_HOST` and `DB_PORT`) to take their value from the environment,
with an appropriate default value.

> :gem: Regarding the default values, you may assume that for a typical
> deployment, a MySQL database server is available on the host machine itself
> (`127.0.0.1`) and exposed on the default MySQL port (`3306`).

**Commit and push your changes** to the remote repository on GitHub.

## :exclamation: Pull the latest version from the server

**Connect to your server** and go into the cloned repository from the previous
exercise (`~/todolist-repo` if you followed the instructions to the letter).

You may have made manual configuration changes during the previous exercise. You
must discard them with the `git restore <file>` command. This will remove any
uncommitted changes and restore the latest version of the file that was
committed in the repository:

```bash
$> git restore index.php
```

You can now pull the latest version of the code from GitHub.

> :gem: The command to pull the latest changes is `git pull <remote> <branch>`.
> If you do not remember the name(s) of your remote(s), you can list them with
> the `git remote` command (or with `git remote -v` to also see their URLs).

## :exclamation: Run the PHP development server

Still in the cloned repository, run a PHP development server on port 3000. Note
that this time you must now provide the appropriate configuration through
environment variables:

- You must provide the `TODOLIST_DB_PASS` environment variable which has no
  default value.
- If the default values you have hardcoded for other variables are not suitable
  for your server's environment, you must also provide the corresponding
  environment variables with suitable values.

> :gem: You can execute a command with additional environment variables using
> the following syntax: `EXAMPLE="value" ANOTHER="one" command arg1 arg2`.

You (and everybody else) should be able to access the application in a browser
at the correct IP address and port (e.g. `W.X.Y.Z:3000`) and it should work.

## :checkered_flag: What have I done?

You have made your application configurable through the environment, as
recommended in the [Config section of The Twelve-Factor
App](https://12factor.net/config).

This means that you no longer need to make any changes to the code before
deploying your application to any new environment. It can now be deployed
_anywhere_, on any server or on any developer's local machine, without changing
a single line of code.

You simply need to set the appropriate environment variables when running it,
and the application will use that configuration instead of the hardcoded
defaults. For example, if you are deploying the application on a server where
the MySQL database server is exposed on a non-standard port like `5000`, simply
set the `TODOLIST_DB_PORT` variable, and the application will happily connect to
it.

### Architecture

This is a simplified architecture of the main running processes and
communication flow at the end of this exercise. Note that it has not changed
compared to [the previous exercises](./sftp-deployment.md#architecture) since we
have neither created any new processes nor changed how they communicate:

![Simplified architecture](sftp-deployment-simplified.png)

> [Simplified architecture PDF version](sftp-deployment-simplified.pdf).

The following diagram is a more detailed representation also including the
short-lived processes run during the exercise:

![Detailed architecture](config-through-environment.png)

> [Detailed architecture PDF version](config-through-environment.pdf).

[php-shorthand-comparisons]: https://stitcher.io/blog/shorthand-comparisons-in-php
[php-todolist]: https://github.com/MediaComem/comem-archidep-php-todo-exercise
