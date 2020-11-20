# Deploy a static site with nginx

The goal of this exercise is to deploy a static website (only HTML, JavaScript
and CSS) with [nginx][nginx].

It assumes that you are familiar with [reverse proxying][slides]
and that you have done the [previous DNS configuration exercise][previous-ex],
where you configured an A record for your server.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Put the static website on the server](#put-the-static-website-on-the-server)
- [Create an nginx configuration file to serve the website](#create-an-nginx-configuration-file-to-serve-the-website)
  - [Enable the nginx configuration](#enable-the-nginx-configuration)
  - [Reload the nginx configuration](#reload-the-nginx-configuration)
- [See it in action](#see-it-in-action)
- [End result](#end-result)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## Put the static website on the server

It is suggested that you use the provided [HTML, JavaScript and CSS
clock][repo], but you could deploy any other static HTML website.

**Connect to your server**, then clone the following repository into your home
directory: https://github.com/MediaComem/static-clock-website

Make sure the files are there:

```bash
$> ls static-clock-website
index.html  README.md  script.js  style.css
```



## Create an nginx configuration file to serve the website

Create an nginx configuration file for the website. You may name the file
`clock` and put it in nginx's `/etc/nginx/sites-available` directory. You can do
that with nano or Vim. You will need to use `sudo` as that directory is only
writable by `root`.

Take the static configuration that was [presented during the
course][nginx-static-conf] and put it in the file. You should modify it to:

* Use the subdomain you configured for your server during the previous DNS
  exercise.
* Serve the files in the repository you just cloned.

### Enable the nginx configuration

By default, configurations stored in the `sites-available` directory are
available, but not enabled. Indeed, if you check which directories are included,
you will see that `sites-enabled` is there, but not `sites-available`:

```bash
$> cat /etc/nginx/nginx.conf|grep include
include /etc/nginx/modules-enabled/*.conf;
include /etc/nginx/mime.types;
include /etc/nginx/conf.d/*.conf;
include /etc/nginx/sites-enabled/*;
```

The convention is to create a symbolic link in `sites-enabled` to the actual
configuration file in `sites-available`. This allows you to work on your
configuration for a while before enabling it.

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

First, you should check whether the changes you have made are valid. The `nginx
-t` command loads all the nginx configuration (including files added with
`include`) and checks that they are valid:

```bash
$> sudo nginx -t
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

> If an error occurs here, you may have made a mistake in the configuration.
>
> If you get an error about `server_names_hash_bucket_size`, it may be because
> your domain name (the value of your `server_name` directive) is too long for
> nginx's default settings.
>
> In that case, edit the main nginx configuration with `sudo nano
> /etc/nginx/nginx.conf` and add the following line **in the `http` section**:
>
>     server_names_hash_bucket_size 256;

Nginx reloads its configuration [when it receives the `HUP`
signal][nginx-signals]. You could find the process ID of the `nginx` master
process and send the signal with `kill -s HUP <ID>`.

However, the `nginx` command helpfully allows you to do that in a much simpler
way:

```bash
$> sudo nginx -s reload
```

> You can also do the same thing through systemd with the following command:
> `sudo systemctl nginx reload`. This will also ask nginx to reload its
> configuration.

If the command indicates no errors, nginx should have reloaded its
configuration.



## See it in action

Visit the subdomain of your server, e.g. http://john-doe.archidep.online
(replacing `john-doe` with your username) and you should see the website
working.



## End result

![Diagram](nginx-static-deployment.png)

> [PDF version](nginx-static-deployment.pdf).



[nginx]: http://nginx.org/
[nginx-signals]: http://nginx.org/en/docs/control.html
[nginx-static]: https://docs.nginx.com/nginx/admin-guide/web-server/serving-static-content/
[nginx-static-conf]: https://mediacomem.github.io/comem-archidep/2020-2021/subjects/reverse-proxy/?home=MediaComem%2Fcomem-archidep%23readme#28
[previous-ex]: dns-configuration.md
[repo]: https://github.com/MediaComem/static-clock-website
[slides]: https://mediacomem.github.io/comem-archidep/2019-2020/subjects/reverse-proxy/?home=MediaComem%2Fcomem-archidep%23readme#1
