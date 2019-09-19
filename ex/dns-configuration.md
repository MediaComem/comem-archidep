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

Connect to [Gandi.net](https://gandi.net) with the provided user account and create two new `A` record to map subdomains to your server's IP address:

1. Your first subdomain should be `john-doe.archidep.media`, where `john-doe` is your name on your server,
   meaning that you should use `john-doe` (your username) as the **name of the DNS record**.
2. Then, create a wildcard subdomain using `*.john-doe` as the **name of the DNS record**, and the same IP address.
   This will direct any second-level subdomain like `foo.john-doe.archidep.media` to your server.

Assuming your server's IP address is `1.2.3.4` and your username is `john-doe`,
you should have the following DNS records (among others) in your zone file:

```
*.john-doe 1800 IN A 1.2.3.4
john-doe 1800 IN A 1.2.3.4
```



## Access the domain name

Once you have configured it correctly,
you should be able to access the todolist application at http://john-doe.archidep.media:3000 in your browser
(provided you did the previous exercises).

*You might have to wait a few minutes for the change to take effect,
especially if you make a mistake in configuring the DNS record and then fix it.*



[systemd]: https://en.wikipedia.org/wiki/Systemd
