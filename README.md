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
  * [Unix basics](https://mediacomem.github.io/comem-webdev-docs/2018-2019/subjects/unix-admin?home=MediaComem%2Fcomem-archidep%23readme)
  * [Unix processes](https://mediacomem.github.io/comem-webdev-docs/2018-2019/subjects/unix-processes?home=MediaComem%2Fcomem-archidep%23readme)
  * Twelve-factor app
* Reverse proxying
  * Nginx
  * Domain Name System (DNS)
  * SSL certificate
* Automated deployment
  * Scripting
  * Git hooks
* Continuous integration
  * Automated testing
* Continuous delivery
  * Heroku
  * Travis



## What you will need

* A Unix CLI (Git Bash is included with Git on Windows)
* [Git][git-downloads]
* A free [GitHub][github] account
* [Google Chrome][chrome] (recommended, any browser with developer tools will do)
* A free [Heroku][heroku] account
* The [Heroku CLI][heroku-cli]



## Exercises

The list of exercises can be found [here](EXERCISES.md).

Some exercises are part of the course's evaluation.



## Useful links

* [Command line cheatsheet][cli-cheatsheet]
* [Git cheatsheet][git-cheatsheet]



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
