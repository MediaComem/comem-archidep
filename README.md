# COMEM+ Architecture & Deployment course

In this course you will learn:

- How to deploy applications on a Linux server on an IaaS platform (Microsoft Azure).
- How to deploy applications on a PaaS platform (Render).

In pursuit of this goal, you will learn:

- How to use the command line and version control.
- The basics of Unix system administration and cloud computing architectures.
- Good security practices related to system administration and web applications.

This course is a [COMEM+][comem] [web development course][comem-webdev] taught at [HEIG-VD][heig].

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Plan](#plan)
- [How to improve our basic deployment](#how-to-improve-our-basic-deployment)
- [What you will need](#what-you-will-need)
- [Exercises](#exercises)
- [Frequently Asked Questions](#frequently-asked-questions)
  - [How do I do *X* with the command line?](#how-do-i-do-x-with-the-command-line)
  - [How do I connect to my server and stuff?](#how-do-i-connect-to-my-server-and-stuff)
  - [How do I do *Y* with Git?](#how-do-i-do-y-with-git)
- [References](#references)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## Legend

Parts of this guide are annotated with the following icons:

- :book: Slides or written documents pertaining to the various topics discussed during this course.
- :hammer: An exercise aimed at practicing a topic discussed in class.
- **:collision: This exercise is graded.**


## What you will need

- A Unix CLI
  - Linux/macOS users can use their standard Terminal
  - Windows users should install [Git for Windows][git-for-windows] which
    includes Git Bash
- [Git][git-downloads]
  - macOS users should [install the command-line tools][macos-cli]
  - Windows users should install [Git for Windows][git-for-windows]
- A free [GitHub][github] account
- [Google Chrome][chrome] (recommended, any browser with developer tools will do)
- A free [Render][render] account

## Plan

- Introduction
  - [:book: Command line](https://mediacomem.github.io/comem-archidep/2022-2023/subjects/cli?home=MediaComem%2Fcomem-archidep%23readme)
  - [:book: Secure Shell (SSH)](https://mediacomem.github.io/comem-archidep/2022-2023/subjects/ssh?home=MediaComem%2Fcomem-archidep%23readme)
- Version control
  - [:book: Version control with Git](https://mediacomem.github.io/comem-archidep/2022-2023/subjects/git?home=MediaComem%2Fcomem-archidep%23readme)
  - [:book: Git branching](https://mediacomem.github.io/comem-archidep/2022-2023/subjects/git-branching?home=MediaComem%2Fcomem-archidep%23readme)
  - [:book: Collaborating with Git](https://mediacomem.github.io/comem-archidep/2022-2023/subjects/git-collaborating?home=MediaComem%2Fcomem-archidep%23readme)
  - [:collision: :hammer: Collaborative exercise](https://github.com/MediaComem/comem-archidep-php-todo-exercise)
  - [:hammer: Clone a repository from a server](ex/git-clone-from-server.md)
  - [:hammer: Push a repository to a server](ex/git-push-to-server.md)
- Security
  - [:book: Open Web Application Security Project][owasp]
  - [:book: OWASP Top 10 - The Ten Most Critical Web Application Security Risks][owasp-top10]
  - [:book: The image gallery](./ex/security-gallery.md)
  - [:book: The CSRF bank](https://github.com/MediaComem/csrf-bank)
  - [:book: Phishing page](https://github.com/MediaComem/phishing)

- Basic deployment
  - [:book: Cloud computing](https://mediacomem.github.io/comem-archidep/2022-2023/subjects/cloud?home=MediaComem%2Fcomem-archidep%23readme)
  - [:book: Linux](https://mediacomem.github.io/comem-archidep/2022-2023/subjects/linux?home=MediaComem%2Fcomem-archidep%23readme)
  - [:book: Unix basics & administration](https://mediacomem.github.io/comem-archidep/2022-2023/subjects/unix-admin?home=MediaComem%2Fcomem-archidep%23readme)
  - [:hammer: Permissions](ex/unix-permissions.md)
    - [Solutions](ex/unix-permissions-solutions.md)
  - [:hammer: Pipeline](ex/unix-pipeline.md)
    - [Solutions](ex/unix-pipeline-solutions.md)
  - [:book: Unix processes](https://mediacomem.github.io/comem-archidep/2022-2023/subjects/unix-processes?home=MediaComem%2Fcomem-archidep%23readme)
  - [:book: Unix networking](https://mediacomem.github.io/comem-archidep/2022-2023/subjects/unix-networking?home=MediaComem%2Fcomem-archidep%23readme)
  - [:book: APT](https://mediacomem.github.io/comem-archidep/2022-2023/subjects/apt?home=MediaComem%2Fcomem-archidep%23readme)
  - [:hammer: Run your own virtual server on Microsoft Azure](ex/azure-setup.md)
  - [:hammer: Deploy a PHP application with SFTP](ex/sftp-deployment.md)
    - [Architecture](ex/sftp-deployment.md#architecture)

- Advanced deployment
  - [:hammer: Deploy a PHP application with Git](ex/git-clone-deployment.md)
    - [Architecture](ex/git-clone-deployment.md#architecture)
  - [:book: Twelve-factor app][12factor]
  - [:book: Unix environment variables](https://mediacomem.github.io/comem-archidep/2022-2023/subjects/unix-env-vars?home=MediaComem%2Fcomem-archidep%23readme)
  - [:hammer: Configure a PHP application through environment variables](ex/config-through-environment.md)
    - [Architecture](ex/config-through-environment.md#architecture)
  - [:book: Linux process management](https://mediacomem.github.io/comem-archidep/2022-2023/subjects/linux-process-management?home=MediaComem%2Fcomem-archidep%23readme)
  - [:hammer: Manage a PHP application with systemd as a Process Manager](ex/systemd-deployment.md)
    - [Solution](ex/systemd-deployment-solution.md)
    - [Architecture](ex/systemd-deployment.md#architecture)
  - [:book: Domain Name System (DNS)](https://mediacomem.github.io/comem-archidep/2022-2023/subjects/dns?home=MediaComem%2Fcomem-archidep%23readme)
  - [:hammer: Configure a domain name](ex/dns-configuration.md)
    - [Architecture](ex/dns-configuration.md#architecture)
  - [:book: Reverse proxying](https://mediacomem.github.io/comem-archidep/2022-2023/subjects/reverse-proxy?home=MediaComem%2Fcomem-archidep%23readme)
  - [:hammer: Deploy a static site with nginx](ex/nginx-static-deployment.md)
    - [Solution](ex/nginx-static-deployment-solution.md)
    - [Architecture](ex/nginx-static-deployment.md#architecture)
  - [:hammer: Deploy a PHP application with nginx and the FastCGI process manager](ex/nginx-php-fpm-deployment.md)
    - [Solution](ex/nginx-php-fpm-deployment-solution.md)
    - [Architecture](ex/nginx-php-fpm-deployment.md#architecture)
  - [:hammer: Deploy a multi-component web application with nginx](./ex/revprod-deployment.md)
    - [Solution](ex/revprod-deployment-solution.md)
    - [Architecture](ex/revprod-deployment.md#architecture)
  - [:book: TLS/SSL certificates](https://mediacomem.github.io/comem-archidep/2022-2023/subjects/ssl?home=MediaComem%2Fcomem-archidep%23readme)
  - [:hammer: Provision a Let's Encrypt TLS certificate with Certbot](ex/certbot-deployment.md)
    - [Architecture](ex/certbot-deployment.md#architecture)

- Automated deployment
  - [:book: Shell scripting](https://mediacomem.github.io/comem-archidep/2022-2023/subjects/shell-scripting?home=MediaComem%2Fcomem-archidep%23readme)
  - [:book: Git hooks](https://mediacomem.github.io/comem-archidep/2022-2023/subjects/git-hooks?home=MediaComem%2Fcomem-archidep%23readme)
  - [:hammer: Set up an automated deployment with Git hooks](ex/git-automated-deployment.md)
    - [Architecture](ex/git-automated-deployment.md#architecture)

- Complete Deployments
  - [:collision: :hammer: Deploy Flood It, a Spring Boot (Java) & Angular application with a PostgreSQL database](ex/floodit-deployment.md)
  - [:hammer: Deploy One Chat Room, an Express (Node.js) web application with a MongoDB database](ex/one-chat-room-deployment.md) (_extra_)
    - [Diagram](ex/end-result.pdf)
  - [:hammer: Deploy Big Browser, a Nest.js (Node.js) application with a Redis database](ex/big-browser-deployment.md) (_extra_)
  - [:hammer: Deploy WOPR, a Sinatra & Svelte application with a Redis database](ex/wopr-deployment.md) (_extra_)
  - [:hammer: Deploy RPS, a Node.js & Svelte web application with a PostgreSQL database](ex/rps-deployment.md) (_extra_)
  - [:hammer: Deploy Minesweeper, a Phoenix (Elixir) & Alpine.js application with a PostgreSQL database](./ex/minesweeper-deployment.md) (_extra_)
    - [Architecture](ex/minesweeper-deployment.md#books-architecture)

- Managed deployments
  - [:book: Platform-as-a-Service (PaaS)](https://mediacomem.github.io/comem-archidep/2022-2023/subjects/paas?home=MediaComem%2Fcomem-archidep%23readme)
  - [:hammer: Deploy a static site to GitHub Pages](./ex/github-pages-deployment.md)
  - [:hammer: Deploy a static site to Netlify](./ex/netlify-static-deployment.md)
  - [:hammer: Deploy web applications with a database to Render](./ex/render-database-deployment.md)

- _Advanced Topics (extra)_
  - [:book: Continuous software development](https://mediacomem.github.io/comem-archidep/2022-2023/subjects/continuous?home=MediaComem%2Fcomem-archidep%23readme)
  - [:book: Automated testing (2018)](https://mediacomem.github.io/comem-archidep/2022-2023/subjects/automated-testing?home=MediaComem%2Fcomem-archidep%23readme)
  - [:book: Automated testing (2020)](https://mediacomem.github.io/comem-archioweb/2022-2023/subjects/automated-testing/?home=MediaComem%2Fcomem-archioweb%23readme#1)
    - [:movie_camera: YouTube: Expecting Profesionnalism – Robert C. Martin](https://youtu.be/BSaAMQVq01E)
    - [:movie_camera: YouTube: GOTO 2017 – The Scribe's Oath – Robert C. Martin](https://youtu.be/Tng6Fox8EfI)
    - [:movie_camera: YouTube: The Future of Programming – Robert C. Martin](https://youtu.be/ecIWPzGEbFc)
  - [:hammer: Horizontally scale a web application with nginx as a load balancer](./ex/fibscale-deployment.md)
    - [Architecture](ex/fibscale-deployment.md#architecture)
  - [:hammer: Configure nginx as a load balancer](ex/load-balancing-deployment.md)


## Frequently Asked Questions

### What is the meaning of life?

42

### How do I do *X* with the command line?

[Read the command line cheatsheet](CLI-CHEATSHEET.md)
### How do I connect to my server and stuff?

[Read the system administration cheatsheet](SYSADMIN-CHEATSHEET.md)

### How do I do *Y* with Git?

[Read the Git cheatsheet](GIT-CHEATSHEET.md)

## References

These are the main references used throughout this course. More detailed and
additional links to various online articles and documentation can be found at
the end of each subject.

- [The Linux Documentation Project](https://tldp.org)
  - [Advanced Bash-Scripting Guide](https://tldp.org/LDP/abs/html/)
- [Building the Future of the Command Line](https://github.com/readme/featured/future-of-the-command-line)
- [SSH, The Secure Shell: The Definitive Guide - Daniel J. Barrett, Richard E. Silverman, Robert G. Byrnes](https://books.google.ch/books/about/SSH_The_Secure_Shell_The_Definitive_Guid.html?id=9FSaScltd-kC&redir_esc=y)
- [The Git Book](https://git-scm.com/book)
  - [Chapter 1 - Getting Started](https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control)
  - [Chapter 2 - Git Basics](https://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository)
  - [Chapter 3 - Git Branching](https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell)
  - [Chapter 5 - Distributed Git](https://git-scm.com/book/en/v2/Distributed-Git-Distributed-Workflows)
  - [Chapter 8 - Customizing Git - Git Hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)
- [Open Web Application Security Project](https://www.owasp.org)
  - [OWASP Top Ten](https://owasp.org/www-project-top-ten/)
- [Ops School Curriculum](https://www.opsschool.org)
  - [Sysadmin 101](https://www.opsschool.org/sysadmin_101.html)
  - [Unix Fundamentals 101](https://www.opsschool.org/unix_101.html)
  - [Unix Fundamentals 201](https://www.opsschool.org/unix_201.html)
  - [Networking 101](https://www.opsschool.org/networking_101.html)
  - [Networking 201](https://www.opsschool.org/networking_201.html)
- [The Internet Explained From First Principles](https://ef1p.com/internet)
- [The Twelve-Factor App](https://12factor.net)
- [Systemd Manual](https://www.freedesktop.org/software/systemd/man/)
  - [Unit Configuration](https://www.freedesktop.org/software/systemd/man/systemd.unit.html)
  - [Service Configuration](https://www.freedesktop.org/software/systemd/man/systemd.service.html)
- [nginx documentation](http://nginx.org/en/docs/)
  - [Beginner's Guide](http://nginx.org/en/docs/beginners_guide.html)
  - [Configuring HTTPS Servers](http://nginx.org/en/docs/http/configuring_https_servers.html)
- [Render Documentation](https://render.com/docs)

[Wikipedia](https://www.wikipedia.org) is also often referenced, namely these
and related articles:

- [Secure Shell](https://en.wikipedia.org/wiki/Secure_Shell)
- [Cloud Computing](https://en.wikipedia.org/wiki/Cloud_computing)
- [Internet Protocol](https://en.wikipedia.org/wiki/Internet_Protocol)
  - [IP Address](https://en.wikipedia.org/wiki/IP_address)
  - [Port (Computer Networking)](<https://en.wikipedia.org/wiki/Port_(computer_networking)>)
- [Domain Name System](https://en.wikipedia.org/wiki/Domain_Name_System)
- [Environment Variable](https://en.wikipedia.org/wiki/Environment_variable)
- [Reverse Proxy](https://en.wikipedia.org/wiki/Reverse_proxy)
- [Public Key Certificate](https://en.wikipedia.org/wiki/Public_key_certificate)

[12factor]: https://12factor.net
[12factor-codebase]: https://12factor.net/codebase
[12factor-config]: https://12factor.net/config
[apache]: https://httpd.apache.org
[chrome]: https://www.google.com/chrome/
[comem]: http://www.heig-vd.ch/comem
[comem-webdev]: https://github.com/MediaComem/comem-webdev
[git-downloads]: https://git-scm.com/downloads
[git-for-windows]: https://gitforwindows.org
[github]: https://github.com
[heig]: http://www.heig-vd.ch
[macos-cli]: https://www.freecodecamp.org/news/install-xcode-command-line-tools/
[nginx]: https://www.nginx.com
[owasp]: https://www.owasp.org
[owasp-top10]: https://owasp.org/www-project-top-ten/
[php-dev-server]: https://www.php.net/manual/en/features.commandline.webserver.php
[php-fpm]: https://www.php.net/manual/en/install.fpm.php
[render]: https://render.com
