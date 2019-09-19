# COMEM+ Architecture & Deployment course

In this course you will learn:

* How to deploy applications on a Linux server on an IaaS platform (Amazon Web Services).
* How to deploy applications on a PaaS platform (Heroku).
* Automated testing, continuous integration and continuous delivery (Travis CI).

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

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## Plan

* Introduction
  * [Command line](https://mediacomem.github.io/comem-webdev-docs/2018-2019/subjects/cli?home=MediaComem%2Fcomem-archidep%23readme)
  * [Secure Shell (SSH)](https://mediacomem.github.io/comem-webdev-docs/2018-2019/subjects/ssh?home=MediaComem%2Fcomem-archidep%23readme)
* Version control
  * [Version control with Git](https://mediacomem.github.io/comem-webdev-docs/2018-2019/subjects/git?home=MediaComem%2Fcomem-archidep%23readme)
  * [Git branching](https://mediacomem.github.io/comem-webdev-docs/2018-2019/subjects/git-branching?home=MediaComem%2Fcomem-archidep%23readme)
  * [Collaborating with Git](https://mediacomem.github.io/comem-webdev-docs/2018-2019/subjects/git-collaborating?home=MediaComem%2Fcomem-archidep%23readme)
* Security
  * [Open Web Application Security Project][owasp]
  * [OWASP Top 10 - The Ten Most Critical Web Application Security Risks][owasp-top10]
* Basic deployment
  * [Cloud computing](https://mediacomem.github.io/comem-webdev-docs/2018-2019/subjects/cloud?home=MediaComem%2Fcomem-archidep%23readme)
  * [Linux](https://mediacomem.github.io/comem-webdev-docs/2018-2019/subjects/linux?home=MediaComem%2Fcomem-archidep%23readme)
  * [Unix basics & administration](https://mediacomem.github.io/comem-webdev-docs/2018-2019/subjects/unix-admin?home=MediaComem%2Fcomem-archidep%23readme)
  * [Unix processes](https://mediacomem.github.io/comem-webdev-docs/2018-2019/subjects/unix-processes?home=MediaComem%2Fcomem-archidep%23readme)
  * [Unix networking](https://mediacomem.github.io/comem-webdev-docs/2018-2019/subjects/unix-networking?home=MediaComem%2Fcomem-archidep%23readme)
  * [APT](https://mediacomem.github.io/comem-webdev-docs/2018-2019/subjects/apt?home=MediaComem%2Fcomem-archidep%23readme)
* Advanced deployment
  * [Twelve-factor app][12factor]
  * [Unix environment variables](https://mediacomem.github.io/comem-webdev-docs/2018-2019/subjects/unix-env-vars?home=MediaComem%2Fcomem-archidep%23readme)
  * [Linux process management](https://mediacomem.github.io/comem-webdev-docs/2018-2019/subjects/linux-process-management?home=MediaComem%2Fcomem-archidep%23readme)
  * [Domain Name System (DNS)](https://mediacomem.github.io/comem-webdev-docs/2018-2019/subjects/dns?home=MediaComem%2Fcomem-archidep%23readme)
  * [Reverse proxying](https://mediacomem.github.io/comem-webdev-docs/2018-2019/subjects/reverse-proxy?home=MediaComem%2Fcomem-archidep%23readme)
  * [TLS/SSL certificates](https://mediacomem.github.io/comem-webdev-docs/2018-2019/subjects/ssl?home=MediaComem%2Fcomem-archidep%23readme)
* Automated deployment
  * [Shell scripting](https://mediacomem.github.io/comem-webdev-docs/2018-2019/subjects/shell-scripting?home=MediaComem%2Fcomem-archidep%23readme)
  * [Git hooks](https://mediacomem.github.io/comem-webdev-docs/2018-2019/subjects/git-hooks?home=MediaComem%2Fcomem-archidep%23readme)
* Platform-as-a-Service (PaaS)
  * [Heroku](https://mediacomem.github.io/comem-webdev-docs/2018-2019/subjects/heroku?home=MediaComem%2Fcomem-archidep%23readme)
* *Software development (extra)*
  * [Continuous software development](https://mediacomem.github.io/comem-webdev-docs/2018-2019/subjects/continuous?home=MediaComem%2Fcomem-archidep%23readme)
  * [Automated testing](https://mediacomem.github.io/comem-webdev-docs/2018-2019/subjects/automated-testing?home=MediaComem%2Fcomem-archidep%23readme)



## What you will need

* A Unix CLI (Git Bash is included with Git on Windows)
* [Git][git-downloads]
* A free [GitHub][github] account
* [Google Chrome][chrome] (recommended, any browser with developer tools will do)
* A free [Heroku][heroku] account
* The [Heroku CLI][heroku-cli]



## Exercises

* **Version control**
  * [Collaborative exercise (**graded**)](https://github.com/MediaComem/comem-archidep-php-todo-exercise)
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
  * Deploy a web application with a database (**graded**, not yet available)
  * [Deploy a Node.js application with a MongoDB database (*extra*)](ex/one-chat-room-deployment.md)
  * [Deploy a Node.js application with a Redis database (*extra*)](ex/big-browser-deployment.md)
  * [Provision a Let's Encrypt TLS certificate with Certbot](ex/certbot-deployment.md)
  * [Configure nginx as a load balancer (*extra*)](ex/load-balancing-deployment.md)
  * *Bonus exercise* (not yet available)
  * [*End result diagram*](ex/end-result.pdf)
* **Platform-as-a-Service deployment**
  * [Deploy a PHP web page to Heroku](https://github.com/MediaComem/php-hello-world-form)
  * [Deploy PHP and Node.js applications to Heroku](ex/heroku-deployment.md)



## Useful links

* [Command line cheatsheet][cli-cheatsheet]
* [Git cheatsheet][git-cheatsheet]
* [Final Test Matter](TEST-MATTER.md)



[12factor]: https://12factor.net
[chrome]: https://www.google.com/chrome/
[cli-cheatsheet]: https://github.com/MediaComem/comem-webdev/blob/master/CLI-CHEATSHEET.md
[comem]: http://www.heig-vd.ch/comem
[comem-webdev]: https://github.com/MediaComem/comem-webdev
[git-cheatsheet]: https://github.com/MediaComem/comem-webdev/blob/master/GIT-CHEATSHEET.md
[git-downloads]: https://git-scm.com/downloads
[github]: https://github.com
[heroku]: https://www.heroku.com/home
[heroku-cli]: https://devcenter.heroku.com/articles/heroku-cli
[heig]: http://www.heig-vd.ch
[owasp]: https://www.owasp.org/
[owasp-top10]: https://www.owasp.org/images/7/72/OWASP_Top_10-2017_%28en%29.pdf.pdf
