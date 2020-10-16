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
  * [Command line](https://mediacomem.github.io/comem-archidep/2020-2021/subjects/cli?home=MediaComem%2Fcomem-archidep%23readme)
  * [Secure Shell (SSH)](https://mediacomem.github.io/comem-archidep/2020-2021/subjects/ssh?home=MediaComem%2Fcomem-archidep%23readme) - ([video](https://cyberlearn.hes-so.ch/pluginfile.php/3377846/mod_resource/content/1/ArchiDep%202020-09-18%20SSH.mp4))
* Version control
  * [Version control with Git](https://mediacomem.github.io/comem-archidep/2020-2021/subjects/git?home=MediaComem%2Fcomem-archidep%23readme) - ([video](https://cyberlearn.hes-so.ch/pluginfile.php/3385742/mod_resource/content/2/ArchiDep%202020-09-25%20part%201%20Git%20Introduction.mp4))
  * [Git branching](https://mediacomem.github.io/comem-archidep/2020-2021/subjects/git-branching?home=MediaComem%2Fcomem-archidep%23readme) - ([video](https://cyberlearn.hes-so.ch/pluginfile.php/3385746/mod_resource/content/1/ArchiDep%202020-09-25%20part%202%20Git%20Branching.mp4))
  * [Collaborating with Git](https://mediacomem.github.io/comem-archidep/2020-2021/subjects/git-collaborating?home=MediaComem%2Fcomem-archidep%23readme) - ([video](https://cyberlearn.hes-so.ch/pluginfile.php/3392793/mod_resource/content/1/ArchiDep%202020-10-02%20part%201%20Collaborating%20with%20Git.mp4))
* Security
  * [Open Web Application Security Project][owasp]
  * [OWASP Top 10 - The Ten Most Critical Web Application Security Risks][owasp-top10] - ([video](https://cyberlearn.hes-so.ch/pluginfile.php/3400902/mod_resource/content/1/ArchiDep%202020-10-09%20part%201%20OWASP%20Top%20Ten.mp4))
    * [Video: PHP TodoList Injection Vulnerability](https://cyberlearn.hes-so.ch/pluginfile.php/3400906/mod_resource/content/1/ArchiDep%202020-10-09%20part%202%20PHP%20TodoList%20Application%20Injection%20Vulnerability.mp4)
    * [Video: PHP TodoList XSS Vulnerability](https://cyberlearn.hes-so.ch/pluginfile.php/3400908/mod_resource/content/1/ArchiDep%202020-10-09%20part%203%20PHP%20TodoList%20Application%20XSS%20Vulnerability.mp4)
* Basic deployment
  * [Cloud computing](https://mediacomem.github.io/comem-archidep/2020-2021/subjects/cloud?home=MediaComem%2Fcomem-archidep%23readme) - ([video](https://cyberlearn.hes-so.ch/pluginfile.php/3400913/mod_resource/content/1/ArchiDep%202020-10-09%20part%204%20Cloud%20Computing.mp4))
  * [Linux](https://mediacomem.github.io/comem-archidep/2020-2021/subjects/linux?home=MediaComem%2Fcomem-archidep%23readme) - ([video](https://cyberlearn.hes-so.ch/pluginfile.php/3400914/mod_resource/content/1/ArchiDep%202020-10-09%20part%205%20Linux.mp4))
  * [Unix basics & administration](https://mediacomem.github.io/comem-archidep/2020-2021/subjects/unix-admin?home=MediaComem%2Fcomem-archidep%23readme) - ([video 1](https://cyberlearn.hes-so.ch/pluginfile.php/3400918/mod_resource/content/1/ArchiDep%202020-10-09%20part%206%20Unix%20Administration.mp4), [video 2](https://cyberlearn.hes-so.ch/pluginfile.php/3405423/mod_resource/content/1/ArchiDep%202020-10-16%20part%201%20Unix%20Administration.mp4))
  * [Unix processes](https://mediacomem.github.io/comem-archidep/2020-2021/subjects/unix-processes?home=MediaComem%2Fcomem-archidep%23readme) - ([video 1](https://cyberlearn.hes-so.ch/pluginfile.php/3405425/mod_resource/content/1/ArchiDep%202020-10-16%20part%202%20Unix%20Processes%20A.mp4), [video 2](https://cyberlearn.hes-so.ch/pluginfile.php/3405429/mod_resource/content/1/ArchiDep%202020-10-16%20part%203%20Unix%20Processes%20B.mp4))
  * [Unix networking](https://mediacomem.github.io/comem-archidep/2020-2021/subjects/unix-networking?home=MediaComem%2Fcomem-archidep%23readme)
  * [APT](https://mediacomem.github.io/comem-archidep/2020-2021/subjects/apt?home=MediaComem%2Fcomem-archidep%23readme)
* Advanced deployment
  * [Twelve-factor app][12factor]
  * [Unix environment variables](https://mediacomem.github.io/comem-archidep/2020-2021/subjects/unix-env-vars?home=MediaComem%2Fcomem-archidep%23readme)
  * [Linux process management](https://mediacomem.github.io/comem-archidep/2020-2021/subjects/linux-process-management?home=MediaComem%2Fcomem-archidep%23readme)
  * [Domain Name System (DNS)](https://mediacomem.github.io/comem-archidep/2020-2021/subjects/dns?home=MediaComem%2Fcomem-archidep%23readme)
  * [Reverse proxying](https://mediacomem.github.io/comem-archidep/2020-2021/subjects/reverse-proxy?home=MediaComem%2Fcomem-archidep%23readme)
  * [TLS/SSL certificates](https://mediacomem.github.io/comem-archidep/2020-2021/subjects/ssl?home=MediaComem%2Fcomem-archidep%23readme)
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
  * [Collaborative exercise](https://github.com/MediaComem/comem-archidep-php-todo-exercise) (**graded**, [video 1](https://cyberlearn.hes-so.ch/pluginfile.php/3392853/mod_resource/content/1/ArchiDep%202020-10-02%20part%202%20Collaborative%20Git%20Exercise%20A.mp4), [video 2](https://cyberlearn.hes-so.ch/pluginfile.php/3392856/mod_resource/content/1/ArchiDep%202020-10-02%20part%203%20Collaborative%20Git%20Exercise%20B.mp4))
  * [Clone a repository from a server](ex/git-clone-from-server.md)
  * [Push a repository to a server](ex/git-push-to-server.md)
* **Unix**
  * [Permissions](ex/unix-permissions.md)
  * [Pipeline](ex/unix-pipeline.md)
* **Basic deployment**
  * [Run your own virtual server on Amazon Web Services](ex/aws-setup.md) [(diagram)](ex/aws-setup.pdf)
  * [Deploy a PHP application with SFTP](ex/sftp-deployment.md) [(diagram)](ex/sftp-deployment.pdf)
  * [Deploy a PHP application with Git](ex/git-clone-deployment.md) [(diagram)](ex/git-clone-deployment.pdf)
  * [Configure a PHP application through environment variables](ex/config-through-environment.md) [(diagram)](ex/config-through-environment.pdf)
  * [Manage a PHP application with systemd as a Process Manager](ex/systemd-deployment.md) [(diagram)](ex/systemd-deployment.pdf)
  * [Configure a domain name](ex/dns-configuration.md)
* **Advanced deployment**
  * [Deploy a static site with nginx](ex/nginx-static-deployment.md) [(diagram)](ex/nginx-static-deployment.pdf)
  * [Deploy a PHP application with nginx and the FastCGI process manager](ex/nginx-php-fpm-deployment.md) [(diagram)](ex/nginx-php-fpm-deployment.pdf)
  * [Set up an automated deployment with Git hooks](ex/git-automated-deployment.md) [(diagram)](ex/git-automated-deployment.pdf)
  * Deploy a web application with a database (**graded**), *not yet available*
  * [Provision a Let's Encrypt TLS certificate with Certbot](ex/certbot-deployment.md)
  * *Extra exercises*
    * [Deploy the One Chat Room web application (Node.js & MongoDB)](ex/one-chat-room-deployment.md)
    * [Deploy the Big Browser web application (Node.js & Redis)](ex/big-browser-deployment.md)
    * [Deploy the WOPR web application (Ruby & Redis)](ex/wopr-deployment.md)
    * [Configure nginx as a load balancer](ex/load-balancing-deployment.md)
  * *[End result diagram](ex/end-result.pdf) (assuming the One Chat Room application was deployed)*
* **Platform-as-a-Service deployment**
  * [Deploy a PHP web page to Heroku](https://github.com/MediaComem/php-hello-world-form)
  * [Deploy web applications with a database to Heroku](ex/heroku-deployment.md)



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
[chrome]: https://www.google.com/chrome/
[comem]: http://www.heig-vd.ch/comem
[comem-webdev]: https://github.com/MediaComem/comem-webdev
[git-cheatsheet]: https://github.com/MediaComem/comem-webdev/blob/master/GIT-CHEATSHEET.md
[git-downloads]: https://git-scm.com/downloads
[github]: https://github.com
[heroku]: https://www.heroku.com/home
[heroku-cli]: https://devcenter.heroku.com/articles/heroku-cli
[heig]: http://www.heig-vd.ch
[owasp]: https://www.owasp.org
[owasp-top10]: https://owasp.org/www-project-top-ten/
