# Domain Name Configuration

The goal of this exercise is to set up a real domain name for your application.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Setup](#setup)
- [Connect to Gandi.net](#connect-to-gandinet)
- [Access the domain name](#access-the-domain-name)
- [What have I done?](#what-have-i-done)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## Setup

Make sure you have completed the [previous exercise](systemd-deployment.md).



## Connect to Gandi.net

Connect to [Gandi.net](https://gandi.net) with the provided user account and
create two new `A` record to map subdomains to your server's IP address:

1. Your first subdomain should be `john-doe.archidep.tech`, where `john-doe`
   is your name on your server, meaning that you should use `john-doe` (your
   username) as the **name of the DNS record**.
2. Then, create a wildcard subdomain using `*.john-doe` as the **name of the DNS
   record**, and the same IP address. This will direct any second-level
   subdomain like `foo.john-doe.archidep.tech` to your server.

Assuming your server's IP address is `W.X.Y.Z` and your username is `john-doe`,
you should have the following DNS records (among others) in your zone file:

```
*.john-doe 1800 IN A W.X.Y.Z
john-doe 1800 IN A W.X.Y.Z
```



## Access the domain name

Once you have configured it correctly, you (and everybody else) should be able
to access the todolist application at http://john-doe.archidep.tech:3000 in
your browser (if you have completed the previous exercises).

> You might have to wait a few minutes for the change to take effect, especially
> if you make a mistake in configuring the DNS record and then fix it. This is
> because DNS records are cached for a time (the TTL you configured), by all
> intermediaries and also by your machine.



## What have I done?

You have created a mapping in the [domain name system][dns] between your custom
subdomain (e.g. `john-doe.archidep.tech`) and the IP address of your server.

You have done this by modifying the [DNS zone file][dns-zone-file] for the
course's domain (`archidep.tech`). When a computer requests to know the IP
address for your subdomain, the [DNS name servers][dns-name-server] of the
domain provider (gandi.net) will give them the IP address in the mapping you
have configured.

This allows your applications and websites to be accessible through a
human-friendly domain name instead of an IP address.



[dns]: https://en.wikipedia.org/wiki/Domain_Name_System
[dns-name-server]: https://en.wikipedia.org/wiki/Name_server
[dns-zone-file]: https://en.wikipedia.org/wiki/Zone_file
[systemd]: https://en.wikipedia.org/wiki/Systemd
