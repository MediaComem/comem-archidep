# Hello SSH

In this series of exercises, you will learn to use the `ssh` command to connect
to a remote server, and how to copy files to and from such a server using
various tools.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Legend](#legend)
- [:exclamation: Connect to the exercise server](#exclamation-connect-to-the-exercise-server)
- [:question: Spot the difference](#question-spot-the-difference)
- [:exclamation: Copy a file with the `scp` command](#exclamation-copy-a-file-with-the-scp-command)
- [:exclamation: Copy a file using the SFTP protocol](#exclamation-copy-a-file-using-the-sftp-protocol)
- [:exclamation: Set up public key authentication](#exclamation-set-up-public-key-authentication)
  - [:books: The `ssh-keygen` command](#books-the-ssh-keygen-command)
  - [:question: Do I already have a key pair?](#question-do-i-already-have-a-key-pair)
  - [:exclamation: Generate a private-public key pair](#exclamation-generate-a-private-public-key-pair)
  - [:exclamation: Use `ssh-copy-id` to copy your public key to the server](#exclamation-use-ssh-copy-id-to-copy-your-public-key-to-the-server)
  - [:books: The `authorized_keys` file](#books-the-authorized_keys-file)
- [:space_invader: SSH agent](#space_invader-ssh-agent)
  - [:space_invader: Running an SSH agent](#space_invader-running-an-ssh-agent)
  - [:space_invader: Using the SSH agent](#space_invader-using-the-ssh-agent)

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

## :exclamation: Connect to the exercise server

An SSH exercise server has been prepared so that you can learn to use the `ssh`
command and other SSH-based tools. You should have received a username and
password for this course by email.

As we've seen, the basic syntax of the SSH command is as follows:

```bash
$> ssh <username>@<hostname>
```

To connect to the server:

* Write and execute the SSH command to connect to the exercise server. Replace
  the `<username>` placeholder by the username you received in your email, and
  the `<hostname>` placeholder by `archidep.ch`.
* Execute that command in your console.
* Enter or paste your password when prompted.

  > :books: The password's characters will not appear as you type or after
  > pasting. This is a feature, not a bug. Passwords are not displayed to make
  > it harder for someone looking over your shoulder to read them.

## :question: Spot the difference

Run the following commands on the server:

* `hostname`
* `whoami`

Open another console and run these commands again. Observe the difference in
output when you are connected to the server or running the commands on your
local machine.

Another interesting command to run to see the difference between your machine
and the server is the [`uname` command][uname-command]. Try running it on the
server and your machine. It has several options to get more information about
the machine it is running on.

> :gem: If you want to quickly run a command on a remote server with SSH and
> immediately disconnect, you can do so by providing more arguments to the
> SSH command:
>
>     ssh <username>@<hostname> [command]
>
> For example, assuming your username is `jdoe`, open a new console and execute
> the following commands:
>
>     ssh jdoe@archidep.ch hostname
>     hostname

## :exclamation: Copy a file with the `scp` command

Create a simple text file:

```bash
$> echo World > hello.txt
```

The [`cp` command][cp-command] copies a file locally:

```bash
$> cp hello.txt hello2.txt
```

Observe that the file has been copied:

```bash
$> ls
hello.txt
hello2.txt
...
```

In principle, the [`scp` command][scp-command] works like the Unix `cp` (copy)
command, except that it can copy files to and from other computers that have an
SSH server running, using the SSH syntax for connection:

```bash
$> scp hello.txt jdoe@archidep.ch:hello.txt
foo.txt 100% 4 0.6KB/s 00:00
```

This command copies your local `hello.txt` file to the home directory of the
`jdoe` user account on the remote server. You can check that the file was indeed
copied with a quick SSH command:

```bash
$> ssh jdoe@archidep.ch cat hello.txt
World
```

You can also copy files from the remote computer to your local computer:

```bash
$> scp jdoe@archidep.ch:hello.txt hello3.txt
hello.txt 100% 4 5.7KB/s 00:00

$> cat hello3.txt
World
```

> :gem: Here's a few additional examples of how to use the `scp` command:
>
> * `scp foo.txt jdoe@192.168.50.4:bar.txt`
>
>   Copy the local file `foo.txt` to a file named `bar.txt` in `jdoe`'s home
>   directory on the remote computer.
> * `scp foo.txt jdoe@192.168.50.4:`
>
>   Copy the file to `jdoe`'s home directory with the same filename.
> * `scp foo.txt jdoe@192.168.50.4:/tmp/foo.txt`
>
>   Copy the file to the absolute path `/tmp/foo.txt` on the remote computer.
> * `scp jdoe@192.168.50.4:foo.txt jsmith@192.168.50.5:bar.txt`
>
>   Copy the file from one remote computer to another.
> * `scp -r foo jdoe@192.168.50.4:foo`
>
>   Recursively copy the contents of directory `foo` to the remote computer.

## :exclamation: Copy a file using the SFTP protocol

[SFTP][sftp] is an alternative to the original [FTP][ftp] protocol to transfer
files. Since FTP is [insecure][ftp-security] (e.g. passwords are sent
unencrypted), SFTP is an alternative that goes through SSH's secure channel and
therefore poses fewer security risks.

Most modern FTP clients support SFTP. Here's a couple:

* [FileZilla][filezilla]
* [WinSCP][winscp]
* [Cyberduck][cyberduck] (macOS-only)

Many code editors also have SFTP support available through plugins.

## :exclamation: Set up public key authentication

### :books: The `ssh-keygen` command

The `ssh-keygen` command is usually installed along with SSH and can generate a
key pair for you. It will ask you a couple of questions about the key:

* Where do you want to save it? Simply press enter to use the proposed default
  location (`~/.ssh/id_rsa` for an RSA key, `~/.ssh/id_ed25519` for an Ed25519
  key, etc).
* What password do you want to protect the key with? Enter a password or simply
  press enter to use no password.

> **Should I protect my key with a password?**
>
> If you enter no password, your key will be stored in the clear. This will be
> convenient as you will not have to enter a password when you use it. However,
> any malicious code you allow to run on your machine could easily steal it.
>
> If your key is protected by a password, you can run an [SSH agent][ssh-agent]
> to unlock it only once per session instead of every time you use it.

### :question: Do I already have a key pair?

By default, SSH keys are stored in the `.ssh` directory in your home directory:

```bash
$> ls ~/.ssh
id_rsa  id_rsa.pub
```

If you have the `id_rsa` and `id_rsa.pub` files, you're good to go, since SSH
expects to find your main RSA private key at `~/.ssh/id_rsa`. (You might also
have a default key pair using another algorithm, such as an EcDSA key pair with
files named `id_ecdsa` and `id_ecdsa.pub`.)

If the directory doesn't exist or is empty, you don't have a key pair yet.

> You may have a key with a different name, e.g. `github_rsa` &
> `github_rsa.pub`, as is sometimes generated by some software. You can use this
> key if you want, but since it doesn't have the default name, you will have to
> add a `-i ~/.ssh/github_rsa` option to all your SSH commands. Generating a new
> key with the default name for command line use would probably be easier.

> On Windows, you can display hidden files to access your `.ssh` directory
> manually. On macOS, type `open ~/.ssh` in your Terminal.

### :exclamation: Generate a private-public key pair

Simply running `ssh-keygen` with no arguments will ask you the required
information and generate a new RSA key pair:

```bash
$> ssh-keygen
Generating public/private rsa key pair.
Enter file in which to save the key (/home/jdoe/.ssh/id_rsa):
Created directory '/home/jdoe/.ssh'.
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /home/jdoe/.ssh/id_rsa.
Your public key has been saved in /home/jdoe/.ssh/id_rsa.pub.
The key fingerprint is:
SHA256:MmwL9n4KOUCuLoyvGJ7nWRDXjTSGAXO8AcCNVqmDJH0 jdoe@497820feb22a
The key's randomart image is:
+---[RSA 2048]----+
|.o===oo+         |
|.=.oE++ +        |
|= oo .oo .       |
|.=  oo           |
|  +.o = S        |
| . o.= +         |
|=   +.o          |
|*o..o+  .        |
|+*+o  oo         |
+----[SHA256]-----+
```

### :exclamation: Use `ssh-copy-id` to copy your public key to the server

The `ssh-copy-id` uses the same syntax as the `ssh` command to connect to
another computer (e.g. `ssh-copy-id jdoe@192.168.50.4`). Instead of opening a
new shell, however, it will **copy your local public key(s) to your user
account's `authorized_keys` file** on the target computer.

You will probably have to enter your password, so `ssh-copy-id` can log in and
copy your key. But once that is done, **SSH should switch to public key
authentication** and you should not have to enter your password again to log in.
SSH will use your private key to authenticate you instead. (You may have to
enter your private key's password though, if it is protected by one.)

Log out and connect again with `ssh` to see it in action.

> You can also create the `authorized_keys` file manually. Note that both the
> file and its parent directory must have permissions that make it accessible
> only to your user account, or the SSH server will refuse to use it for
> security reasons. The following commands can set up the file on the target
> machine:
>
>     $> mkdir -p ~/.ssh && chmod 700 ~/.ssh
>     $> touch ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys

### :books: The `authorized_keys` file

To authenticate you, the SSH server will look for the **authorized keys** file
for your user account (there is one for each user). By default, the path to this
file is `~/.ssh/authorized_keys` on the computer where the SSH server is running
(not your local machine).

This file is simply a list of the public keys that should be granted access to
that account (provided that you can prove ownership of the key):

```
ssh-rsa AAAAB3NzaC1yc2E... key1
ssh-rsa fE2deXdtagpHXsa... key2
...
```

You can see its contents by running `cat ~/.ssh/authorized_keys` on the target
machine.

It may not exist yet if you have never authenticated with a public key.



## :space_invader: SSH agent

If you use a **private key that is password-protected**, you lose part of the
convenience of public key authentication: you don't have to enter a password to
authenticate to the server, but **you still have to enter the key's password**
to unlock it.

The `ssh-agent` command can help you there. It runs a helper program that will
let you unlock your private key(s) once, then use it multiple times without
entering the password again each time.

### :space_invader: Running an SSH agent

There are several ways to run an SSH agent. You can run it in the background:

* [Single sign-on using SSH][ssh-agent-run]
* [Generating a new SSH key and adding it to the ssh-agent
  (GitHub)][ssh-agent-run-github]

Or you can run an agent and have it start a new shell for you:

```bash
$> ssh-agent bash
```

> The advantage of this last technique is that the agent will automatically quit
> when you exit the shell, which is good since it's not necessarily a good idea
> to keep an SSH agent running forever [for security
> reasons][ssh-agent-security].

### :space_invader: Using the SSH agent

The associated `ssh-add` command will take your default private key (e.g.
`~/.ssh/id_rsa`) and prompt you for your password to unlock it:

```bash
$> ssh-add
Enter passphrase for /Users/jdoe/.ssh/id_rsa:
Identity added: /Users/jdoe/.ssh/id_rsa (/Users/jdoe/.ssh/id_rsa)
```

The **unlocked key** is now **kept in memory by the agent**. The `ssh` command
(and other SSH-related commands like `scp`) will not prompt you for that key's
password as long as the agent keeps running.

If you want to load another key than the default one, you can specify its path:

```bash
$> ssh-add /path/to/custom_id_rsa
```



[cp-command]: https://linuxize.com/post/cp-command-in-linux/
[cyberduck]: https://cyberduck.io
[filezilla]: https://filezilla-project.org/
[ftp]: https://en.wikipedia.org/wiki/File_Transfer_Protocol
[ftp-security]: https://en.wikipedia.org/wiki/File_Transfer_Protocol#Security
[scp-command]: https://linuxize.com/post/how-to-use-scp-command-to-securely-transfer-files/
[sftp]: https://en.wikipedia.org/wiki/SSH_File_Transfer_Protocol
[ssh-agent]: https://kb.iu.edu/d/aeww
[ssh-agent-run]: https://www.ssh.com/ssh/agent
[ssh-agent-run-github]: https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/
[ssh-agent-security]: https://www.commandprompt.com/blog/security_considerations_while_using_ssh-agent/
[uname-command]: https://linuxhint.com/linux-uname-command-tutorial/
[winscp]: https://winscp.net
