# Advanced Packaging Tool

Learn what the Advanced Packaging Tool (APT) is and the basics of its `apt` command.

<!-- slide-include ../../BANNER.md -->

**You will need**

* A Unix CLI
* An Ubuntu operating system

**Recommended reading**

* [Unix Administration](../unix-admin/)

<!-- START doctoc -->
<!-- END doctoc -->





## What is APT?

<!-- slide-front-matter class: center, middle -->

> **Advanced Package Tool (APT)** handles the installation and removal of software on [Debian][debian], [Ubuntu][ubuntu] and other [Linux][linux] distributions.
> It automates the retrieval and configuration of software packages, either from precompiled files or by compiling source code.



### Why use a package manager?

* Use tools that **other developers** have written to solve particular problems.
* Regularly check if there are any **upgrades** and download them.
* **Share** your own tools with the community to **reuse** functionality.

<p class='center'><img src='images/shoulders-of-giants.jpg' width='100%' /></p>



### There are many package managers

For **operating systems**:

Package manager                          | OS
:---                                     | :---
[Advanced Package Tool (APT)][apt]       | Debian, Ubuntu
[Homebrew (brew)][homebrew]              | Mac OS X
[Yellowdog Updater, Modified (yum)][yum] | RHEL, Fedora, CentOS

For **programming languages**:

Package manager      | Language
:---                 | :---
[Composer][composer] | PHP
[Maven][maven]       | Java
[npm][npm]           | Node.js
[RubyGems][rubygems] | Ruby
[pip][pip]           | Python



### Package lists

To see available packages for each distribution, you can go there:

* [Debian packages][debian-packages]
* [Ubuntu packages][ubuntu-packages]





## The `apt` command line

<!-- slide-front-matter class: center, middle -->

<img class='w70' src='images/apt.png' />



### The `apt list` command

Running `apt list` will display all available packages, which will be quite a long list:

```bash
$> `apt list | wc -l`
61613
```

You can display already installed packages by adding the `--installed` option:

```bash
$> `apt list --installed | wc -l`
510

$> `apt list --installed`
Listing...
accountsservice/bionic,now 0.6.45-1ubuntu1 amd64 [installed]
acl/bionic,now 2.2.52-3build1 amd64 [installed]
acpid/bionic,now 1:2.0.28-1ubuntu1 amd64 [installed]
...
```



### The `apt search` command

Search for new packages to install using the `apt search <name>` command.

For example, you could run this command if you need to install the `nc` (netcat) command:

```bash
$> `apt search netcat`
Sorting... Done
Full Text Search... Done
...

netcat/bionic 1.10-41.1 all
  TCP/IP swiss army knife -- transitional package

...
```

Or you could search for the MySQL database:

```bash
$> `apt search mysql`
...
```

Of course, it will also find all packages related to MySQL (which will be a lot).



### The `apt show` command

Get detailed information about a package before installing it with the `apt show <name>` command:

```bash
$> `apt show mysql-server`
Package: mysql-server
Version: 5.7.24-0ubuntu0.18.04.1
Priority: optional
Section: database
Installed-Size: 110 kB
Download-Size: 9,948 B
Homepage: http://dev.mysql.com/
...
Description: MySQL database server (metapackage depending on the latest version)
 ...
 MySQL is a fast, stable and true multi-user, multi-threaded SQL database
 server. SQL (Structured Query Language) is the most popular database query
 language in the world. The main goals of MySQL are speed, robustness and
 ease of use.
```



### The `apt install` command

The `apt install <name>...` command will download, configure and install a new package (or multiple packages).

Of course, not any user can do this:

```bash
$> `apt install cowsay`
E: Could not open lock file ... (13: Permission denied)
E: Unable to acquire the dpkg frontend lock (...), are you root?
```

#### Installing with superuser privileges

The `apt install` command requires **superuser privileges** to install anything.

Try it again with `sudo`:

```bash
$> `sudo apt install cowsay`
Reading package lists... Done
Building dependency tree
Reading state information... Done
Suggested packages:
  filters cowsay-off
The following NEW packages will be installed:
  cowsay
0 upgraded, 1 newly installed, 0 to remove and 4 not upgraded.
Need to get 17.7 kB of archives.
After this operation, 89.1 kB of additional disk space will be used.
Get:1 ... cowsay all 3.03+dfsg2-4 [17.7 kB]
Fetched 17.7 kB in 0s (271 kB/s)
Selecting previously unselected package cowsay.
(Reading database ... 84877 files and directories currently installed.)
Preparing to unpack .../cowsay_3.03+dfsg2-4_all.deb ...
Unpacking cowsay (3.03+dfsg2-4) ...
Setting up cowsay (3.03+dfsg2-4) ...
Processing triggers for man-db (2.8.3-2ubuntu0.1) ...
```

