# Unix Permissions

This exercise illustrates how you can restrict access to files and directories
using Unix permissions.

Replace `john_doe` by your actual username.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Setup](#setup)
- [The exercise](#the-exercise)
- [Check if it works](#check-if-it-works)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Setup

Create a new `alice` user:

```bash
$> sudo useradd --create-home --shell /bin/bash alice
```

Make sure other users can access and list the contents of `alice`'s home
directory and your home directory:

```bash
$> sudo chmod o+rx /home/alice
$> sudo chmod o+rx /home/john_doe
```

## The exercise

- Create a file named `file.txt` in `alice`'s home directory that is readable by
  `alice` but not by you.
- Create a directory named `for_alice` in your home directory. The `alice` user
  must be able to traverse this directory, but not list its contents or create
  new files in it.
- The directory must contain a `readable.txt` file that `alice` can read from,
  but not write to.
- The directory must contain a `writable.txt` file that `alice` can read from
  and write to.

## Check if it works

You should not be able to read the file in `alice`'s home directory:

```bash
$> cat /home/alice/file.txt
cat: /home/alice/file.txt: Permission denied
```

Temporarily log in as `alice` (using your administrative privileges and the `su`
command, as in **s**witch **u**ser):

```bash
$> sudo su - alice
```

> When you are done, you can go back to being you with the `exit` command. Your
> command line prompt should remind you who you are. When in doubt, use the
> `whoami` command.

You should be able to read the file in the home directory:

```bash
$> cat /home/alice/file.txt
```

You should not be able to list the `for_alice` directory:

```bash
$> ls /home/john_doe/for_alice
ls: cannot open directory '/home/john_doe/for_alice/': Permission denied
```

You should not be able to create a file in the `for_alice` directory:

```bash
$> echo Hello > /home/john_doe/for_alice/file.txt
-bash: /home/john_doe/for_alice/file.txt: Permission denied
```

You should be able to read the `readable.txt` file in the `for_alice` directory:

```bash
$> cat /home/john_doe/for_alice/readable.txt
```

You should not be able to modify the `readable.txt` file in the `for_alice` directory:

```bash
$> echo "Hello, I'm Alice" >> /home/john_doe/for_alice/readable.txt
-bash: /home/john_doe/for_alice/readable.txt: Permission denied
```

You should be able to write to and read from the `writable.txt` file in the
`for_alice` directory:

```bash
$> echo "Hello, I'm Alice" >> /home/john_doe/for_alice/writable.txt

$> cat /home/john_doe/for_alice/writable.txt
Hello, I'm Alice
```

## Restore proper permissions

In newer Ubuntu versions, home directories are not accessible to other users
by default for improved security. Make sure to restore these restrictions at
least for your own user:

```bash
$> sudo chmod o-rwx /home/john_doe
```
