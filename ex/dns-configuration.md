# Domain Name Configuration

This guide describes how to set up a real domain name for your application.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Setup](#setup)
- [Connect to Gandi.net](#connect-to-gandinet)
- [Access the domain name](#access-the-domain-name)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## Setup

Make sure you have done the [previous exercise](systemd-deployment.md).



## Connect to Gandi.net

Connect to [Gandi.net](https://gandi.net) with the provided user account and create a new `A` record to map a subdomain to your server's IP address.

Your subdomain should be `john-doe.archidep-2018.media`, where `john-doe` is your name on your server,
meaning that you should use `john-doe` (your username) as the **name of the DNS record**.



## Access the domain name

Once you have configured it correctly, you should be able to access the todolist application at `john-doe.archidep-2018.media` in your browser.

*You might have to wait a few minutes for the change to take effect, especially if you make a mistake in configuring the DNS record and then fix it.*



[systemd]: https://en.wikipedia.org/wiki/Systemd