#### Using new packages

The package you just installed provides the very useful [`cowsay`][cowsay] command.

Try it out:

```bash
$> `cowsay hello world`
 _____________
< hello world >
 -------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
```

#### Installing more complex (and useful) packages

The previous example was a very simple script which was easy to install.

You will often install bigger packages, like for example a [Java Development Kit (JDK)][jdk] to run Java applications.
This kind of package has **dependencies**, meaning that it needs other packages in order to function.

For example, the [`default-jdk`][default-jdk] package, which installs a JDK, requires:

* The [`default-jre`][default-jre] package which provides a [Java Runtime Environment (JRE)][jre].
* The [`fontconfig`][fontconfig] package which is a font configuration library.
* The [`libcups2`][libcups2] package which provides Unix printing utilities.
* And many others...

#### Confirming installation

When installing such a package, APT will list the dependencies that will be installed **in addition to the package your requested**,
and ask for your confirmation:

```bash
$> `sudo apt install default-jdk`
Reading package lists... Done
Building dependency tree
Reading state information... Done
*The following additional packages will be installed:
* adwaita-icon-theme at-spi2-core ca-certificates-java ...
Suggested packages:
  default-java-plugin libasound2-plugins alsa-utils colord ...
0 upgraded, 145 newly installed, 0 to remove and 4 not upgraded.
Need to get 164 MB of archives.
After this operation, 574 MB of additional disk space will be used.
*Do you want to continue? [Y/n] n
Abort.
```



### The `apt update` command

You might have noticed that the `list` and `show` commands are quite fast.
That's because they **don't fetch any data from the network**:
the package lists and package information is stored locally on the computer.

Of course, **this local information becomes out of date** as new package versions are released to the official package repositories.
You can update your local information with `apt update` (which requires superuser privileges):

```bash
$> `sudo apt update`
Get:1 http://security.ubuntu.com/ubuntu bionic-security InRelease [83.2 kB]
Hit:2 http://eu-west-2.ec2.archive.ubuntu.com/ubuntu bionic InRelease
Get:3 http://eu-west-2.ec2.archive.ubuntu.com/ubuntu ... [88.7 kB]
Get:4 http://eu-west-2.ec2.archive.ubuntu.com/ubuntu ... [74.6 kB]
...
Fetched 2,400 kB in 1s (3,706 kB/s)
Reading package lists... Done
Building dependency tree
Reading state information... Done
4 packages can be upgraded. Run 'apt list --upgradable' to see them.
```

You now have up-to-date information about all available packages.

#### Checking for package updates

As you may have seen, `apt update` will helpfully tell you if there are any new versions available for the packages you already installed:

```bash
4 packages can be upgraded. Run 'apt list --upgradable' to see them.
```

As indicated, you can run the `apt list --upgradable` command to list those available upgrades and decide whether you want to install them or not:

```bash
$> `apt list --upgradable`
Listing... Done
python3-software-properties/bionic-updates 0.96.24.32.6 all
  [upgradable from: 0.96.24.32.5]
python3-update-manager/bionic-updates 1:18.04.11.8 all
  [upgradable from: 1:18.04.11.7]
software-properties-common/bionic-updates 0.96.24.32.6 all
  [upgradable from: 0.96.24.32.5]
update-manager-core/bionic-updates 1:18.04.11.8 all
  [upgradable from: 1:18.04.11.7]
```



### The `apt upgrade` and `apt full-upgrade` commands

When you have packages to upgrade, you could of course manually `apt install` each of them,
but there are also two helpful commands that can do it for you:

* `apt upgrade`

  This command will upgrade all packages that have new versions,
  installing any new dependencies that may be required.

  However, it will behave conservatively and **never remove packages that are currently installed**.
  This is to avoid problems in case new versions of your installed packages have widely different dependencies.
* `apt full-upgrade`

  This command will do the same as `apt upgrade`, but in addition,
  it will automatically remove any packages that were dependencies of previous versions of your packages
  but are no longer needed by the new versions.

