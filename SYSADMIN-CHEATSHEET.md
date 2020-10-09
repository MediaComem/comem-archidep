# System Administration Cheatsheet

Useful commands to manage a Unix system.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [How to I connect to my server with SSH?](#how-to-i-connect-to-my-server-with-ssh)
- [How do I change my password?](#how-do-i-change-my-password)
- [Administration](#administration)
  - [How do I create another user?](#how-do-i-create-another-user)
  - [How do I find and kill a naughty process?](#how-do-i-find-and-kill-a-naughty-process)
  - [The changes to my systemd service are not taken into account!](#the-changes-to-my-systemd-service-are-not-taken-into-account)
  - [My systemd service is not working!](#my-systemd-service-is-not-working)
- [My `post-receive` Git hook is not executing!](#my-post-receive-git-hook-is-not-executing)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## How to I connect to my server with SSH?

Connect to the server at the IP address `W.X.Y.Z` as the `john_doe` user:

```bash
$> ssh john_doe@W.X.Y.Z
```



## How do I change my password?

```bash
$> passwd
```



## Administration

You must be an administrator (have `sudo` access) to perform the following
operations.

### How do I create another user?

```bash
$> useradd --create-home --shell /bin/bash jane_doe
```

### How do I find and kill a naughty process?

You might need this if you lost your SSH connection after you launched a process
which listens on a port, e.g. 3000. If the process still runs, the port is no
longer available. This could happen, for example, in the ["Deploy a PHP
application with SFTP" exercise][sftp-deploy-ex].

Find the process with `ps` and `grep`:

```bash
$> ps -ef | grep php
root     20942     1  0 Dec06 ?        00:00:24 php-fpm: master process (/etc/php/7.2/fpm/php-fpm.conf)
www-data 20960 20942  0 Dec06 ?        00:00:00 php-fpm: pool www
www-data 20961 20942  0 Dec06 ?        00:00:00 php-fpm: pool www
john_doe 26378 26365  0 10:02 pts/0    00:00:00 php -S 0.0.0.0:3000
```

In this example based on the ["Deploy a PHP application with SFTP"
exercise][sftp-deploy-ex], the process that interests you is the fourth one,
which was launched by the `php -S 0.0.0.0:3000` command as shown in the last
column, and has the Process ID `26378`. The other PHP processes are unrelated to
what you were doing, so you should not touch them.

Now that you have the ID of the naughty process, you can kill it:

```bash
$> kill 26378
```

If you check the list of processes again, it should no longer be there. If it
does not want to die, you can kill it more violently:

```bash
$> kill -KILL 26378
```

### The changes to my systemd service are not taken into account!

Every time you change a systemd unit file, you must tell systemd to reload its
configuration with the following command:

```bash
sudo systemctl daemon-reload
```

You should also restart your service. Assuming it is defined by the file
`/etc/systemd/system/foo.service`, you can do so with the following command:

```bash
sudo systemctl restart foo
```

### My systemd service is not working!

Assuming your service is defined by the file `/etc/systemd/system/foo.service`,
you should first check its status with the following command:

```bash
sudo systemctl status foo
```

This shows you whether your service is active (running) and whether it is
enabled (to restart at boot). When there is a problem, it may also show you the
error that caused to the service to fail to start.

If you cannot find a clear problem from the status information, you should look
at the system logs for that service:

```bash
sudo journalctl -u foo
```

Not all services log there, however. If `journalctl` displays no log entries,
you should look in the standard Linux log directory `/var/log` for a file or a
directory named after your service. For example, nginx stores its error logs in
`/var/log/nginx/error.log` by default.

If your service cannot start, you should be able to find an error from one of these sources.



## My `post-receive` Git hook is not executing!

When you push to a remote (`foo` in this example), you may get this message:

```bash
$> git push foo master
Everything up-to-date
```

This means that you have no new commits to push. Therefore the `post-receive`
hook is not triggered since nothing new was received by the repository on the
server.

You need to make and commit a change before you push, so that new commits will
be sent.

> If you have no changes to make and just want to test your hook, you may also
> create an empty commit with the following command:
>
> ```bash
> git commit --allow-empty -m "Test hook"
> ```
>
> This will give you a new commit to push without actually making a change.



[sftp-deploy-ex]: ./ex/sftp-deployment.md
