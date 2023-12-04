# Solution: [Deploy a multi-component web application with nginx](./revprod-deployment.md)

<!-- START doctoc -->
<!-- END doctoc -->

Once you reach the phase titled "Using nginx to make both components appear as a
single website", you should create the `/etc/nginx/sites-available/revprod` file
on your server and it should look something this:

```
server {
  listen 80;
  server_name revprod.john-doe.archidep.ch;
  root /home/john_doe/revprod-landing-page/public;

  # Proxy requests for dynamic content to another server/application.
  location / {
    proxy_pass http://localhost:4201;
  }

  location /comments {
    proxy_pass http://localhost:4200;
  }

  location /share {
    proxy_pass http://localhost:4200;
  }
}
```

> :gem: Replace `john-doe` with your subdomain and `john_doe` with your Unix
> username.
>
> :space_invader: If you know your [regular expressions][regexp], you can also
> combine the last two location blocks into one:
>
> ```
>   location ~ \/(comments|share) {
>     proxy_pass http://localhost:4200;
>   }
> ```

You must enable that configuration by creating the appropriate link:

```bash
$> sudo ln -s /etc/nginx/sites-available/revprod /etc/nginx/sites-enabled/revprod
```

You must then ask nginx to reload its configuration:

```bash
$> sudo nginx -t
$> sudo nginx -s reload
```

[regexp]: https://en.wikipedia.org/wiki/Regular_expression
