# Deploy a PHP website with nginx and the FastCGI process manager

This guide describes how to deploy the same [PHP Todolist][repo] as in previous exercices,
but this time behind nginx acting a reverse proxy,
and with [FastCGI Process Manager (FPM)][php-fpm] instead of the PHP development server
(which is more suitable for production).

This guide assumes that you are familiar with [reverse proxying][slides],
that you have nginx installed, and that you have done the [DNS exercice][dns-ex] and the [systemd exercice][systemd-ex].

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Using PHP FPM instead of the PHP development server](#using-php-fpm-instead-of-the-php-development-server)
- [Add a the `TODOLIST_DB_PASS` environment variable to PHP FPM](#add-a-the-todolist_db_pass-environment-variable-to-php-fpm)
  - [Reload PHP FPM](#reload-php-fpm)
- [Create an nginx configuration file to serve the application](#create-an-nginx-configuration-file-to-serve-the-application)
  - [Enable the nginx configuration](#enable-the-nginx-configuration)
  - [Reload the nginx configuration](#reload-the-nginx-configuration)
- [See it in action](#see-it-in-action)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## Using PHP FPM instead of the PHP development server

When you did the [systemd exercice][systemd-ex],
you used the PHP development server (with the command `/usr/bin/php -S 0.0.0.0:3000`).

As [its documentation states][php-dev-server], it is meant for development, not to be used on a production server.
One of the main reasons it's a bad idea to use it on a server is beacuse it is **single-threaded**, and can only serve *one request at a time*.

During the [SFTP exercice][sftp-ex], you installed the `php-fpm` package,
which provides the [FastCGI Process Manager (FPM)][php-fpm].

It is both a **process manager** and a **FastCGI server**:

* It will run multiple PHP processes to be able to serve requests from multiple clients at the same time.
* A web server (such as nginx) can ask it to execute PHP files using the [FastCGI protocol][fastcgi].

> Use the following command for more information on how PHP FPM manages processes (for version 7.2):
>
>     $> grep -A 50 -m 1 "child processes" /etc/php/7.2/fpm/pool.d/www.conf

The `php-fpm` package is integrated with systemd out of the box
(its service file is `/lib/systemd/system/php7.2-fpm.service` for version 7.2).
It should already be running:

```bash
$> sudo systemctl status php7.2-fpm
● php7.2-fpm.service - The PHP 7.2 FastCGI Process Manager
   Loaded: loaded (/lib/systemd/system/php7.2-fpm.service; enabled; vendor preset: enabled)
   Active: active (running) since Thu 2019-01-10 17:58:07 UTC; 27min ago
   ...
```



## Add a the `TODOLIST_DB_PASS` environment variable to PHP FPM

The PHP todolist application requires the `TODOLIST_DB_PASS` environment variable to successfully connect to its database.
You previously set that variable in the systemd service file you created during the [systemd exercice][systemd-ex]: `/etc/systemd/system/todolist.service`.

Now that [PHP FPM][php-fpm] will be running the application, you need to tell it to add this variable.

The PHP FPM configuration file which determines how processes are launched is `/etc/php/7.2/fpm/pool.d/www.conf` (for version 7.2).
Edit this file:

```bash
$> sudo nano /etc/php/7.2/fpm/pool.d/www.conf
```

Find the environment section which looks like this:

```
; Pass environment variables like LD_LIBRARY_PATH. All $VARIABLEs are taken from
; the current environment.
; Default Value: clean env
;env[HOSTNAME] = $HOSTNAME
;env[PATH] = /usr/local/bin:/usr/bin:/bin
;env[TMP] = /tmp
;env[TMPDIR] = /tmp
;env[TEMP] = /tmp
```

> You can use `Ctrl-W` in nano to search for text.
> For example, search for `env[` in this file.

Add the following line to define the `TODOLIST_DB_PASS` variable with the correct value (without a `;` at the beginning):

```
env[TODOLIST_DB_PASS] = "chAngeMeN0w!"
```

Exit with `Ctrl-X` and save when prompted.

### Reload PHP FPM

For the change to take effect, you must restart the PHP FPM service:

```bash
$> sudo systemctl restart php7.2-fpm
```

Make sure it is still running:

```bash
$> sudo systemctl status php7.2-fpm
● php7.2-fpm.service - The PHP 7.2 FastCGI Process Manager
   Loaded: loaded (/lib/systemd/system/php7.2-fpm.service; enabled; vendor preset: enabled)
   Active: active (running) since Thu 2019-01-10 17:58:07 UTC; 3s ago
   ...
```

> If it is no longer running, you may have corrupted the configuration file.



## Create an nginx configuration file to serve the application

Create an nginx configuration file named `todolist` for the application:

```bash
$> sudo nano /etc/nginx/sites-available/todolist
```

Use the following configuration
(**replacing `john-doe` in the `server_name` directive and `john_doe` in the `root` directive with appropriate values**):

```
server {
  listen 80;
  server_name todolist.john-doe.archidep-2018.media;
  root /home/john_doe/todolist-repo;

  # Proxy requests for dynamic content to PHP FPM.
  location / {
    include snippets/fastcgi-php.conf;
    fastcgi_pass unix:/var/run/php/php7.2-fpm.sock;
  }
}
```

> Here you are using nginx as a **reverse proxy**.
> The [`fastcgi_pass` directive][nginx-fastcgi] instructs nginx to forward all requests to a FastCGI server.
>
> The `/var/run/php/php7.2-fpm.sock` file is a [Unix socket][unix-socket]
> allowing nginx to communicate with PHP FPM
> (i.e. send and receive binary data using the FastCGI protocol).
>
> When a request arrives for the subdomain `todolist.john-doe.archidep-2018.media`,
> nginx will forward that request to PHP FPM through the socket file.
> PHP FPM will then execute the PHP files in `/home/john_doe/todolist-repo`
> and give the result back to nginx to serve to the client.

### Enable the nginx configuration

Enable the `todolist` configuration by creating the correct symbolic link:

```bash
$> sudo ln -s /etc/nginx/sites-available/todolist /etc/nginx/sites-enabled/todolist
```

Make sure the symbolic link points to the correct file:

```bash
$> ls -l /etc/nginx/sites-enabled/todolist
lrwxrwxrwx 1 root root 32 Jan 10 17:07 /etc/nginx/sites-enabled/todolist -> /etc/nginx/sites-available/todolist
```

### Reload the nginx configuration

Check whether the changes you have made are valid:

```bash
$> sudo nginx -t
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

Tell nginx to reload its configuration:

```bash
$> sudo nginx -s reload
```



## See it in action

Visit http://todolist.john-doe.archidep-2018.media (replacing `john-doe` with your username)
and you should see the PHP todolist working.



[dns-ex]: dns-configuration.md
[fastcgi]: https://en.wikipedia.org/wiki/FastCGI
[php-dev-server]: http://php.net/manual/en/features.commandline.webserver.php
[php-fpm]: http://php.net/manual/en/install.fpm.php
[repo]: https://github.com/MediaComem/comem-archidep-php-todo-exercise
[nginx-ex]: nginx-static-deployment.md
[nginx-fastcgi]: http://nginx.org/en/docs/http/ngx_http_fastcgi_module.html#fastcgi_pass
[sftp-ex]: sftp-deployment.md
[systemd-ex]: systemd-deployment.md
[unix-socket]: https://en.wikipedia.org/wiki/Unix_domain_socket
