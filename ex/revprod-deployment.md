# Deploy a multi-component web application with nginx

## Requirements

* [Node.js][node] 16.x

## Initial deployment

```bash
$> cd
$> git clone https://github.com/MediaComem/revprod-backend.git
$> cd revprod-backend
$> npm ci
$> cd ..
$> git clone https://github.com/MediaComem/revprod-landing-page.git
$> cd revprod-landing-page
$> npm ci
```

```conf
# /etc/systemd/system/revprod-backend.service

[Unit]
Description=Backend for The Revolutionary Product

[Service]
ExecStart=/usr/bin/node bin.js
WorkingDirectory=/home/simon_oulevay/revprod-backend
Environment="REVPROD_LISTEN_PORT=4200"
Environment="REVPROD_LANDING_PAGE_BASE_URL=http://revprod-landing.simon-oulevay.archidep.tech"
User=simon_oulevay
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

```conf
# /etc/systemd/system/revprod-landing-page.service

[Unit]
Description=Landing page for The Revolutionary Product

[Service]
ExecStart=/usr/bin/node bin.js
WorkingDirectory=/home/simon_oulevay/revprod-landing-page
Environment="REVPROD_LISTEN_PORT=4201"
Environment="REVPROD_BACKEND_BASE_URL=http://revprod-backend.simon-oulevay.archidep.tech"
User=simon_oulevay
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

```conf
# /etc/nginx/sites-available/revprod-backend

server {
  listen 80;
  server_name revprod-backend.simon-oulevay.archidep.tech;
  root /home/simon_oulevay/revprod-backend/public;

  location / {
    proxy_pass http://127.0.0.1:4200;
  }
}
```

```conf
# /etc/nginx/sites-available/revprod-landing-page

server {
  listen 80;
  server_name revprod-landing.simon-oulevay.archidep.tech;
  root /home/simon_oulevay/revprod-landing-page/public;

  location / {
    proxy_pass http://127.0.0.1:4201;
  }
}
```

```
$> sudo nginx -t
nginx: [emerg] could not build server_names_hash, you should increase server_names_hash_bucket_size: 64
nginx: configuration file /etc/nginx/nginx.conf test failed
```

## Using Cross-Origin Request Sharing (CORS)

https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS

```conf
# /etc/systemd/system/revprod-backend.service

Environment="REVPROD_CORS=true"
```

Disable.

## Using nginx to make both components appear as a single website

```conf
# /etc/systemd/system/revprod-backend.service

#Environment="REVPROD_LANDING_PAGE_BASE_URL=http://revprod.simon-oulevay.archidep.tech"
#Environment="REVPROD_CORS=false"
```

```conf
# /etc/systemd/system/revprod-landing-page.service

#Environment="REVPROD_BACKEND_BASE_URL=http://revprod-backend.simon-oulevay.archidep.tech"
```

```conf
# /etc/nginx/sites-available/revprod

server {
  listen 80;
  server_name revprod.simon-oulevay.archidep.tech;
  root /home/simon_oulevay/revprod-landing-page/public;

  location ~ /(comments|share) {
    proxy_pass http://127.0.0.1:4200;
  }

  location / {
    proxy_pass http://127.0.0.1:4201;
  }
}
```

[node]: https://nodejs.org