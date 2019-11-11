# System Administration Cheatsheet

Useful commands to manage a Unix system.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [How to I connect to my server with SSH?](#how-to-i-connect-to-my-server-with-ssh)
- [How do I change my password?](#how-do-i-change-my-password)
- [Administration](#administration)
  - [How do I create another user?](#how-do-i-create-another-user)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## How to I connect to my server with SSH?

* `ssh 1.2.3.4` connects you to the server at the IP address `1.2.3.4` with the
  same username as in your current terminal.
* `ssh john_doe@1.2.3.4` connects you to the same server as the `john_doe` user.



## How do I change my password?

```bash
$> passwd
```



## Administration

You must be an administrator (have `sudo` access) to perform the following
operations.



### How do I create another user?

```bash
$> useradd --create-home --shell /bin/bash jane-doe
```