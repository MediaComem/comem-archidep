# Deploy a multi-component web application with nginx

The goal of this exercise is to understand the challenges of deploying a
multi-component web application, and how a reverse proxy like nginx can help.

This guide assumes that you are familiar with [reverse proxying][slides], that
you have nginx installed and running on a server, and that you have a DNS
wildcard entry preconfigured to make various subdomains
(`*.john-doe.archidep.ch` in this guide) point to that server.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Legend](#legend)
- [:gem: Requirements](#gem-requirements)
- [:gem: The application](#gem-the-application)
  - [:books: Multi-component applications](#books-multi-component-applications)
- [:exclamation: Deploy the components separately](#exclamation-deploy-the-components-separately)
  - [:exclamation: Deploy the revprod landing page](#exclamation-deploy-the-revprod-landing-page)
  - [:exclamation: Deploy the revprod backend](#exclamation-deploy-the-revprod-backend)
- [:exclamation: It's not working!](#exclamation-its-not-working)
  - [:books: The Same-Origin Policy](#books-the-same-origin-policy)
- [:exclamation: Using Cross-Origin Request Sharing (CORS)](#exclamation-using-cross-origin-request-sharing-cors)
  - [:exclamation: Disabling CORS](#exclamation-disabling-cors)
- [:exclamation: Using nginx to make both components appear as a single website](#exclamation-using-nginx-to-make-both-components-appear-as-a-single-website)
- [:checkered_flag: What have I done?](#checkered_flag-what-have-i-done)
  - [:classical_building: Architecture](#classical_building-architecture)
- [:boom: Troubleshooting](#boom-troubleshooting)
  - [:boom: `nginx: [emerg] could not build server_names_hash`](#boom-nginx-emerg-could-not-build-server_names_hash)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Legend

Parts of this guide are annotated with the following icons:

- :exclamation: A task you **MUST** perform to complete the exercise.
- :question: An optional step that you _may_ perform to make sure that
  everything is working correctly.
- :warning: **Critically important information about the exercise.**
- :gem: Tips on the exercise, reminders about previous exercises, or
  explanations about how this exercise differs from the previous one.
- :space_invader: More advanced tips on how to save some time.
- :books: Additional information about the exercise or the commands and tools
  used.
- :checkered_flag: The end of the exercise.
  - :classical_building: The architecture of what you deployed during the
    exercise.
- :boom: Troubleshooting tips: how to fix common problems you might encounter.

## :gem: Requirements

The following requirements must be installed on your server:

- [Node.js][node] 18.x ([installation instructions][node-install])

## :gem: The application

The application you will deploy is **Revprod**, a marketing web application
where customers can leave testimonials about **The Revolutionary Product**. This
application has been developed as two separate components:

- The [revprod landing
  page](https://github.com/MediaComem/revprod-landing-page): the main page of
  the application that describes the product and displays customers'
  testimonials.

  This component is basically a static page with no server-side logic. It loads
  testimonials from the backend using AJAX requests.

- The [revprod backend](https://github.com/MediaComem/revprod-backend): an
  application that allows customers to provide their testimonials.

  This component stores the customers' testimonials in an embedded file
  database.

### :books: Multi-component applications

This separation is for the purposes of the exercise, but large applications are
often split like this for various reasons.

Some **advantages** of a multi-component application are:

* Each component can be developed and deployed separately.
* Each component could be developed by a separate team, using their favorite
  programming language and tools.
* Each team could deploy new versions of their component independently.

The **disadvantages** are:

* It is more complex to manage the development and
  deployment of a multi-component application.
* Separate teams working together must agree on the API that the components use
  to communicate and not break that contract.
* On the deployment side, you have to make sure that you always deploy
  compatible versions of all components together.

## :exclamation: Deploy the components separately

Let's start by deploying the revprod backend and frontend separately at these
URLs (replacing `john-doe` with your name as you configured it during the DNS
exercise):

- `http://revprod-backend.john-doe.archidep.ch`
- `http://revprod-landing.john-doe.archidep.ch`

### :exclamation: Deploy the revprod landing page

Clone the landing page repository on your server and install the required
dependencies:

```bash
$> cd
$> git clone https://github.com/MediaComem/revprod-landing-page.git
$> cd revprod-landing-page
$> npm ci
```

Create a Systemd unit file named `/etc/systemd/system/revprod-landing.service`
(e.g. with `nano`) to execute this component and make it listen on port 4201:

```conf
[Unit]
Description=Landing page for The Revolutionary Product

[Service]
ExecStart=/usr/bin/node bin.js
WorkingDirectory=/home/john_doe/revprod-landing-page
Environment="REVPROD_LISTEN_PORT=4201"
# Public URL at which the backend can be accessed
Environment="REVPROD_BACKEND_BASE_URL=http://revprod-backend.john-doe.archidep.ch"
User=john_doe
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

> :gem: Replace `john_doe` with your name in the `WorkingDirectory` and `User`
> options, as well as `john-doe` in the second `Environment` option indicating
> the URL of the landing page.

Enable and start your new service:

```bash
$> sudo systemctl enable revprod-landing
$> sudo systemctl start revprod-landing
```

> :gem: You can check that it is running with `sudo systemctl status
> revprod-landing`.

Create an nginx site configuration file
`/etc/nginx/sites-available/revprod-landing` (e.g. with `nano`) to expose this
component:

```conf
server {
  listen 80;
  server_name revprod-landing.john-doe.archidep.ch;
  root /home/john_doe/revprod-landing-page/public;

  location / {
    proxy_pass http://127.0.0.1:4201;
  }
}
```

> :gem: Replace `john-doe` with your name in the `server_name` directive, as
> well as `john_doe` in the `root` directive.

Enable that configuration with the following command:

```bash
$> sudo ln -s /etc/nginx/sites-available/revprod-landing /etc/nginx/sites-enabled/revprod-landing
```

Check and reload nginx's configuration:

```bash
$> sudo nginx -t
$> sudo nginx -s reload
```

You should then be able to access the revprod landing page at
http://revprod-landing.john-doe.archidep.ch.

![Revprod landing page](../images/revprod-landing.png)

### :exclamation: Deploy the revprod backend

Clone the backend repository on your server and install the required
dependencies:

```bash
$> cd
$> git clone https://github.com/MediaComem/revprod-backend.git
$> cd revprod-backend
$> npm ci
```

Create a Systemd unit file named `/etc/systemd/system/revprod-backend.service`
(e.g. with `nano`) to execute this component and make it listen on port 4200:

```conf
[Unit]
Description=Backend for The Revolutionary Product

[Service]
ExecStart=/usr/bin/node bin.js
WorkingDirectory=/home/john_doe/revprod-backend
Environment="REVPROD_LISTEN_PORT=4200"
# Public URL at which the frontend can be accessed
Environment="REVPROD_LANDING_PAGE_BASE_URL=http://revprod-landing.john-doe.archidep.ch"
User=john_doe
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

> :gem: Replace `john_doe` with your name in the `WorkingDirectory` and `User`
> options, as well as `john-doe` in the second `Environment` option indicating
> the URL of the landing page.

Enable and start your new service:

```bash
$> sudo systemctl enable revprod-backend
$> sudo systemctl start revprod-backend
```

> :gem: You can check that it is running with `sudo systemctl status
> revprod-backend`.

Create an nginx site configuration file
`/etc/nginx/sites-available/revprod-backend` (e.g. with `nano`) to expose this
component:

```conf
server {
  listen 80;
  server_name revprod-backend.john-doe.archidep.ch;
  root /home/john_doe/revprod-backend/public;

  location / {
    proxy_pass http://127.0.0.1:4200;
  }
}
```

> :gem: Replace `john-doe` with your name in the `server_name` directive, as
> well as `john_doe` in the `root` directive.

Enable that configuration with the following command:

```bash
$> sudo ln -s /etc/nginx/sites-available/revprod-backend /etc/nginx/sites-enabled/revprod-backend
```

Check and reload nginx's configuration:

```bash
$> sudo nginx -t
$> sudo nginx -s reload
```

You should then be able to access the revprod backend at
http://revprod-backend.john-doe.archidep.ch.

![Revprod backend](../images/revprod-backend.png)

Take the time to share your thoughts about The Revolutionary Product!

![Share your testimonial in the Revprod backend](../images/revprod-backend-share.png)

## :exclamation: It's not working!

If you have followed the instructions so far, you should be able to access the
revprod backend and landing page in your browser, you should be able to create
testimonials in the backend page.

Note that the URL switches from `http://revprod-landing.john-doe.archidep.ch` to
`http://revprod-backend.john-doe.archidep.ch` (and back) when you navigate from
the landing page to the Share page. Both components use exactly the same theme
so that the transition is seamless, however by looking at **the URL** the user
can clearly see that these are **two separate sites**.

![From the Revprod landing page to the backend](../images/revprod-landing-switch.png)
![From the Revprod backend to the landing page](../images/revprod-backend-switch.png)

But more importantly, **the testimonials are not displayed on the landing
page!**

![Revprod SOP error](../images/revprod-sop.png)

If you open your browser's developer console, you should see an error that looks
something like this:

```
Cross-Origin Request Blocked: The Same Origin Policy disallows reading the
remote resource at http://revprod-backend.john-doe.archidep.ch/comments.
(Reason: CORS header ‘Access-Control-Allow-Origin’ missing). Status code: 200.
```

![Revprod SOP error in the developer console](../images/revprod-sop-error.png)

### :books: The Same-Origin Policy

The landing page's AJAX request to fetch the comments from the backend has been
blocked by the browser because the request is to a different **origin**: the
landing page is at `http://revprod-landing.john-doe.archidep.ch` and is
attempting to access `http://revprod-backend.john-doe.archidep.ch` which is
**another domain entirely**.

This is called the [**Same-Origin Policy**][sop]. It is a critical security
mechanism that restricts how a document or script loaded by one origin can
interact with a resource from another origin.

It helps isolate potentially malicious documents, reducing possible attack
vectors. For example, it prevents a malicious website on the Internet from
running JS in a browser to read data from a third-party webmail or e-banking
service (which the user is signed into) or a company intranet (which is
protected from direct access by the attacker by not having a public IP address)
and relaying that data to the attacker.

## :exclamation: Using Cross-Origin Request Sharing (CORS)

One way to solve this issue is with [Cross-Origin Request Sharing (CORS)][cors]:
the backend can use HTTP response headers to indicate to the frontend that it
can perform requests from a different origin.

The revprod backend already supports sending the appropriate CORS headers to
allow cross-origin requests. Update the Systemd unit file
`/etc/systemd/systemd/revprod-backend.service` for the backend and add the
[appropriate environment variables][revprod-backend-config] to the `[Service]`
section to enable CORS:

```conf
Environment="REVPROD_CORS=true"
Environment="REVPROD_CORS_ORIGINS=http://revprod-landing.john-doe.archidep.ch"
```

> :gem: Replace `john-doe` with your name in the definition of the second
> environment variable.

Reload the Systemd configuration and restart the backend service:

```bash
$> sudo systemctl daemon-reload
$> sudo systemctl restart revprod-backend
```

Refresh the revprod landing page at
http://revprod-landing.john-doe.archidep.ch again. The comments should work
this time!

If you look at your browser's developer console when refreshing the page, you
should see that the backend now sends the following header in the comments
response:

```
Access-Control-Allow-Origin: http://revprod-landing.john-doe.archidep.ch
```

Your browser knows to check this header and let the request through if the
origin matches.

![Revprod CORS](../images/revprod-cors.png)

### :exclamation: Disabling CORS

You should now disable CORS because we will explore another solution to this
problem during the rest of this exercise.

Update the Systemd unit file `/etc/systemd/systemd/revprod-backend.service` for
the backend and set the value of the `REVPROD_CORS` variable to false:

```conf
Environment="REVPROD_CORS=false"
```

Reload the Systemd configuration and restart the backend service:

```bash
$> sudo systemctl daemon-reload
$> sudo systemctl restart revprod-backend
```

Check that the comments no longer work by refreshing
http://revprod-landing.john-doe.archidep.ch.

> :gem: You may need to force a refresh by holding the Shift key.

![Revprod SOP error](../images/revprod-sop.png)

## :exclamation: Using nginx to make both components appear as a single website

The problem we have is that our two components are deployed on separate domains,
therefore a request from the landing page to the backend is a **cross-origin
request** and is blocked by the **same-origin policy** by default.

_What if we had **only one domain**, and therefore only one origin?_

A reverse proxy like nginx is a very powerful tool. You have so far configured
two separate nginx sites with separate proxies to the backend and landing page,
but nothing says it has to be that way. You can actually configure **one site to
proxy to both components** depending on various criteria.

Let's assume that we want the revprod application (both the backend and the
landing page) to be accessible at one URL:
`http://revprod.john-doe.archidep.ch`.

Since the backend and landing page will be accessible at the same URL, we have
to update their configurations to reflect that fact. Update the Systemd unit
file `/etc/systemd/system/revprod-backend.service` for the backend and comment
out (or remove) the `REVPROD_LANDING_PAGE_BASE_URL` environment variable in the
`[Service]` section:

```conf
#Environment="REVPROD_LANDING_PAGE_BASE_URL=http://revprod-landing.john-doe.archidep.ch"
```

Do the same in the Systemd unit file
`/etc/systemd/system/revprod-landing.service` for the landing page for the
`REVPROD_BACKEND_BASE_URL` variable:

```conf
#Environment="REVPROD_BACKEND_BASE_URL=http://revprod-backend.john-doe.archidep.ch"
```

Reload Systemd's configuration and restart both services to take these changes
into account:

```bash
$> sudo systemctl daemon-reload
$> sudo systemctl restart revprod-backend
$> sudo systemctl restart revprod-landing
```

You must create a new nginx site configuration file
`/etc/nginx/sites-available/revprod`. This site configuration must fulfill
the following criteria:

* There must be **only one `server` block**.
* The `listen` directive must still use port `80` like the previous
  configurations in this exercise.
* The `server_name` directive must be `revprod.john-doe.archidep.ch` (replacing
  `john_doe` with your name).
* The `root` directive must be the same as the one from the landing page's site
  configuration.
* There must be **multiple `location` blocks** in the `server` block, to serve
  both the backend and frontend components, each with their own `proxy_pass`
  directive. These blocks will be similar to but not exactly the same as those
  used earlier in the exercise. You must make sure the following holds true:

  * Requests to `/` are proxied to the landing page.
  * Requests to `/comments` or `/share` are proxied to the backend.

  > :gem: A `location` block can match specific requests depending on how you
  > write it. Read the "Configuring Locations" section of [Configuring nginx as
  > a Web Server][configuring-nginx-as-a-web-server].
  >
  > :books: You can read [Understanding Nginx Server and Location Block
  > Selection Algorithms][nginx-server-and-location] if you want more detailed
  > information.

Enable the new configuration with the following command:

```bash
$> sudo ln -s /etc/nginx/sites-available/revprod /etc/nginx/sites-enabled/revprod
```

Check and reload nginx's configuration:

```bash
$> sudo nginx -t
$> sudo nginx -s reload
```

You should now be able to access the revprod application at
http://revprod.john-doe.archidep.ch and everything should work!

If your new site configuration is correct, note that your are no longer
switching from `http://revprod-landing.john-doe.archidep.ch` to
`http://revprod-backend.john-doe.archidep.ch` when navigating in the
application. Everything is served under `http://revprod.john-doe.archidep.ch`
because everything goes through nginx which then proxies it **internally** to
our separate components.

![From the Revprod landing page to the backend with nginx](../images/revprod-rp-landing.png)
![From the Revprod backend to the landing page with nginx](../images/revprod-rp-backend.png)

Neither the browser nor the user now have any idea that this application is in
fact composed of multiple components. To the outside world, it appears as one
application on one domain, thus also solving our original problem: there is no
longer any cross-origin request, so the same-origin policy does not apply.

![Revprod with no SOP error behind nginx](../images/revprod-rp-no-sop.png)

## :checkered_flag: What have I done?

You have deployed a **multi-component website** in a way that makes it **appear
as a single website** to the end user. You have achieved this by running each
component separately, and then configuring your reverse proxy (nginx) to
appropriately proxy requests to each component.

### :classical_building: Architecture

This is a simplified architecture of the main running processes and
communication flow at the end of this exercise (after completing [all previous
course exercises][archidep-exercises]):

![Simplified architecture](revprod-deployment-simplified.png)

> [Simplified architecture PDF version](revprod-deployment-simplified.pdf).

## :boom: Troubleshooting

Here's a few tips about some problems you may encounter during this exercise.

### :boom: `nginx: [emerg] could not build server_names_hash`

If you encounter the following error:

```
$> sudo nginx -t
nginx: [emerg] could not build server_names_hash, you should increase server_names_hash_bucket_size: 64
nginx: configuration file /etc/nginx/nginx.conf test failed
```

It may be because your domain name (the value of your `server_name` directive)
is too long for nginx's default settings. In that case, edit the main nginx
configuration with `sudo nano /etc/nginx/nginx.conf` and add the following line
**in the `http` section**:

```
server_names_hash_bucket_size 256;
```



[archidep-exercises]: https://github.com/MediaComem/comem-archidep#exercises
[configuring-nginx-as-a-web-server]: https://docs.nginx.com/nginx/admin-guide/web-server/web-server/
[cors]: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
[nginx-server-and-location]: https://www.digitalocean.com/community/tutorials/understanding-nginx-server-and-location-block-selection-algorithms
[node]: https://nodejs.org
[node-install]: https://github.com/nodesource/distributions/blob/master/README.md
[revprod-backend-config]: https://github.com/MediaComem/revprod-backend#configuration
[slides]: https://mediacomem.github.io/comem-archidep/2022-2023/subjects/reverse-proxy/?home=MediaComem%2Fcomem-archidep%23readme#1
[sop]: https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy
