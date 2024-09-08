# Unix Permissions

This exercise illustrates how you can restrict access to files and directories
using Unix permissions.

Replace `jde` by your actual username.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Legend](#legend)
- [:exclamation: Setup](#exclamation-setup)
- [:exclamation: The exercise](#exclamation-the-exercise)
- [:question: Check if it works](#question-check-if-it-works)
- [:checkered_flag: What have I done?](#checkered_flag-what-have-i-done)

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



## :exclamation: Setup

Create a new `alice` user:

```bash
$> sudo useradd --create-home --shell /bin/bash alice
```

Make sure other users can access and list the contents of `alice`'s home
directory:

```bash
$> sudo chmod o+rx /home/alice
```



## :exclamation: The exercise

- Create a file named `file.txt` in `alice`'s home directory that is readable by
  `alice` but not by you.
- Create a directory named `for_alice` in the system's temporary directory
  (`/tmp`). The `alice` user must be able to traverse this directory, but not
  list its contents or create new files in it.
- The directory must contain a `readable.txt` file that `alice` can read from,
  but not write to.
- The directory must contain a `writable.txt` file that `alice` can read from
  and write to.



## :question: Check if it works

You should not be able to read the file in `alice`'s home directory:

```bash
$> cat /home/alice/file.txt
cat: /home/alice/file.txt: Permission denied
```

Temporarily log in as `alice` (using your administrative privileges and the `su`
command, as in **s**witch **u**ser):

```bash
$> sudo su --login alice
```

> :gem: When you are done, you can go back to being you with the `exit` command. Your
> command line prompt should remind you who you are. When in doubt, use the
> `whoami` command.
>
> :books: The `--login` option can also be abbreviated to `-l` or even simply
> `-` (yes, the people who designed Unix were lazy enough that they did not even
> want to type one more letter).

You should be able to read the file in the home directory:

```bash
$> cat /home/alice/file.txt
```

You should not be able to list the `for_alice` directory:

```bash
$> ls /tmp/for_alice
ls: cannot open directory '/tmp/for_alice/': Permission denied
```

You should not be able to create a file in the `for_alice` directory:

```bash
$> echo Hello > /tmp/for_alice/file.txt
-bash: /tmp/for_alice/file.txt: Permission denied
```

You should be able to read the `readable.txt` file in the `for_alice` directory:

```bash
$> cat /tmp/for_alice/readable.txt
```

You should not be able to modify the `readable.txt` file in the `for_alice` directory:

```bash
$> echo "Hello, I'm Alice" >> /tmp/for_alice/readable.txt
-bash: /tmp/for_alice/readable.txt: Permission denied
```

You should be able to write to and read from the `writable.txt` file in the
`for_alice` directory:

```bash
$> echo "Hello, I'm Alice" >> /tmp/for_alice/writable.txt

$> cat /tmp/for_alice/writable.txt
Hello, I'm Alice
```

> :books: As a reminder, in Bash, `>>` means to redirect the standard output of
> a command into a file and to append to the end of that file. If you wanted to
> overwrite the whole contents of the file, you could use `>` instead.



## :checkered_flag: What have I done?

You have learned to open or restrict access to files in a Unix system by
judicious use of the `chown` and `chmod` commands to change ownership and/or
permissions.

You have also practiced using some of the other Unix file-related commands you
have learned about so far.
