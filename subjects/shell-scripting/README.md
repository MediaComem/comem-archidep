# Shell Scripting

Learn the basics of shell scripting with Bash.

<!-- slide-include ../../BANNER.md -->

**You will need**

* A Unix CLI

**Recommended reading**

* [Command Line Introduction](../cli/)
* [Unix basics](../unix-admin/)
  * [Unix environment variables](../unix-env-vars/)
  * [Unix processes](../unix-processes/)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [What is a script?](#what-is-a-script)
    - [How is a script executed?](#how-is-a-script-executed)
    - [What can I put in a script?](#what-can-i-put-in-a-script)
    - [How do I create a script?](#how-do-i-create-a-script)
    - [All kinds of scripts](#all-kinds-of-scripts)
- [What is shell scripting?](#what-is-shell-scripting)
- [Shell script basics](#shell-script-basics)
    - [Commands](#commands)
    - [Working directory](#working-directory)
    - [Variables](#variables)
        - [Store the output of commands](#store-the-output-of-commands)
        - [Environment variables](#environment-variables)
    - [Conditionals](#conditionals)
        - [The `test` built-in command](#the-test-built-in-command)
    - [Loops](#loops)
    - [Special variables](#special-variables)
    - [The `set` built-in command](#the-set-built-in-command)
    - [Functions](#functions)
        - [Variable scope](#variable-scope)
- [References](#references)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## What is a script?

Unix-like operating system can execute two main types of file:

* **Binaries**, which contain machine-readable binary code that has been compiled from source code.
* **Scripts**, which are text files containing code that is dynamically interpreted.

### How is a script executed?

When an executable text file is run, a Unix-like operating system looks for a **shebang** on the first line.
A shebang is a line with the following format:

```
#!`interpreter` optional-args
```

For example, the following is a valid shebang:

```
#!/bin/bash
```

In this example, it tells the operating system that the **interpreter** which should run this file is `/bin/bash`,
meaning that this is a [Bash][bash] script.

### What can I put in a script?

In a bash script, you can put anything you could type in a Bash shell:

```bash
#!/bin/bash
echo Hello World
```

In a PHP script, you can put any PHP code you want:

```php
#!/usr/bin/php
<?php
echo 'Hello World';
?>
```

Basically, what you can put in a script depends on the interpreter you're using.

### How do I create a script?

Simply create your script:

```bash
$> printf '#!/bin/bash\necho Hello World' > test.sh
```

Make it an executable:

```bash
$> chmod +x test.sh
```

And run it:

```bash
$> ./test.sh
Hello World
```

### All kinds of scripts

The following a few examples of shebangs, but it is nowhere near exhaustive:

Shebang             | Script contents
:---                | :---
`#!/bin/sh`         | [Bourne shell][sh] commands
`#!/bin/bash`       | [Bash shell][bash] commands
`#!/bin/zsh`        | [Z shell][zsh] commands
`#!/usr/bin/node`   | [Node.js][node] code
`#!/usr/bin/php`    | [PHP][php] code
`#!/usr/bin/python` | [Python][python] code
`#!/usr/bin/ruby`   | [Ruby][ruby] code

> Of course, the path to the interpreter must correspond to the actual path of the command used (`sh`, `bash`, `php`, etc).
> It might differ on your machine. Use `which bash` to find the location of the Bash executable, for example.



## What is shell scripting?

**Shell scripting** is the practice of writing scripts that contain series of shell commands that you want to be able to reuse.

Any script with a shell as the interpreter is a shell script.



## Shell script basics

<!-- slide-front-matter class: center, middle -->

> A few pointers on writing Bash scripts
> (compatible with most POSIX shells).

### Commands

You can use any shell command in a shell script:

```bash
#!/bin/bash
echo Hello World
date
ls
```

This script could print:

```
Hello World
Thu Jan 10 23:46:52 CET 2019
file.txt directory ...
```

### Working directory

By default, a script executes in the current shell directory.

You can use `cd` to move around to other directories:

```bash
#!/bin/bash
pwd
cd /home
pwd
```

This script could print:

```
/some/where/over/the/rainbow
/home
```

Assuming it was executed from the `/some/where/over/the/rainbow` directory.

### Variables

You can declare and reuse variables in scripts:

```bash
#!/bin/bash
FOO=bar
echo $FOO
```

If your variable contains whitespace (spaces, new lines, etc),
be sure to quote it when declaring and using it to avoid issues:

```bash
#!/bin/bash
FOO="bar baz"
echo "$FOO"
```

#### Store the output of commands

You can store the result of a command in a variable by wrapping it with backticks:

```bash
#!/bin/bash
FILES=\`ls -1`
NUMBER_OF_FILES=\`echo "$FILES" | wc -l`
echo There are $NUMBER_OF_FILES files
```

This script would output 10 if there are 10 files in the current directory.

#### Environment variables

Environment variables are also available as variables in shell scripts:

```bash
#!/bin/bash
echo $PATH
```

To set an environment variable, do it like you would in any Bash shell:

```bash
#!/bin/bash
export FOO=bar
```

> Of course, the `$FOO` environment variable in this example will only be set in the context of this script and its child processes (if any).

### Conditionals

Bash has a classic `if/then/else` construct:

```bash
#!/bin/bash
FOO="bar"

if [[ "$FOO" -eq "foo" ]]; then
  echo FOO is foo
elif [[ "$FOO" -eq "bar" ]]; then
  echo FOO is bar
else
  echo foo is something else
fi
```

> The `[[  ]]` syntax is a Bash [test construct][bash-test-constructs].
> Also see Bash [other comparison operators][bash-comparison-operators].

#### The `test` built-in command

The `test` command which comes with Bash is another way to write some conditions:

```bash
#!/bin/bash

EMPTY_VAR=
FULL_VAR="full"
FILE="/path/to/some/file"

if test -z "$EMPTY_VAR"; then
  echo variable is empty
fi

if test -n "$FULL_VAR"; then
  echo variable is not empty
fi

if test -f "$FILE"; then
  echo file exists
else
  echo file does not exist
fi
```

> See Bash [file test operators][bash-file-test-operators] and [other comparison operators][bash-comparison-operators].

### Loops

Bash has a `for` loop:

```bash
for item in one two three; do
  echo $item
done
```

The above code would print:

```
one
two
three
```

> Bash also has `while` and `until`.
> See [loops & branches][bash-loops].

### Special variables

Bash has a number of [special variables][bash-special-vars] which are always available:

Variable | Description
:---     | :---
`$0`     | Name of the command being executed.
`$1`     | First argument passed to the script on the command line (and so on with `$2`, `$3`, etc).
`$@`     | All arguments passed to the script.
`$?`     | Exit value of the last executed command.

For example, this script says hello to the name passed as the first argument:

```bash
#!/bin/bash
echo Hello $1
```

### The `set` built-in command

The `set` command is specific to Bash and can be used to toggle its [option flags][bash-option-flags].

For example, the `-e` option aborts the script if an error occurs, while the `-x` option prints commands before executing them:

```bash
#!/bin/bash
set -ex
echo Hello World
cat file-that-does-not-exist
echo Done
```

This script could print:

```
+ echo Hello World
Hello World
+ cat file-that-does-not-exist
cat: file-that-does-not-exist: No such file or directory
```

> Note that each command is printed with a leading `+` before being executed,
> and that the script stops as soon as an error occurs
> (which is **not the case by default**).

### Functions

You can isolate pieces of code in a function.
The special argument variables `$1`, `$2`, etc represent the arguments to the function:

```bash
#!/bin/bash

print_hello() {
  echo Hello $1
}

print_hello World
```

This script would print `Hello World`.

#### Variable scope

Note that normal Bash variables have no scope, i.e. they are available in the whole file and every function.

To declare a variable that is local to a function, use the `local` keyword:

```bash
#!/bin/bash

print_hello() {
  local name=$1
  echo Hello $name
}

print_hello World
echo $name
```

This script would print `Hello World` and an empty line,
since `$name` is only defined within the `print_hello` function.



## References

* [Advanced Bash Scripting Guide](https://www.tldp.org/LDP/abs/html/)
  * [Test Constructs][bash-test-constructs]
  * [File Test Operators][bash-file-test-operators]
  * [Other Comparison Operators][bash-comparison-operators]
  * [Loops & Branches][bash-loops]
  * [Local Variables][bash-locals]
* [Bash Special Variables][bash-special-vars]
* [Shebang][shebang]
* [Shell Script][shell-script]



[bash]: https://en.wikipedia.org/wiki/Bash_(Unix_shell)
[bash-comparison-operators]: https://www.tldp.org/LDP/abs/html/comparison-ops.html
[bash-file-test-operators]: https://www.tldp.org/LDP/abs/html/fto.html
[bash-locals]: https://www.tldp.org/LDP/abs/html/localvar.html
[bash-loops]: https://www.tldp.org/LDP/abs/html/loops.html
[bash-option-flags]: https://www.tldp.org/LDP/abs/html/options.html#OPTIONSREF
[bash-special-vars]: https://www.mylinuxplace.com/bash-special-variables/
[bash-test-constructs]: https://www.tldp.org/LDP/abs/html/testconstructs.html
[node]: https://nodejs.org
[php]: http://php.net
[python]: https://www.python.org
[ruby]: https://www.ruby-lang.org
[shebang]:https://en.wikipedia.org/wiki/Shebang_(Unix)
[sh]: https://en.wikipedia.org/wiki/Bourne_shell
[shell-script]: https://en.wikipedia.org/wiki/Shell_script
[zsh]: https://en.wikipedia.org/wiki/Z_shell