The second is "more dangerous" as you have to make sure that none of the removed packages will impact your computer.
Use it with caution.

#### Upgrading packages

The `apt upgrade` and `apt full-upgrade` commands will always ask for confirmation before
upgrading, installing or removing any package:

```bash
$> `sudo apt upgrade`
Reading package lists... Done
Building dependency tree
Reading state information... Done
Calculating upgrade... Done
*The following packages will be upgraded:
* python3-software-properties python3-update-manager
* software-properties-common update-manager-core
4 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.
Need to get 75.6 kB of archives.
After this operation, 0 B of additional disk space will be used.
*Do you want to continue? [Y/n] n
Abort.
```

> **A word of caution:**
> do not install or upgrade packages without at least a basic understanding of what they do
> and how they might be used by your operating system and applications.
> Otherwise you risk breaking your system.

#### Rebooting after an upgrade

Some packages can be upgraded in place.
Other packages may **require the computer to be restarted** for the upgrade to take effect.

When that is the case, there will be a warning on the shell every time you connect:

```bash
$> ssh user@example.com
Welcome to Ubuntu
...
**** System restart required ***
```

This means that the upgrade process will only be complete once you restart the computer with `sudo reboot`.



### The `apt remove` command

You can remove a package with the `apt remove <name>` command.
It will always ask for confirmation:

```bash
$> `sudo apt remove cowsay`
Reading package lists... Done
Building dependency tree
Reading state information... Done
*The following packages will be REMOVED:
*  cowsay
0 upgraded, 0 newly installed, 1 to remove and 4 not upgraded.
After this operation, 89.1 kB disk space will be freed.
*Do you want to continue? [Y/n] n
Abort.
```

This command will uninstall binaries but not configuration files.
Use `apt purge <name>` to also remove the configuration files.



### The `apt autoremove` command

The `apt autoremove` command cleans up packages that were previously required but are no longer useful.

Most of the time, there will probably be nothing to remove:

```bash
$> `sudo apt autoremove`
Reading package lists... Done
Building dependency tree
Reading state information... Done
0 upgraded, 0 newly installed, 0 to remove and 4 not upgraded.
```

> It's good practice to run it after an upgrade and reboot,
> to make sure there are no unused packages taking up space on the computer.



### The `apt-get` and `apt-cache` commands

The `apt` command is actually a higher-level frontend to the older and lower-level `apt-get` and `apt-cache` command.
`apt` is simpler to user, but you will find many examples of these older commands on the internet.

They are mostly equivalent:

`apt` command      | older equivalent
:---               | :---
`apt list`         | `dpkg -l`
`apt search`       | `apt-cache search`
`apt install`      | `apt-get install`
`apt update`       | `apt-get update`
`apt upgrade`      | `apt-get upgrade`
`apt full-upgrade` | `apt-get dist-upgrade`

> You can also see these equivalent commands with `man apt`.





## Reference

* [`man apt`](http://manpages.ubuntu.com/manpages/xenial/man8/apt.8.html)
* [Using apt commands in Linux](https://itsfoss.com/apt-command-guide/)





[apt]: https://wiki.debian.org/Apt
[composer]: https://getcomposer.org/
[cowsay]: https://en.wikipedia.org/wiki/Cowsay
[debian]: https://www.debian.org/
[debian-packages]: https://www.debian.org/distrib/packages
[default-jdk]: https://packages.ubuntu.com/bionic/default-jdk
[default-jre]: https://packages.ubuntu.com/bionic/default-jre
[fontconfig]: https://packages.ubuntu.com/bionic/fontconfig
[homebrew]: https://brew.sh/
[jdk]: https://en.wikipedia.org/wiki/Java_Development_Kit
[jre]: https://en.wikipedia.org/wiki/Java_virtual_machine#Java_Runtime_Environment
[libcups2]: https://packages.ubuntu.com/bionic/libcups2
[linux]: https://en.wikipedia.org/wiki/Linux
[maven]: https://maven.apache.org/
[npm]: https://www.npmjs.com/
[pip]: https://pypi.org/project/pip/
[rubygems]: https://rubygems.org/
[ubuntu]: https://www.ubuntu.com/
[ubuntu-packages]: https://packages.ubuntu.com/
[yum]: http://yum.baseurl.org/
