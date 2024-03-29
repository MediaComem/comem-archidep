# Unix Environment Variables

Learn how to manage Unix environment variables.

<!-- slide-include ../../BANNER.md -->

**You will need**

* A Unix CLI

**Recommended reading**

* [Unix Processes](../unix-processes/)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Environment](#environment)
  - [What is an environment?](#what-is-an-environment)
  - [Deployment](#deployment)
  - [Release management](#release-management)
- [Environment variables](#environment-variables)
  - [What is an environment variable?](#what-is-an-environment-variable)
  - [What are they for?](#what-are-they-for)
- [Managing environment variables](#managing-environment-variables)
  - [Getting an environment variable](#getting-an-environment-variable)
  - [Listing all environment variables](#listing-all-environment-variables)
  - [Setting an environment variable](#setting-an-environment-variable)
    - [Setting a variable for one command](#setting-a-variable-for-one-command)
    - [Setting a variable for a shell session](#setting-a-variable-for-a-shell-session)
    - [Setting a variable in the shell configuration file](#setting-a-variable-in-the-shell-configuration-file)
  - [Removing an environment variable](#removing-an-environment-variable)
  - [Getting environment variables from code](#getting-environment-variables-from-code)
  - [Environment variables are always strings](#environment-variables-are-always-strings)
- [References](#references)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->





## Environment

<!-- slide-front-matter class: center, middle -->

<img class='w80' src='images/environments.png' />

### What is an environment?

In the context of software **deployment**, an [**environment**][env] is a
computer system or set of systems in which a program or component is deployed
and executed.

<!-- slide-column -->

<p class='center'><img class='w40' src='images/development-server.png' /></p>

When you develop and/or execute a program locally, your local computer is an
environment.

<!-- slide-column -->

<p class='center'><img class='w40' src='images/web-server.png' /></p>

When you transfer a program to a server and execute it there, that becomes
another environment.

### Deployment

In industrial use, the **development environment** (where changes are originally
made) and **production environment** (what end users use) are separated, often
with several stages in between.

<p class='center'><img class='w85' src='images/deployment.png' /></p>

The configuration of each environment may vary to suit the requirements of
development, testing, production, etc.

### Release management

<!-- slide-column -->

<p class='center'><img class='w100' src='images/release-management-cycle.jpg' /></p>

<!-- slide-column -->

When using [agile software development][agile], teams are seeing much higher
quantities of software releases.

[Continuous delivery][cd] and [DevOps][devops] are processes where a program is
packaged and "moved" from one environment to the other (i.e. deployed) until it
reaches the production stage.

Modern software development teams use automation to speed up this process.






## Environment variables

<!-- slide-front-matter class: center, middle -->

Affecting processes since 1979.



### What is an environment variable?

An environment variable is a **named value that can affect the way running processes will behave** on a computer.

When a process runs on a Unix system, it may query variables such as:

* `HOME` - The home directory of the user running the process.
* `LANG` - The default locale.
* `TMP` - The directory in which to store temporary files.
* And more.

Another common example is the [`PATH`][path],
an environment variable that indicates in which directories to look for binaries to execute when typing commands in a shell.



### What are they for?

Environment variables can **affect the behavior of programs without modifying them**.

If a program bases some of its behavior on an environment variable,
you can simply change the value of the variable before running it,
allowing you to customize it without changing one line of code.

Environment variables can be used as a dynamic means of configuration,
an alternative to configuration files or hardcoded values.





## Managing environment variables

<!-- slide-front-matter class: center, middle -->

Getting them, listing them, setting them, deleting them.



### Getting an environment variable

To display the current value of an environment variable, use the `echo` command.
A variable can be referenced by its name prefixed with a dollar sign (`$`):

```bash
$> echo $USER
ubuntu

$> echo $HOME
/home/ubuntu

$> echo $SHELL
/bin/bash

$> echo $PATH
/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
```

If a variable is not set, nothing will be displayed:

```bash
$> echo $FOO
```



### Listing all environment variables

The `env` command prints all environment variables currently set in your shell, and their values:

```bash
$> env
LC_ALL=en_US.utf-8
LS_COLORS=rs=0:di=01;34:...
LANG=C.UTF-8
USER=ubuntu
PWD=/home/ubuntu
HOME=/home/ubuntu
LC_CTYPE=UTF-8
SSH_TTY=/dev/pts/0
MAIL=/var/mail/ubuntu
TERM=xterm-256color
SHELL=/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
```



### Setting an environment variable

There are multiple ways to set an environment variable.
The lifetime of the variable depends on how you set it:

* You can set it for one command.
* You can set it for the current shell session.
* You can set it in your shell configuration file (e.g. `.bashrc`).

In order to test these techniques,
download this [simple script](https://git.io/fpdar) which prints the value of an environment variable if set:

```bash
$> curl -sL https://git.io/fpdar > print-env-var.sh

$> chmod 755 print-env-var.sh

$> ./print-env-var.sh PATH
The value of $PATH is /usr/local/sbin:/usr/local/bin:...

$> ./print-env-var.sh FOO
$FOO is not set
```

#### Setting a variable for one command

You can prefix a command by an environment variable assigment:

```bash
$> `FOO=bar` ./print-env-var.sh FOO
The value of $FOO is bar
```

This only sets the variable **for the process executed by that command**.
As you can see, the variable is still not set if we check later, even in the same shell session:

```bash
$> ./print-env-var.sh FOO
$FOO is not set
```

#### Setting a variable for a shell session

The `export` command exports an environment variable to all the child processes running in the current shell session:

```bash
$> `export FOO=bar`

$> ./print-env-var.sh FOO
The value of $FOO is bar

$> ./print-env-var.sh FOO
The value of $FOO is bar
```

As you can see, the variable remains set.

However, if you close the shell and reopen a new one, the variable is no longer set:

```bash
$> ./print-env-var.sh FOO
$FOO is not set
```

#### Setting a variable in the shell configuration file

If you add the `export` command to your shell configuration file (`.bash_profile` for [Bash][bash]),
it will be run every time you start a new shell:

```bash
$> `echo 'export FOO=bar' >> ~/.bash_profile`

$> cat ~/.bash_profile
export FOO=bar
```

This will not immediately take effect in the current shell,
as the configuration file is only evaluated when the shell starts.
But you can evaluate it with the `source` command:

```bash
$> source ~/.bash_profile

$> ./print-env-var.sh FOO
The value of $FOO is bar
```

The variable will still be set if you close this shell and launch another one:

```bash
$> ./print-env-var.sh FOO
The value of $FOO is bar
```



### Removing an environment variable

The `unset` command removes a variable from the environment:

```bash
$> ./print-env-var.sh FOO
The value of $FOO is bar

$> unset FOO

$> ./print-env-var.sh FOO
$FOO is not set
```

> Of course, if the variable is exported in your shell configuration file,
> this will only remove it for the current shell session.
> You must remove the export from the configuration file to remove the variable from future shells.



### Getting environment variables from code

Every programming language has a simple way of retrieving the value of environment variables:

Language     | Code
:---         | :---
C            | [`getenv("PATH")`](http://man7.org/linux/man-pages/man3/getenv.3.html)
Elixir       | [`System.get_env("FOO")`](https://hexdocs.pm/elixir/System.html#get_env/2)
Erlang       | [`os.get_env("FOO")`](http://erlang.org/doc/man/os.html#getenv-1)
Go           | [`os.Getenv("FOO")`](https://golang.org/pkg/os/#Getenv)
Java         | [`System.getenv("FOO")`](https://docs.oracle.com/en/java/javase/12/docs/api/java.base/java/lang/System.html#getenv%28java.lang.String%29)
Node.js      | [`process.env.FOO`](https://nodejs.org/api/process.html#process_process_env)
PHP          | [`getenv("FOO")`](https://www.php.net/manual/en/function.getenv.php)
Python       | [`os.getenv("FOO")`](https://docs.python.org/3/library/os.html#os.getenv)
Ruby         | [`ENV["FOO"]`](https://ruby-doc.org/core-2.6.5/ENV.html#method-c-5B-5D)
Rust         | [`env::var("FOO")`](https://doc.rust-lang.org/std/env/fn.var.html)



### Environment variables are always strings

You may put whatever kind of value you want into an environment variable:

```bash
export MEANING_OF_LIFE=42  # A number
export PERSON='{"name":"John Doe","age":24}'  # Serialized JSON
```

In your programming language of choice, however, the value will **always** be a
character string. It's up to you to parse it if you want to use it as another
type, for example in Node.js:

```js
> console.log(process.env.MEANING_OF_LIFE);
42
*> process.env.MEANING_OF_LIFE + 2
*'422'
> typeof process.env.MEANING_OF_LIFE
string
> parseInt(process.env.MEANING_OF_LIFE, 10) + 2
44

> process.env.PERSON.name
undefined
> JSON.parse(process.env.PERSON).name
'John Doe'
```



## References

* [Environment Variable][env-var]
* [Linux/Unix list of common environment variables](https://www.cyberciti.biz/howto/question/general/linux-unix-list-common-environment-variables.php)
* [All you need to know about Unix environment variables](https://www.networkworld.com/article/3215965/unix/all-you-need-to-know-about-unix-environment-variables.html)



[agile]: https://en.wikipedia.org/wiki/Agile_software_development
[bash]: https://en.wikipedia.org/wiki/Bash_(Unix_shell)
[cd]: https://en.wikipedia.org/wiki/Continuous_delivery
[devops]: https://en.wikipedia.org/wiki/DevOps
[env]: https://en.wikipedia.org/wiki/Deployment_environment
[env-var]: https://en.wikipedia.org/wiki/Environment_variable
[path]: https://en.wikipedia.org/wiki/Path_(computing)
