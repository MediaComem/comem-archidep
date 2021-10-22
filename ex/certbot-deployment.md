# Provision an SSL certificate using Certbot by Let's Encrypt

The goal of this exercice is to provision a [Let's Encrypt][letsencrypt] [SSL
certificate][certificate] for an application deployed in previous exercices
using [Certbot][certbot].

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Prerequisites](#prerequisites)
- [Install Certbot & generate a certificate](#install-certbot--generate-a-certificate)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## Prerequisites

This exercise assumes that you have deployed at least one web site or
application during previous exercices, and that you have configured nginx to
serve it.

## Install Certbot & generate a certificate

Follow the instructions for nginx and Ubuntu 20.04 on the [home page][certbot]:

> When the instructions ask you to "Choose how you'd like to run Certbot", you
> can choose the simplest option which is to "get a certificate and have Certbot
> edit your Nginx configuration automatically to serve it".

Once you are done, your web site or application should be accessible over HTTPS.

You should take a look at your nginx configuration file(s) in
`/etc/nginx/sites-available`, to see the changes Certbot has made.



[certbot]: https://certbot.eff.org
[certificate]: https://en.wikipedia.org/wiki/Public_key_certificate
[letsencrypt]: https://letsencrypt.org
