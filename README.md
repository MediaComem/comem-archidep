# COMEM+ Architecture & Deployment course

In this course you will learn:

* How to deploy applications on a Linux server on an IaaS platform (Amazon Web Services).
* How to deploy applications on a PaaS platform (Heroku).

In pursuit of this goal, you will learn:

* How to use the command line and version control.
* The basics of Unix system administration and cloud computing architectures.
* Good security practices related to system administration and web applications.

This course is a [COMEM+][comem] [web development course][comem-webdev] taught at [HEIG-VD][heig].

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Plan](#plan)
- [What you will need](#what-you-will-need)
- [Exercises](#exercises)
- [Useful links](#useful-links)
- [References](#references)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## Plan

* Introduction
  * [Command line](https://mediacomem.github.io/comem-archidep/2021-2022/subjects/cli?home=MediaComem%2Fcomem-archidep%23readme)
  * [Secure Shell (SSH)](https://mediacomem.github.io/comem-archidep/2021-2022/subjects/ssh?home=MediaComem%2Fcomem-archidep%23readme)
* Version control
  * [Version control with Git](https://mediacomem.github.io/comem-archidep/2021-2022/subjects/git?home=MediaComem%2Fcomem-archidep%23readme)
  * [Git branching](https://mediacomem.github.io/comem-archidep/2021-2022/subjects/git-branching?home=MediaComem%2Fcomem-archidep%23readme)
  * [Collaborating with Git](https://mediacomem.github.io/comem-archidep/2021-2022/subjects/git-collaborating?home=MediaComem%2Fcomem-archidep%23readme)
* Security
  * [Open Web Application Security Project][owasp]
  * [OWASP Top 10 - The Ten Most Critical Web Application Security Risks][owasp-top10]
* Basic deployment
  * [Cloud computing](https://mediacomem.github.io/comem-archidep/2021-2022/subjects/cloud?home=MediaComem%2Fcomem-archidep%23readme)
  * [Linux](https://mediacomem.github.io/comem-archidep/2021-2022/subjects/linux?home=MediaComem%2Fcomem-archidep%23readme)
  * [Unix basics & administration](https://mediacomem.github.io/comem-archidep/2021-2022/subjects/unix-admin?home=MediaComem%2Fcomem-archidep%23readme)
  * [Unix processes](https://mediacomem.github.io/comem-archidep/2021-2022/subjects/unix-processes?home=MediaComem%2Fcomem-archidep%23readme)
  * [Unix networking](https://mediacomem.github.io/comem-archidep/2021-2022/subjects/unix-networking?home=MediaComem%2Fcomem-archidep%23readme)
  * [APT](https://mediacomem.github.io/comem-archidep/2021-2022/subjects/apt?home=MediaComem%2Fcomem-archidep%23readme)
* How to improve our basic deployment
* Advanced deployment
  * [Twelve-factor app][12factor]
  * [Unix environment variables](https://mediacomem.github.io/comem-archidep/2021-2022/subjects/unix-env-vars?home=MediaComem%2Fcomem-archidep%23readme)
  * [Linux process management](https://mediacomem.github.io/comem-archidep/2021-2022/subjects/linux-process-management?home=MediaComem%2Fcomem-archidep%23readme)
  * [Domain Name System (DNS)](https://mediacomem.github.io/comem-archidep/2021-2022/subjects/dns?home=MediaComem%2Fcomem-archidep%23readme)
  * [Reverse proxying](https://mediacomem.github.io/comem-archidep/2021-2022/subjects/reverse-proxy?home=MediaComem%2Fcomem-archidep%23readme)
  * [TLS/SSL certificates](https://mediacomem.github.io/comem-archidep/2021-2022/subjects/ssl?home=MediaComem%2Fcomem-archidep%23readme)
* Automated deployment
  * [Shell scripting](https://mediacomem.github.io/comem-archidep/2021-2022/subjects/shell-scripting?home=MediaComem%2Fcomem-archidep%23readme)
  * [Git hooks](https://mediacomem.github.io/comem-archidep/2021-2022/subjects/git-hooks?home=MediaComem%2Fcomem-archidep%23readme)
* Platform-as-a-Service (PaaS)
  * [Heroku](https://mediacomem.github.io/comem-archidep/2021-2022/subjects/heroku?home=MediaComem%2Fcomem-archidep%23readme)
* *Software development (extra)*
  * [Continuous software development](https://mediacomem.github.io/comem-archidep/2021-2022/subjects/continuous?home=MediaComem%2Fcomem-archidep%23readme)
  * [Automated testing (2018)](https://mediacomem.github.io/comem-archidep/2021-2022/subjects/automated-testing?home=MediaComem%2Fcomem-archidep%23readme)
  * [Automated testing (2020)](https://mediacomem.github.io/comem-archioweb/2021-2022/subjects/automated-testing/?home=MediaComem%2Fcomem-archioweb%23readme#1)
    * [YouTube: Expecting Profesionnalism – Robert C. Martin](https://youtu.be/BSaAMQVq01E)
    * [YouTube: GOTO 2017 – The Scribe's Oath – Robert C. Martin](https://youtu.be/Tng6Fox8EfI)
    * [YouTube: The Future of Programming – Robert C. Martin](https://youtu.be/ecIWPzGEbFc)



## What you will need

* A Unix CLI (Git Bash is included with Git on Windows)
* [Git][git-downloads]
* A free [GitHub][github] account
* [Google Chrome][chrome] (recommended, any browser with developer tools will do)
* A free [Heroku][heroku] account
* The [Heroku CLI][heroku-cli]



## Exercises

* **Version control**
  * [Collaborative exercise](https://github.com/MediaComem/comem-archidep-php-todo-exercise) (**graded**)
  * [Clone a repository from a server](ex/git-clone-from-server.md)
  * [Push a repository to a server](ex/git-push-to-server.md)
* **Unix**
  * [Permissions](ex/unix-permissions.md)
    * [**Solutions**](ex/unix-permissions-solutions.md)
  * [Pipeline](ex/unix-pipeline.md)
* **Basic deployment**
  * [Run your own virtual server on Microsoft Azure](ex/azure-setup.md)
  * [Deploy a PHP application with SFTP](ex/sftp-deployment.md)
    * [Diagram](ex/sftp-deployment.pdf)
* **Advanced deployment**
  * [Deploy a PHP application with Git](ex/git-clone-deployment.md)
    * [Diagram](ex/git-clone-deployment.pdf)
  * [Configure a PHP application through environment variables](ex/config-through-environment.md)
    * [Diagram](ex/config-through-environment.pdf)
  * [Manage a PHP application with systemd as a Process Manager](ex/systemd-deployment.md)
    * [Diagram](ex/systemd-deployment.pdf)
  * [Configure a domain name](ex/dns-configuration.md)
  * [Deploy a static site with nginx](ex/nginx-static-deployment.md)
    * [Diagram](ex/nginx-static-deployment.pdf)
  * [Deploy a PHP application with nginx and the FastCGI process manager](ex/nginx-php-fpm-deployment.md)
    * [Diagram](ex/nginx-php-fpm-deployment.pdf)
  * [Provision a Let's Encrypt TLS certificate with Certbot](ex/certbot-deployment.md)
  * [Set up an automated deployment with Git hooks](ex/git-automated-deployment.md)
    * [Diagram](ex/git-automated-deployment.pdf)
  * Deploy a web application with a database (**graded**, *not yet available*)
* **Platform-as-a-Service deployment**
  * [Deploy a PHP web page to Heroku](https://github.com/MediaComem/php-hello-world-form)
  * [Deploy web applications with a database to Heroku](ex/heroku-deployment.md)
* *Extra*
  * [Deploy the One Chat Room web application (Node.js & MongoDB)](ex/one-chat-room-deployment.md)
    * [Diagram](ex/end-result.pdf)
  * [Deploy the Big Browser web application (Node.js & Redis)](ex/big-browser-deployment.md)
  * [Deploy the WOPR web application (Ruby & Redis)](ex/wopr-deployment.md)
  * [Deploy the RPS web application (Node.js & PostgreSQL)](ex/rps-deployment.md)
  * [Configure nginx as a load balancer](ex/load-balancing-deployment.md)



## Useful links

* [Command line cheatsheet](CLI-CHEATSHEET.md)
* [System administration cheatsheet](SYSADMIN-CHEATSHEET.md)
* [Git cheatsheet][git-cheatsheet]
* [Final Test Matter](TEST-MATTER.md)



## References

These are the main references used throughout this course. More detailed and
additional links to various online articles and documentation can be found at
the end of each subject.

* [The Linux Documentation Project](https://tldp.org)
  * [Advanced Bash-Scripting Guide](https://tldp.org/LDP/abs/html/)
* [SSH, The Secure Shell: The Definitive Guide - Daniel J. Barrett, Richard E. Silverman, Robert G. Byrnes](https://books.google.ch/books/about/SSH_The_Secure_Shell_The_Definitive_Guid.html?id=9FSaScltd-kC&redir_esc=y)
* [The Git Book](https://git-scm.com/book)
  * [Chapter 1 - Getting Started](https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control)
  * [Chapter 2 - Git Basics](https://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository)
  * [Chapter 3 - Git Branching](https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell)
  * [Chapter 5 - Distributed Git](https://git-scm.com/book/en/v2/Distributed-Git-Distributed-Workflows)
  * [Chapter 8 - Customizing Git - Git Hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)
* [Open Web Application Security Project](https://www.owasp.org)
  * [OWASP Top Ten](https://owasp.org/www-project-top-ten/)
* [Ops School Curriculum](https://www.opsschool.org)
  * [Sysadmin 101](https://www.opsschool.org/sysadmin_101.html)
  * [Unix Fundamentals 101](https://www.opsschool.org/unix_101.html)
  * [Unix Fundamentals 201](https://www.opsschool.org/unix_201.html)
  * [Networking 101](https://www.opsschool.org/networking_101.html)
  * [Networking 201](https://www.opsschool.org/networking_201.html)
* [The Internet Explained From First Principles](https://ef1p.com/internet)
* [The Twelve-Factor App](https://12factor.net)
* [Systemd Manual](https://www.freedesktop.org/software/systemd/man/)
  * [Unit Configuration](https://www.freedesktop.org/software/systemd/man/systemd.unit.html)
  * [Service Configuration](https://www.freedesktop.org/software/systemd/man/systemd.service.html)
* [nginx documentation](http://nginx.org/en/docs/)
  * [Beginner's Guide](http://nginx.org/en/docs/beginners_guide.html)
  * [Configuring HTTPS Servers](http://nginx.org/en/docs/http/configuring_https_servers.html)
* [Heroku Dev Center](https://devcenter.heroku.com)

[Wikipedia](https://www.wikipedia.org) is also often referenced, namely these
and related articles:

* [Secure Shell](https://en.wikipedia.org/wiki/Secure_Shell)
* [Cloud Computing](https://en.wikipedia.org/wiki/Cloud_computing)
* [Internet Protocol](https://en.wikipedia.org/wiki/Internet_Protocol)
  * [IP Address](https://en.wikipedia.org/wiki/IP_address)
  * [Port (Computer Networking)](https://en.wikipedia.org/wiki/Port_(computer_networking))
* [Domain Name System](https://en.wikipedia.org/wiki/Domain_Name_System)
* [Environment Variable](https://en.wikipedia.org/wiki/Environment_variable)
* [Reverse Proxy](https://en.wikipedia.org/wiki/Reverse_proxy)
* [Public Key Certificate](https://en.wikipedia.org/wiki/Public_key_certificate)



[12factor]: https://12factor.net
[12factor-codebase]: https://12factor.net/codebase
[12factor-config]: https://12factor.net/config
[apache]: https://httpd.apache.org
[chrome]: https://www.google.com/chrome/
[comem]: http://www.heig-vd.ch/comem
[comem-webdev]: https://github.com/MediaComem/comem-webdev
[git-cheatsheet]: https://github.com/MediaComem/comem-webdev/blob/master/GIT-CHEATSHEET.md
[git-downloads]: https://git-scm.com/downloads
[github]: https://github.com
[heroku]: https://www.heroku.com/home
[heroku-cli]: https://devcenter.heroku.com/articles/heroku-cli
[heig]: http://www.heig-vd.ch
[nginx]: https://www.nginx.com
[owasp]: https://www.owasp.org
[owasp-top10]: https://owasp.org/www-project-top-ten/
[php-dev-server]: https://www.php.net/manual/en/features.commandline.webserver.php
[php-fpm]: https://www.php.net/manual/en/install.fpm.php
