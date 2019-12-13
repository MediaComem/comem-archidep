# System Administration Cheatsheet

Useful commands to manage a Unix system.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [How to I connect to my server with SSH?](#how-to-i-connect-to-my-server-with-ssh)
- [How do I change my password?](#how-do-i-change-my-password)
- [Administration](#administration)
  - [How do I create another user?](#how-do-i-create-another-user)
  - [How do I find and kill a naughty process?](#how-do-i-find-and-kill-a-naughty-process)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## How to I connect to my server with SSH?

Connect to the server at the IP address `1.2.3.4` as the `john_doe` user:

```bash
$> ssh john_doe@1.2.3.4
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



[sftp-deploy-ex]: ./ex/sftp-deployment.md
