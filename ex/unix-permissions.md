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



## The exercise

* Create a file named `file.txt` in `alice`'s home directory that is readable by
  `alice` but not by you.

  **Solution**

  ```bash
  $> sudo touch /home/alice/file.txt
  $> sudo chown alice /home/alice/file.txt
  $> sudo chmod o-rwx /home/alice/file.txt
  ```

  **With octal mode**

  ```bash
  $> sudo chmod 640 /home/alice/file.txt
  ```
* Create a directory named `for_alice` in your home directory. The `alice` user
  must be able to traverse this directory, but not list its contents or create
  new files in it.

  **Solution**

  ```bash
  $> cd ~
  $> mkdir for_alice
  $> sudo chown john_doe:alice for_alice
  $> sudo chmod g=x,o-rwx for_alice
  ```

  **With octal mode**

  ```bash
  $> sudo chmod 710 for_alice
  ```
* The directory must contain a `readable.txt` file that `alice` can read from,
  but not write to.

  **Solution with access by other users**

  ```bash
  $> cd ~/for_alice
  $> echo "Hello, I'm readable" > readable.txt
  ```

  **Without access by other users**

  ```bash
  $> sudo chown john_doe:alice readable.txt
  $> sudo chmod o-rwx readable.txt
  ```

  **With octal mode**

  ```bash
  $> sudo chmod 640 readable.txt
  ```
* The directory must contain a `writable.txt` file that `alice` can read from
  and write to.

  **Solution**

  ```bash
  $> echo "Hello, I'm writable" > writable.txt
  $> sudo chmod o+w writable.txt
  ```

  **Without access by other users**

  ```bash
  $> sudo chown john_doe:alice writable.txt
  $> sudo chmod g+w,o-rwx writable.txt
  ```

  **With octal mode**

  ```bash
  $> sudo chmod 660 writable.txt
  ```



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

You should not be able to modify the `writable.txt` file in the `for_alice` directory:

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
