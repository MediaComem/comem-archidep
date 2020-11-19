# Manage a PHP application with systemd as a Process Manager

This guide describes how to create a [systemd][systemd] service to run the PHP application.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Setup](#setup)
- [Create a systemd unit configuration file](#create-a-systemd-unit-configuration-file)
- [Enable and start the todolist service](#enable-and-start-the-todolist-service)
  - [Troubleshooting](#troubleshooting)
- [Reboot and try again](#reboot-and-try-again)
- [What have I done?](#what-have-i-done)
- [End result](#end-result)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## Setup

Make sure you have completed the [previous
exercise](config-through-environment.md).

Stop your `php -S` command if it is still running.



## Create a systemd unit configuration file

You must write a systemd unit file which describes how and when to run the
application. You may save this file to `/etc/systemd/system/todolist.service`.
You will have to use nano (or Vim) to create and edit this file directly on the
server. You cannot use an SFTP client.

> **Reminder:** You can edit a file with nano by running the following command:
> `nano <path>`. If the file does not exist, it will be created by nano when you
> exit and save.
>
> You cannot use FileZilla because the `/etc/systemd/system` directory is owned
> by the `root` user, and you cannot connect with `root` over SFTP as that is
> considered insecure and therefore not allowed by the default configuration of
> the SSH server.

You may find the following documentation useful to write your unit file:

* [`[Unit]` section
  options](https://www.freedesktop.org/software/systemd/man/systemd.unit.html#%5BUnit%5D%20Section%20Options)
* [`[Service]` section
  options](https://www.freedesktop.org/software/systemd/man/systemd.service.html#Options)
* [`[Install]` section
  options](https://www.freedesktop.org/software/systemd/man/systemd.unit.html#%5BInstall%5D%20Section%20Options)
* [Environment](https://www.freedesktop.org/software/systemd/man/systemd.exec.html#Environment)
  (for the `Environment`, `User` and `WorkingDirectory` options in the `[Service]`
  section)

Here are a few hints:

* In the `[Unit]` section of your unit file:
  * You should briefly document what your service is with a `Description`
    option.
  * You may want to use an `After` option. What other service needs to already
    be running for the PHP TodoList to work? If there is one, your application
    should start after it.

    > **Hint:** You can use the `ls /lib/systemd/system` command to list
    > other system services.
* In the `[Service]` section of your unit file:
  * You should tell systemd what command to run your application with using the
    `ExecStart` option.

    > **Hint:** You must use absolute command paths with `ExecStart`. For
    > example, if you want to execute the `php` command, you cannot simply write
    > `php`, you have to use the absolute path to the command instead.
    >
    > You can find the path to any binary with the `which <command>` command.
  * You must tell systemd where to execute the command (in which directory) with
    the `WorkingDirectory` option. This must be an absolute path.

    > **Hint:** Go in the application directory on the server and execute the
    > `pwd` (print working directory) command if you are not sure what the
    > absolute path is.
  * You should tell systemd which user must run the command with the `User`
    option. You can use your own username.

    > It's bad practice to run an application with the `root` user. An
    > application running as the `root` user that has any security flaw could
    > allow an attacker to gain superuser privileges, and thus obtain complete
    > control over your server.
    >
    > To go further, you could create a system user specifically to run this
    > application. This would allow you to limit that user's privileges, also
    > limiting the damage an attacker could make if your application is
    > compromised.
  * If your application requires one or multiple environment variables to be
    set, you can set them by adding an `Environment` option. This option can be
    included in the file multiple times to set multiple environment variables.
  * In case your application crashes due to a bug or a server issue, you should
    configure the `Restart` option so that systemd automatically restarts it
    when there is a problem.
* In the `[Install]` section of your unit file:
  * You may want to set the `WantedBy` option to tell systemd to automatically
    start your application when the server boots. You can use the value
    `multi-user.target` for this option.

    > `multi-user.target` means that the operating system has reached the
    > multi-user [runlevel](https://en.wikipedia.org/wiki/Runlevel). In other
    > words, it means that user management and networking have been initialized.
    > This is typically when you want to start running other processes which
    > depend on users and/or networking, like web applications.

> **Hint:** You should put comments in your unit file to explain what each
> option is for. This can help you if you come back later and do not remember
> what you did or why. Any line starting with `#` is considered a comment.



## Enable and start the todolist service

Enable and start your new service.

> **Reminder:** The systemd control command (`systemctl`) allows you to
> manipulate services: `sudo systemctl <operation> <service-name>`.
>
> The operations to enable and start are simply `enable` and `start`. The name
> of the service is the name of your unit file without the ".unit" extension.
> For example, if the unit file is "todolist.service", the name of your service
> is "todolist".

Check that the service is running properly and there were no errors.

> You can also use the `systemctl` command to check the status of your service
> with its `status` operation (instead of `enable` or `start`).

You (and everybody else) should be able to access the running todolist
application in your browser on your server's IP address and port 3000 (e.g.
`W.X.Y.Z:3000`).

### Troubleshooting

If the status indicates a problem with your unit file, you should fix the
problem in your unit file. Then, be sure to run `sudo systemctl daemon-reload`
to take the changes into account.



## Reboot and try again

If you have configured your unit file correctly, your application should restart
automatically if the server is rebooted.

Try to reboot your server:

```bash
$> sudo reboot
```

The application should still be running.



## What have I done?

You have configured your operating system's process manager (systemd, which
comes bundled with Ubuntu) to manage your application's lifecycle for you. You
no longer have to worry about:

* Running the command to start the application.
* Restarting the application after rebooting the server.
* Restarting the application after it crashes due to a bug.



## End result

![Diagram](systemd-deployment.png)

> [PDF version](systemd-deployment.pdf).



[systemd]: https://en.wikipedia.org/wiki/Systemd
