# Solution: [Deploy a static site with nginx](./nginx-static-deployment.md)

<!-- START doctoc -->
<!-- END doctoc -->

Once you have cloned the static clock repository as instructed, you should
create the `/etc/nginx/sites-available/clock` file on your server and it should
look something this:

```
server {
  listen 80;
  server_name jde.archidep.ch;
  root /home/jde/static-clock-website;
  index index.html;

  # Cache images, icons, video, audio, HTC, etc.
  location ~* \.(?:jpg|jpeg|gif|png|ico|cur|gz|svg|mp4|ogg|ogv|webm|htc)$ {
    access_log off;
    add_header Cache-Control "max-age=2592000";
  }
}
```

> :gem: Replace `jde` with your subdomain and `jde` with your Unix username.

You must enable that configuration by creating the appropriate link:

```bash
$> sudo ln -s /etc/nginx/sites-available/clock /etc/nginx/sites-enabled/clock
```

You must then ask nginx to reload its configuration:

```bash
$> sudo nginx -t
$> sudo nginx -s reload
```
