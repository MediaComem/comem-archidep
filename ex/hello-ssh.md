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

> Here's a few additional examples of how to use the `scp` command:
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

TODO



[cp-command]: https://linuxize.com/post/cp-command-in-linux/
[cyberduck]: https://cyberduck.io
[filezilla]: https://filezilla-project.org/
[ftp]: https://en.wikipedia.org/wiki/File_Transfer_Protocol
[ftp-security]: https://en.wikipedia.org/wiki/File_Transfer_Protocol#Security
[scp-command]: https://linuxize.com/post/how-to-use-scp-command-to-securely-transfer-files/
[sftp]: https://en.wikipedia.org/wiki/SSH_File_Transfer_Protocol
[uname-command]: https://linuxhint.com/linux-uname-command-tutorial/
[winscp]: https://winscp.net
