# Solution: [Deploy a PHP website with nginx and the FastCGI process manager](./nginx-php-fpm-deployment.md)

<!-- START doctoc -->
<!-- END doctoc -->

Once you have adapted PHP FPM's configuration as instructed, you should create
the `/etc/nginx/sites-available/todolist` file on your server and it should look
something this:

```
server {
  listen 80;
  server_name todolist.john-doe.archidep.ch;
  root /home/john_doe/todolist-repo;

  # Proxy requests for dynamic content to another server/application.
  location / {
    include snippets/fastcgi-php.conf;
    fastcgi_pass localhost:9000;
  }
}
```

> :gem: Replace `john-doe` with your subdomain and `john_doe` with your Unix
> username.

You must enable that configuration by creating the appropriate link:

```bash
$> sudo ln -s /etc/nginx/sites-available/todolist /etc/nginx/sites-enabled/todolist
```

You must then ask nginx to reload its configuration:

```bash
$> sudo nginx -t
$> sudo nginx -s reload
```
