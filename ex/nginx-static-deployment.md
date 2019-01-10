# Deploy a static site with nginx

This guide describes how to deploy a static website with [nginx][nginx].

It assumes that you are familiar with [reverse proxying][slides]
and that you have done the [previous DNS configuration exercice][previous-ex],
where you configured an A record for your server.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Put the static website on the server](#put-the-static-website-on-the-server)
- [Create an nginx configuration file to serve the website](#create-an-nginx-configuration-file-to-serve-the-website)
  - [Enable the nginx configuration](#enable-the-nginx-configuration)
  - [Reload the nginx configuration](#reload-the-nginx-configuration)
- [See it in action](#see-it-in-action)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## Put the static website on the server

It is suggested that you use the provided [HTML, JavaScript and CSS clock][repo]
, but you could deploy any other static HTML website.

**Connect to your server**, then clone the repository into your home directory:

```bash
$> cd
$> git clone https://github.com/MediaComem/static-clock-website.git
```

Make sure the files are there:

```bash
$> ls static-clock-website
index.html  README.md  script.js  style.css
```



## Create an nginx configuration file to serve the website

Create an nginx configuration file for the website.
You will name the file `clock` and put it in nginx's `/etc/nginx/sites-available` directory.

Use the following command to create and edit this file:

```bash
$> sudo nano /etc/nginx/sites-available/clock
```

Paste the following configuration into the file
(**replacing `john-doe` in the `server_name` directive and `john_doe` in the `root` directive by appropriate values for your server**):

```
server {

  listen 80;
  server_name john-doe.archidep-2018.media;

  # Serve files from this directory.
  root /home/john_doe/static-clock-website;

  # Serve the following index page by default.
  index index.html;

  # Cache images, icons, video, audio, HTC, etc.
  location ~* \.(?:jpg|jpeg|gif|png|ico|cur|gz|svg|mp4|ogg|ogv|webm|htc)$ {
    access_log off;
    add_header Cache-Control "max-age=2592000";
  }
}
```

### Enable the nginx configuration

By default, configurations stored in the `sites-available` directory are available, but not enabled.
Indeed, if you check which directories are included, you will see that `sites-enabled` is there, but not `sites-available`:

```bash
$> cat /etc/nginx/nginx.conf|grep include
include /etc/nginx/modules-enabled/*.conf;
include /etc/nginx/mime.types;
include /etc/nginx/conf.d/*.conf;
include /etc/nginx/sites-enabled/*;
```

The convention is to create a symbolic link in `sites-enabled` to the actual configuration file in `sites-available`.
This allows you to work on your configuration for a while before enabling it.

Enable the `clock` configuration by creating the correct symbolic link:

```bash
$> sudo ln -s /etc/nginx/sites-available/clock /etc/nginx/sites-enabled/clock
```

Make sure the symbolic link points to the correct file:

```bash
$> ls -l /etc/nginx/sites-enabled/clock
lrwxrwxrwx 1 root root 32 Jan 10 17:07 /etc/nginx/sites-enabled/clock -> /etc/nginx/sites-available/clock
```

### Reload the nginx configuration

Nginx does not automatically reload its configuration files when they change.

First, you should check whether the changes you have made are valid.
The `nginx -t` command loads all the nginx configuration (including files added with `include`)
and checks that they are valid:

```bash
$> sudo nginx -t
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

> If an error occurs here, you have made a mistake in the configuration.

Nginx reloads its configuration [when it receives the `HUP` signal][nginx-signals].
You could find the process ID of the `nginx` master process and send the signal with `kill -s HUP <ID>`.

However, the `nginx` command helpfully allows you to do that in a much simpler way:

```bash
$> sudo nginx -s reload
```

Nginx should have reloaded its configuration.



## See it in action

Visit http://john-doe.archidep-2018.media (replacing `john-doe` with your username)
and you should see the website working.



[nginx]: http://nginx.org/
[nginx-signals]: http://nginx.org/en/docs/control.html
[nginx-static]: https://docs.nginx.com/nginx/admin-guide/web-server/serving-static-content/
[previous-ex]: dns-configuration.md
[repo]: https://github.com/MediaComem/static-clock-website
[slides]: https://mediacomem.github.io/comem-webdev-docs/2018-2019/subjects/reverse-proxy/?home=MediaComem%2Fcomem-archidep%23readme#1
