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
- [How to improve our basic deployment](#how-to-improve-our-basic-deployment)
- [References](#references)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## Plan

* Introduction
  * [Command line](https://mediacomem.github.io/comem-archidep/2020-2021/subjects/cli?home=MediaComem%2Fcomem-archidep%23readme)
  * [Secure Shell (SSH)](https://mediacomem.github.io/comem-archidep/2020-2021/subjects/ssh?home=MediaComem%2Fcomem-archidep%23readme)
    * [Video](https://cyberlearn.hes-so.ch/pluginfile.php/3377846/mod_resource/content/1/ArchiDep%202020-09-18%20SSH.mp4)
* Version control
  * [Version control with Git](https://mediacomem.github.io/comem-archidep/2020-2021/subjects/git?home=MediaComem%2Fcomem-archidep%23readme)
    * [Video](https://cyberlearn.hes-so.ch/pluginfile.php/3385742/mod_resource/content/2/ArchiDep%202020-09-25%20part%201%20Git%20Introduction.mp4)
  * [Git branching](https://mediacomem.github.io/comem-archidep/2020-2021/subjects/git-branching?home=MediaComem%2Fcomem-archidep%23readme)
    * [Video](https://cyberlearn.hes-so.ch/pluginfile.php/3385746/mod_resource/content/1/ArchiDep%202020-09-25%20part%202%20Git%20Branching.mp4)
  * [Collaborating with Git](https://mediacomem.github.io/comem-archidep/2020-2021/subjects/git-collaborating?home=MediaComem%2Fcomem-archidep%23readme)
    * [Video](https://cyberlearn.hes-so.ch/pluginfile.php/3392793/mod_resource/content/1/ArchiDep%202020-10-02%20part%201%20Collaborating%20with%20Git.mp4)
* Security
  * [Open Web Application Security Project][owasp]
  * [OWASP Top 10 - The Ten Most Critical Web Application Security Risks][owasp-top10]
    * [Video: OWASP Top 10 & exercise](https://cyberlearn.hes-so.ch/pluginfile.php/3400902/mod_resource/content/1/ArchiDep%202020-10-09%20part%201%20OWASP%20Top%20Ten.mp4)
    * [Video: PHP TodoList injection vulnerability](https://cyberlearn.hes-so.ch/pluginfile.php/3400906/mod_resource/content/1/ArchiDep%202020-10-09%20part%202%20PHP%20TodoList%20Application%20Injection%20Vulnerability.mp4)
    * [Video: PHP TodoList XSS vulnerability](https://cyberlearn.hes-so.ch/pluginfile.php/3400908/mod_resource/content/1/ArchiDep%202020-10-09%20part%203%20PHP%20TodoList%20Application%20XSS%20Vulnerability.mp4)
* Basic deployment
  * [Cloud computing](https://mediacomem.github.io/comem-archidep/2020-2021/subjects/cloud?home=MediaComem%2Fcomem-archidep%23readme)
    * [Video](https://cyberlearn.hes-so.ch/pluginfile.php/3400913/mod_resource/content/1/ArchiDep%202020-10-09%20part%204%20Cloud%20Computing.mp4)
  * [Linux](https://mediacomem.github.io/comem-archidep/2020-2021/subjects/linux?home=MediaComem%2Fcomem-archidep%23readme)
    * [Video](https://cyberlearn.hes-so.ch/pluginfile.php/3400914/mod_resource/content/1/ArchiDep%202020-10-09%20part%205%20Linux.mp4)
  * [Unix basics & administration](https://mediacomem.github.io/comem-archidep/2020-2021/subjects/unix-admin?home=MediaComem%2Fcomem-archidep%23readme)
    * [Video: file system, users, permissions & administrative access](https://cyberlearn.hes-so.ch/pluginfile.php/3400918/mod_resource/content/1/ArchiDep%202020-10-09%20part%206%20Unix%20Administration.mp4)
    * [Video: user management & permission management](https://cyberlearn.hes-so.ch/pluginfile.php/3405423/mod_resource/content/1/ArchiDep%202020-10-16%20part%201%20Unix%20Administration.mp4)
  * [Unix processes](https://mediacomem.github.io/comem-archidep/2020-2021/subjects/unix-processes?home=MediaComem%2Fcomem-archidep%23readme)
    * [Video: process IDs & exit statuses](https://cyberlearn.hes-so.ch/pluginfile.php/3405425/mod_resource/content/1/ArchiDep%202020-10-16%20part%202%20Unix%20Processes%20A.mp4)
    * [Video: streams, pipelines & signals](https://cyberlearn.hes-so.ch/pluginfile.php/3405429/mod_resource/content/1/ArchiDep%202020-10-16%20part%203%20Unix%20Processes%20B.mp4)
  * [Unix networking](https://mediacomem.github.io/comem-archidep/2020-2021/subjects/unix-networking?home=MediaComem%2Fcomem-archidep%23readme)
    * [Video](https://cyberlearn.hes-so.ch/pluginfile.php/3425344/mod_resource/content/1/ArchiDep%202020-11-06%20part%203%20Unix%20Networking.mp4)
  * [APT](https://mediacomem.github.io/comem-archidep/2020-2021/subjects/apt?home=MediaComem%2Fcomem-archidep%23readme)
    * [Video](https://cyberlearn.hes-so.ch/pluginfile.php/3425345/mod_resource/content/1/ArchiDep%202020-11-06%20part%204%20APT.mp4)
* [How to improve our basic deployment](#how-to-improve-our-basic-deployment)
  * [Video 1](https://cyberlearn.hes-so.ch/pluginfile.php/3438814/mod_resource/content/1/ArchiDep%202020-11-19%20part%202%20How%20To%20Improve%20Our%20Deployment.mp4)
  * [Video 2](https://cyberlearn.hes-so.ch/pluginfile.php/3439914/mod_resource/content/1/ArchiDep%202020-11-20%20part%204%20How%20to%20further%20Improve%20our%20Deployment.mp4)
* Advanced deployment
  * [Twelve-factor app][12factor]
    * [Video](https://cyberlearn.hes-so.ch/pluginfile.php/3438838/mod_resource/content/2/ArchiDep%202020-11-19%20part%203%20The%20Twelve-Factor%20App.mp4)
  * [Unix environment variables](https://mediacomem.github.io/comem-archidep/2020-2021/subjects/unix-env-vars?home=MediaComem%2Fcomem-archidep%23readme)
    * [Video](https://cyberlearn.hes-so.ch/pluginfile.php/3438841/mod_resource/content/2/ArchiDep%202020-11-19%20part%204%20Unix%20Environment%20Variables.mp4)
  * [Linux process management](https://mediacomem.github.io/comem-archidep/2020-2021/subjects/linux-process-management?home=MediaComem%2Fcomem-archidep%23readme)
    * [Video](https://cyberlearn.hes-so.ch/pluginfile.php/3439918/mod_resource/content/2/ArchiDep%202020-11-20%20part%205%20Linux%20Process%20Management.mp4)
  * [Domain Name System (DNS)](https://mediacomem.github.io/comem-archidep/2020-2021/subjects/dns?home=MediaComem%2Fcomem-archidep%23readme)
    * [Video](https://cyberlearn.hes-so.ch/pluginfile.php/3440023/mod_resource/content/1/ArchiDep%202020-11-20%20part%207%20Domain%20Name%20System%20%28DNS%29.mp4)
  * [Reverse proxying](https://mediacomem.github.io/comem-archidep/2020-2021/subjects/reverse-proxy?home=MediaComem%2Fcomem-archidep%23readme)
    * [Video](https://cyberlearn.hes-so.ch/pluginfile.php/3453123/mod_resource/content/1/ArchiDep%202020-12-03%20part%204%20Reverse%20proxying.mp4)
    * [Video: symbolic links](https://cyberlearn.hes-so.ch/pluginfile.php/3453124/mod_resource/content/1/ArchiDep%202020-12-03%20part%205%20Symbolic%20links.mp4)
  * [TLS/SSL certificates](https://mediacomem.github.io/comem-archidep/2020-2021/subjects/ssl?home=MediaComem%2Fcomem-archidep%23readme)
    * [Video](https://cyberlearn.hes-so.ch/pluginfile.php/3454718/mod_resource/content/1/ArchiDep%202020-12-04%20part%203%20TLSSSL%20certificates.mp4)
* Automated deployment
  * [Shell scripting](https://mediacomem.github.io/comem-archidep/2020-2021/subjects/shell-scripting?home=MediaComem%2Fcomem-archidep%23readme)
  * [Git hooks](https://mediacomem.github.io/comem-archidep/2020-2021/subjects/git-hooks?home=MediaComem%2Fcomem-archidep%23readme)
* Platform-as-a-Service (PaaS)
  * [Heroku](https://mediacomem.github.io/comem-archidep/2020-2021/subjects/heroku?home=MediaComem%2Fcomem-archidep%23readme)
* *Software development (extra)*
  * [Continuous software development](https://mediacomem.github.io/comem-archidep/2020-2021/subjects/continuous?home=MediaComem%2Fcomem-archidep%23readme)
  * [Automated testing](https://mediacomem.github.io/comem-archidep/2020-2021/subjects/automated-testing?home=MediaComem%2Fcomem-archidep%23readme)



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
    * [Video 1](https://cyberlearn.hes-so.ch/pluginfile.php/3392853/mod_resource/content/1/ArchiDep%202020-10-02%20part%202%20Collaborative%20Git%20Exercise%20A.mp4)
    * [Video 2](https://cyberlearn.hes-so.ch/pluginfile.php/3392856/mod_resource/content/1/ArchiDep%202020-10-02%20part%203%20Collaborative%20Git%20Exercise%20B.mp4)
  * [Clone a repository from a server](ex/git-clone-from-server.md)
  * [Push a repository to a server](ex/git-push-to-server.md)
* **Unix**
  * [Permissions](ex/unix-permissions.md)
    * [Video: instructions](https://cyberlearn.hes-so.ch/pluginfile.php/3425330/mod_resource/content/2/ArchiDep%202020-11-06%20part%201%20Unix%20Permissions%20Exercise.mp4)
    * [Solutions](ex/unix-permissions-solutions.md)
  * [Pipeline](ex/unix-pipeline.md)
    * [Video](https://cyberlearn.hes-so.ch/pluginfile.php/3425339/mod_resource/content/1/ArchiDep%202020-11-06%20part%202%20Unix%20Pipeline%20Exercise.mp4), [solutions](ex/unix-pipeline-solutions.md))
* **Basic deployment**
  * [Run your own virtual server on Amazon Web Services](ex/aws-setup.md)
    * [Diagram](ex/aws-setup.pdf)
  * [Deploy a PHP application with SFTP](ex/sftp-deployment.md)
    * [Video: instructions](https://cyberlearn.hes-so.ch/pluginfile.php/3425348/mod_resource/content/2/ArchiDep%202020-11-06%20part%205%20Deploy%20a%20PHP%20Application%20with%20SFTP.mp4)
    * [Video: architecture](https://cyberlearn.hes-so.ch/pluginfile.php/3438812/mod_resource/content/3/ArchiDep%202020-11-19%20part%201%20Architecture%20of%20the%20SFTP%20Deployment%20Exercise.mp4)
    * [Diagram](ex/sftp-deployment.pdf)
* **Advanced deployment**
  * [Deploy a PHP application with Git](ex/git-clone-deployment.md)
    * [Video: instructions](https://cyberlearn.hes-so.ch/pluginfile.php/3438842/mod_resource/content/2/ArchiDep%202020-11-19%20part%205%20Deploy%20a%20PHP%20application%20with%20Git.mp4)
    * [Video: solution](https://cyberlearn.hes-so.ch/pluginfile.php/3439901/mod_resource/content/2/ArchiDep%202020-11-20%20part%201%20Solution%20-%20Deploy%20a%20PHP%20Application%20with%20Git.mp4)
    * [Diagram](ex/git-clone-deployment.pdf)
  * [Configure a PHP application through environment variables](ex/config-through-environment.md)
    * [Video: instructions](https://cyberlearn.hes-so.ch/pluginfile.php/3438844/mod_resource/content/3/ArchiDep%202020-11-19%20part%206%20Configure%20a%20PHP%20application%20through%20environment%20variables.mp4)
    * [Video: solution](https://cyberlearn.hes-so.ch/pluginfile.php/3439904/mod_resource/content/1/ArchiDep%202020-11-20%20part%202%20Solution%20-%20Configure%20a%20PHP%20Application%20through%20Environment%20Variables.mp4)
    * [Video: architecture](https://cyberlearn.hes-so.ch/pluginfile.php/3439911/mod_resource/content/1/ArchiDep%202020-11-20%20part%203%20Architecture%20of%20the%20PHP%20TodoList%20Application%20with%20Git%20_%20Environment%20Variables.mp4)
    * [Diagram](ex/config-through-environment.pdf)
  * [Manage a PHP application with systemd as a Process Manager](ex/systemd-deployment.md)
    * [Video: instructions](https://cyberlearn.hes-so.ch/pluginfile.php/3439921/mod_resource/content/1/ArchiDep%202020-11-20%20part%206%20Manage%20a%20PHP%20Application%20with%20Systemd%20as%20a%20Process%20Manager.mp4)
    * [Video: solution](https://cyberlearn.hes-so.ch/pluginfile.php/3453100/mod_resource/content/3/ArchiDep%202020-12-03%20part%201%20Solution%20-%20Manage%20a%20PHP%20application%20with%20systemd%20as%20a%20process%20manager.mp4)
    * [Diagram](ex/systemd-deployment.pdf)
  * [Configure a domain name](ex/dns-configuration.md)
    * [Video: instructions](https://cyberlearn.hes-so.ch/pluginfile.php/3440024/mod_resource/content/1/ArchiDep%202020-11-20%20part%208%20Configure%20a%20Domain%20Name.mp4)
    * [Video: solution](https://cyberlearn.hes-so.ch/pluginfile.php/3453111/mod_resource/content/1/ArchiDep%202020-12-03%20part%202%20Solution%20-%20Configure%20a%20domain%20name.mp4)
    * [Video: architecture](https://cyberlearn.hes-so.ch/pluginfile.php/3453116/mod_resource/content/3/ArchiDep%202020-12-03%20part%203%20Discussion%20-%20Architecture%20of%20the%20systemd%20%20DNS%20exercises.mp4)
  * [Deploy a static site with nginx](ex/nginx-static-deployment.md)
    * [Video: instructions](https://cyberlearn.hes-so.ch/pluginfile.php/3453126/mod_resource/content/2/ArchiDep%202020-12-03%20part%206%20Exercise%20-%20Deploy%20a%20static%20website%20with%20nginx.mp4)
    * [Video: solution](https://cyberlearn.hes-so.ch/pluginfile.php/3454709/mod_resource/content/1/ArchiDep%202020-12-04%20part%201%20Solution%20-%20Deploy%20a%20static%20site%20with%20nginx.mp4)
    * [Diagram](ex/nginx-static-deployment.pdf)
  * [Deploy a PHP application with nginx and the FastCGI process manager](ex/nginx-php-fpm-deployment.md)
    * [Video: instructions](https://cyberlearn.hes-so.ch/pluginfile.php/3453128/mod_resource/content/1/ArchiDep%202020-12-03%20part%207%20Exercise%20-%20Deploy%20a%20PHP%20application%20with%20nginx%20and%20the%20FastCGI%20process%20manager.mp4)
    * [Video: solution](https://cyberlearn.hes-so.ch/pluginfile.php/3454711/mod_resource/content/2/ArchiDep%202020-12-04%20part%202%20Solution%20-%20Deploy%20a%20PHP%20application%20with%20nginx%20and%20the%20FastCGI%20process%20manager.mp4)
    * [Diagram](ex/nginx-php-fpm-deployment.pdf)
  * [Provision a Let's Encrypt TLS certificate with Certbot](ex/certbot-deployment.md)
    * [Video: instructions](https://cyberlearn.hes-so.ch/pluginfile.php/3454721/mod_resource/content/1/ArchiDep%202020-12-04%20part%204%20Exercise%20-%20Provision%20a%20Lets%20Encrypt%20TLS%20certificate%20with%20Certbot.mp4)
  * [Set up an automated deployment with Git hooks](ex/git-automated-deployment.md)
    * [Diagram](ex/git-automated-deployment.pdf)
  * Deploy a web application with a database (**graded**), *not yet available*
* **Platform-as-a-Service deployment**
  * [Deploy a PHP web page to Heroku](https://github.com/MediaComem/php-hello-world-form)
  * [Deploy web applications with a database to Heroku](ex/heroku-deployment.md)
* *Extra*
  * [Deploy the One Chat Room web application (Node.js & MongoDB)](ex/one-chat-room-deployment.md)
    * *[Diagram](ex/end-result.pdf)
  * [Deploy the Big Browser web application (Node.js & Redis)](ex/big-browser-deployment.md)
  * [Deploy the WOPR web application (Ruby & Redis)](ex/wopr-deployment.md)
  * [Configure nginx as a load balancer](ex/load-balancing-deployment.md)



## Useful links

* [Command line cheatsheet](CLI-CHEATSHEET.md)
* [System administration cheatsheet](SYSADMIN-CHEATSHEET.md)
* [Git cheatsheet][git-cheatsheet]
* [Final Test Matter](TEST-MATTER.md)



## How to improve our basic deployment

The basic SFTP deployment of the PHP TodoList has several flaws which we will
fix during the rest of the course:

* Transfering files manually through SFTP is slow and error-prone. We will use
  **Git** to reliably transfer files [from our central
  codebase][12factor-codebase] and easily keep our deployment up-to-date over
  time.
* [Hardcoding configuration is a bad practice][12factor-config]. We will use
  **environment variables** so that our application can be dynamically
  configured and deployed in any environment without changing its source code.
* Starting our application manually is not suitable for a production deployment.
  We will use a **process manager** to manage the lifecycle of our application:
  starting it automatically when the server boots, and restarting it
  automatically if it crashes.
* Accessing a web application through an IP address is not user-friendly. We
  will obtain a domain and configure its DNS zone file so that our application
  is accessible with a human-readable **domain name**.
* Using a non-standard port is not user-friendly either. We will run the
  application on **port 80 or 443** so that the end user does not have to
  specify a port in the browser's address bar.
* Running our application server directly on port 80 or 443 will cause a
  problem: only one process can listen on a given port at the same time. We need
  another tool to support **multiple production deployments on the same
  server**. That will be the job of a reverse proxy like [Apache][apache] or
  [nginx][nginx].
* Our application is not secure as indicated by the browser, because it is
  served over HTTP and not HTTPS. We will obtain a **TLS/SSL certificate**
  signed by a trusted certificate authority so that our application can be
  served over HTTPS and recognized as secure by browsers.
* The [PHP Development Server][php-dev-server] is not meant to deploy
  applications in production environments. We will use the [**FastCGI Process
  Manager**][php-fpm] to perform a production-grade deployment, making our
  application more resilient and able to serve more clients concurrently.



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
