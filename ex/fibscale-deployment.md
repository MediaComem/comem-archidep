# Scale a web application with nginx as a load balancer

https://www.stevenrombauts.be/2019/01/run-multiple-instances-of-the-same-systemd-unit/

```bash
sudo apt update
sudo apt install ruby-full build-essential
sudo gem install bundler
cd
git clone https://github.com/MediaComem/fibscale.git
cd fibscale
bundle install
```

```conf
# /etc/systemd/system/fibscale.service

[Unit]
Description=Fibonacci calculator

[Service]
ExecStart=/usr/local/bin/bundle exec ruby fibscale.rb
WorkingDirectory=/home/simon_oulevay/fibscale
Environment="FIBSCALE_PORT=4202"
User=simon_oulevay
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

```conf
# /etc/nginx/sites-available/fibscale

server {
  listen 80;
  server_name fibscale.simon-oulevay.archidep.tech;

  location / {
    proxy_pass http://127.0.0.1:4202;
  }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/fibscale /etc/nginx/sites-enabled/
sudo nginx -t
sudo nginx -s reload
```

```bash
sudo apt install python3 python3-pip
sudo pip3 install locust
```

```conf
# /etc/systemd/system/fibscale-locust.service

[Unit]
Description=Fibonacci calculator Locust instance for load testing
After=fibscale.service

[Service]
ExecStart=/usr/local/bin/locust
WorkingDirectory=/home/simon_oulevay/fibscale
User=simon_oulevay
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

```conf
# /etc/nginx/sites-available/fibscale

server {
  listen 80;
  server_name locust.fibscale.simon-oulevay.archidep.tech;

  location / {
    proxy_pass http://127.0.0.1:8089;
  }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/fibscale-locust /etc/nginx/sites-enabled/fibscale-locust
```

```conf
# /etc/systemd/system/fibscale-locust.service

Environment="FIBSCALE_DELAY=1"
```

```bash
sudo systemctl daemon-reload
sudo systemctl restart fibscale
```

```bash
sudo systemctl stop fibscale
sudo systemctl disable fibscale
```

```conf
# /etc/systemd/system/fibscale.service

Description=Fibonacci calculator instance %i
ExecStart=/usr/local/bin/bundle exec ruby fibscale.rb %i
Environment="FIBSCALE_PORT=4200%i"
PartOf=fibscales.target
# Remove WantedBy
```

```bash
sudo mv /etc/systemd/system/fibscale.service /etc/systemd/system/fibscale@.service
```

```conf
# /etc/systemd/system/fibscales.target

[Unit]
Description=Fibscale calculator cluster
Requires=fibscale@1.service

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable fibscales.target
sudo systemctl start fibscales.target
```

```conf
# /etc/nginx/sites-available/fibscale

upstream fibscale {
  server 127.0.0.1:42001;
}

server {
  listen 80;
  server_name fibscale.simon-oulevay.archidep.tech;

  location / {
    proxy_pass http://fibscale;
  }
}
```
