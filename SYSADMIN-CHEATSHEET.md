# System Administration Cheatsheet

Useful commands to manage a Unix system.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [How to I connect to my server with SSH?](#how-to-i-connect-to-my-server-with-ssh)
- [How do I change my password?](#how-do-i-change-my-password)
- [Administration](#administration)
  - [How do I change my username?](#how-do-i-change-my-username)
  - [How do I create another user?](#how-do-i-create-another-user)
  - [How do I find and kill a naughty process?](#how-do-i-find-and-kill-a-naughty-process)
  - [The changes to my systemd service are not taken into account!](#the-changes-to-my-systemd-service-are-not-taken-into-account)
  - [My systemd service is not working!](#my-systemd-service-is-not-working)
- [My `post-receive` Git hook is not executing!](#my-post-receive-git-hook-is-not-executing)
- [Add swap space to your cloud server](#add-swap-space-to-your-cloud-server)

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

### How do I change my username?

The following command renames the `oldname` user account into `newname` and also
renames the user's home directory at the same time:

```bash
$> sudo usermod --login newname --home /home/newname --move-home oldname
```

You also have to rename the associated group:

```bash
$> sudo groupmod --new-name newname oldname
```

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
$> git push foo main
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



## Add swap space to your cloud server

The cloud servers used in this course do not have enough memory (RAM) to
run/compile many things at once. But you can easily add **swap space** to solve
this issue.

> [Swap
> space](https://web.mit.edu/rhel-doc/5/RHEL-5-manual/Deployment_Guide-en-US/ch-swapspace.html)
> in Linux is used when the amount of physical memory (RAM) is full. If the
> system needs more memory resources and the RAM is full, inactive pages in
> memory are moved to the swap space.

Adding 2 gigabytes of swap space should be enough for our purposes.

Run the following commands to make sure you disable any previous swap file you
might have created during the exercises:

```bash
# (It's okay if this command produces an error.)
$> sudo swapoff /swapfile
$> sudo rm -f /swapfile
```

Use the following commands to create and mount a 2-gigabyte swap file:

```bash
$> sudo fallocate -l 2G /swapfile
$> sudo chmod 600 /swapfile
$> sudo mkswap /swapfile
$> sudo swapon /swapfile
```

You can verify that the swap space is correctly mounted by displaying available
memory with the `free -h` command. You should see the `Swap` line indicating the
amount of swap space you have added:

```bash
$> free -h
              total        used        free      shared  buff/cache   available
Mem:          914Mi       404Mi       316Mi        31Mi       193Mi       331Mi
Swap:         2.0Gi       200Mi       1.8Gi
```

This swap space is temporary by default and will only last until your reboot
your server. To make it permanent, you must tell your server to mount it on
boot.

You can see the currently configured mounts with this command (the output may
not be exactly the same):

```bash
$> cat /etc/fstab
# CLOUD_IMG: This file was created/modified by the Cloud Image build process
UUID=b1983cef-43a3-46ac-a083-b5e06a61c9fd       /        ext4   defaults,discard        0 1
UUID=0BC7-08EF  /boot/efi       vfat    umask=0077      0 1
/dev/disk/cloud/azure_resource-part1    /mnt    auto    defaults,nofail,x-systemd.requires=cloud-init.service,comment=cloudconfig       0       2
```

:warning: :warning: :warning: **WARNING: BE VERY CAREFUL TO EXECUTE THE
FOLLOWING COMMAND EXACTLY AS IS.** *(Corrupting your `/etc/fstab` file can
prevent your server from rebooting.)* :warning: :warning: :warning:

To make the swap space permanent, execute the following command to add the
appropriate line to your server's `/etc/fstab` file:

```bash
$> echo "/swapfile none swap sw 0 0" | sudo tee -a /etc/fstab
```

This line tells your server to mount the swap file you have created as swap
space on boot. You should see the new line at the end of the `/etc/fstab` file
if you display its contents again:

```bash
$> cat /etc/fstab
# CLOUD_IMG: This file was created/modified by the Cloud Image build process
UUID=b1983cef-43a3-46ac-a083-b5e06a61c9fd       /        ext4   defaults,discard        0 1
UUID=0BC7-08EF  /boot/efi       vfat    umask=0077      0 1
/dev/disk/cloud/azure_resource-part1    /mnt    auto    defaults,nofail,x-systemd.requires=cloud-init.service,comment=cloudconfig       0       2
/swapfile none swap sw 0 0
```

**IF it looks correct**, reboot your server:

```bash
$> sudo reboot
```

Reconnect to your server over SSH and run the `free -h` command again. The swap
space should still be enabled after reboot:

```bash
$> free -h
              total        used        free      shared  buff/cache   available
Mem:          914Mi       404Mi       316Mi        31Mi       193Mi       331Mi
Swap:         2.0Gi       200Mi       1.8Gi
```

You should also be able to see the available swap space and how much is used
with the `htop` command which shows it as the `Swp` bar at the top (you can quit
it with `q` once it is open).

> For more information, see the [fstab Linux man
> page](https://man7.org/linux/man-pages/man5/fstab.5.html) and [How to Add Swap
> Space on Ubuntu
> 20.04](https://www.digitalocean.com/community/tutorials/how-to-add-swap-space-on-ubuntu-20-04).



[sftp-deploy-ex]: ./ex/sftp-deployment.md
