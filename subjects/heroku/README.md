# Heroku

Learn to deploy an [Express][express] web application on the [Heroku][heroku] cloud application platform.

<!-- slide-include ../../BANNER.md -->

**You will need**

* [Git][git]
* A free [Heroku][heroku] account
* The [Heroku CLI][heroku-cli]
* [Node.js][node] 8+

**Recommended reading**

* [Command line](../cli/)
* [Express](../express/)
* [Mongoose](../mongoose/)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [What is Heroku?](#what-is-heroku)
  - [Cloud service models](#cloud-service-models)
  - [Infrastructure as a Service (IaaS)](#infrastructure-as-a-service-iaas)
  - [Platform as a Service (PaaS)](#platform-as-a-service-paas)
  - [How does Heroku work?](#how-does-heroku-work)
- [Getting started on Heroku with Node.js](#getting-started-on-heroku-with-nodejs)
  - [Create an Express app](#create-an-express-app)
  - [Make it a Git repository](#make-it-a-git-repository)
  - [Do you have a credit card?](#do-you-have-a-credit-card)
  - [Create the app on Heroku (**with credit card**)](#create-the-app-on-heroku-with-credit-card)
  - [Go to your dashboard (**with credit card**)](#go-to-your-dashboard-with-credit-card)
  - [Provision a database add-on (**with credit card**)](#provision-a-database-add-on-with-credit-card)
  - [Add the mLab add-on (**with credit card**)](#add-the-mlab-add-on-with-credit-card)
  - [Use an existing Heroku app (**without credit card**)](#use-an-existing-heroku-app-without-credit-card)
  - [Configure your database URL from the environment](#configure-your-database-url-from-the-environment)
  - [Deploy it](#deploy-it)
  - [How?](#how)
  - [When do I pay?](#when-do-i-pay)
  - [Databases](#databases)
- [Troubleshooting](#troubleshooting)
- [Configuration](#configuration)
  - [Server listening port configuration](#server-listening-port-configuration)
  - [Accessing environment variables in Node.js](#accessing-environment-variables-in-nodejs)
  - [Setting environment variables locally](#setting-environment-variables-locally)
  - [Setting environment variables on Heroku](#setting-environment-variables-on-heroku)
- [Resources](#resources)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## What is Heroku?

<!-- slide-front-matter class: center, middle, image-header -->

<p class='center'><img src='images/heroku.png' width='50%' /></p>

> Heroku is a cloud **Platform-as-a-Service (PaaS)** supporting several programming languages that is used as a **web application deployment** model.

> Heroku, one of the first cloud platforms, has been in development since June 2007, when it supported only the Ruby programming language, but now supports Java, **Node.js**, Scala, Clojure, Python, PHP, and Go.



### Cloud service models

Cloud-computing providers offer their services according to **different models**, some of which are listed below:

| Service models                      | What they provide         | Examples                                 |
| :---                                | :---                      | :---                                     |
| [Infrastructure as a Service][iaas] | Servers, virtual machines | Amazon EC2, Azure (Microsoft), Rackspace |
| [*Platform as a Service*][paas]     | *Runtime environments*    | Heroku, OpenShift                        |
| [Software as a Service][saas]       | Online services           | Gmail                                    |
| [Functions as a Service][faas]      | Serverless environments   | Amazon Lambda, OpenWhisk (IBM)           |



### Infrastructure as a Service (IaaS)

With traditional cloud providers, you have to **set up, maintain and operate** the **infrastructure** on which your applications are run:

<p class='center'><img src='images/iaas.png' width='70%' /></p>

You'll often need a professional **system administrator** to do that for sizable projects.



### Platform as a Service (PaaS)

The goal of PaaS platforms is to get **straight to building applications**.

<img src='images/paas.png' width='50%' />

* Higher-level programming
* Reduced complexity
* Effective deployment with built-in infrastructure
* Easier maintenance
* Scaling

It's also a part of the [DevOps][devops] movement where software **dev**elopers increasingly step into the world of **op**eration**s** and vice-versa.



### How does Heroku work?

> Heroku runs your apps inside dynos — smart **containers** on a reliable, fully **managed runtime environment**.

> Developers deploy their **code** written in Node, Ruby, Java, PHP, Python, Go, Scala, or Clojure to a **build system** which produces an app that's ready for execution.

> The **system and language** stacks are **monitored, patched, and upgraded**, so it's always ready and up-to-date.



## Getting started on Heroku with Node.js

<!-- slide-front-matter class: center, middle -->

Deploy an Express web app on Heroku



### Create an Express app

**If you haven't already**, generate a new [Express][express] app with [express-generator][express-generator]:

```bash
$> npm install -g express-generator
$> cd /path/to/projects
$> express express-demo
```

Make sure it works:

```bash
$> cd express-demo
$> npm install
$> npm start
```

Check that you can access it at [http://localhost:3000](http://localhost:3000).
Once you're sure it works, you can stop it with `Ctrl-C`.



### Make it a Git repository

Code is **deployed** on Heroku **via Git**.
Initialize a Git repository in the app's directory:

```bash
$> git init
```

Add a `.gitignore` file to ignore the `node_modules` directory
(dependencies will be installed by Heroku when you push):

```bash
$> echo node_modules > .gitignore
```

Your `.gitignore` file should look like this:

```txt
node_modules
```

Commit all the app's files:

```bash
$> git add --all
$> git commit -m "Initial commit"
```



### Do you have a credit card?

Some of the following steps **are different depending on whether or not you have a credit card**:

* **If you have a credit card**,
  you will need to enter your credit card details to provision a **free database add-on**
  (Heroku will not debit your card unless you explicitly choose a paying plan)
* **If you DO NOT have a credit card**,
  you will need someone who has a credit card to give you the name of an **existing Heroku application** with the database add-on already provisioned,
  and to which you have been given access

This tutorial assumes that you are using a [MongoDB][mongodb] database.
If not, adjust the instructions as appropriate for you database (i.e. when provisioning an add-on).



### Create the app on Heroku (**with credit card**)

Heroku needs to know about your app:

```bash
$> heroku create
Enter your Heroku credentials.
Email: john.doe@example.com
Password (typing will be hidden):
Logged in as john.doe@example.com
Creating app... done, ⬢ salty-inlet-82680
https://salty-inlet-82680.herokuapp.com/
| https://git.heroku.com/salty-inlet-82680.git
```

Heroku has given a random name to your app.

Also notice that Heroku has added a **remote** named `heroku` to your Git repository:

```bash
$> git remote -v
heroku  https://git.heroku.com/salty-inlet-82680.git (fetch)
heroku  https://git.heroku.com/salty-inlet-82680.git (push)
```

Your app is **almost ready** to deploy.



### Go to your dashboard (**with credit card**)

Go to [heroku.com][heroku-dashboard], sign in, and find your new application in the dashboard:

<p class='center'><img src='images/heroku-dashboard.png' /></p>



### Provision a database add-on (**with credit card**)

Go to your app's **Resources** tab and add the [mLab MongoDB][mlab-mongodb] add-on:

<p class='center'><img src='images/heroku-mlab.png' class='w80' /></p>



### Add the mLab add-on (**with credit card**)

Choose the free sandbox version of the add-on (which should be selected by default) and click **Provision**:
Heroku will probably **ask for your credit card details at this point**:

<!-- slide-column -->

<p class='center'><img src='images/heroku-mlab-provision.png' class='w90' /></p>

<!-- slide-column -->

<p class='center'><img src='images/heroku-verify.png' class='w90' /></p>

<!-- slide-container -->

If that is the case, click the **verify link**, fill and submit the form, **come back to this screen** and try again.
It should work this time.



### Use an existing Heroku app (**without credit card**)

Assuming someone has created a Heroku app and provisioned the correct database add-on for you,
they will have given you the application name, e.g. `salty-inlet-82680`.

Add it to your Git repository with the Heroku CLI:

```bash
$> heroku git:remote -a salty-inlet-82680
Enter your Heroku credentials.
Email: john.doe@example.com
Password (typing will be hidden):
Logged in as john.doe@example.com
set git remote heroku to https://git.heroku.com/salty-inlet-82680.git
```



### Configure your database URL from the environment

Make sure your database URL is **not hardcoded**, but **taken from the environment** (we'll see more about this later).

Heroku database add-ons provide the database URL in an **environment variable**.
For **mLab**, the variable is `$MONGODB_URI`.
For other add-ons, it's often `$DATABASE_URL`.

For example, if you're using Mongoose,
change the call to `connect` to take the environment variable into account if present
(it's probably in `app.js`):

```js
mongoose.connect(`process.env.MONGODB_URI ||` 'mongodb://localhost/my-db-name');
```

Do not forget to stage and commit this change:

```bash
$> git add app.js
$> git commit -m "Use $MONGODB_URI as the database connection URL if available"
```

You're now **ready to deploy**.



### Deploy it

To deploy, simply push to the new `heroku` remote.
Notice that **as you push**, Heroku **automatically deploys** your app:

```bash
$> git push heroku master
Counting objects: 18, done.
Delta compression using up to 8 threads.
Compressing objects: 100% (14/14), done.
Writing objects: 100% (18/18), 3.83 KiB | 0 bytes/s, done.
Total 18 (delta 1), reused 0 (delta 0)
remote: Compressing source files... done.
remote: Building source:
remote: -----> `Node.js app detected`
remote: -----> Creating runtime environment
remote: -----> `Building dependencies`
remote:        Installing node modules (package.json)
remote:        express-demo@0.0.0 /tmp/build_c9758807eb8979e9eb8af687447e5985
remote:        ├─┬ body-parser@1.16.1
remote: -----> Launching...
remote:        `https://salty-inlet-82680.herokuapp.com/` deployed to Heroku
remote: Verifying deploy... done.
To https://git.heroku.com/salty-inlet-82680.git
 * [new branch]      master -> master
```

Visit the URL Heroku gives you to see your deployed app.



### How?

Heroku bases itself on the **conventions** of the language you're using.

For Node.js, it assumes:

* You are using npm and have a `package.json` file (that's how it **detects** that it's a Node.js app)
* Your dependencies are saved in it (Heroku will run `npm install`)
* You have a `start` script in your `package.json` (Heroku will run `npm start` to run your app)

Similar conventions exist for each language supported by Heroku (e.g. Java, PHP, Ruby).

To automatically deploy when you push your code, Heroku uses [Git hooks][git-hooks].
Basically, these are **scripts** that you can put in the **Git directory** of a Git repository.
They are **triggered** when Git operations are made.



### When do I pay?

By default, apps are deployed using a **free** Heroku dyno (or process).
Free dynos **sleep after 30 minutes of inactivity**,
or if you have exhausted your [pool of free dyno hours][free-dyno-hours] for the month.

When your app sleeps, it may take **several seconds** (up to a minute) for it start again before it can respond to requests.
It will then work normally until it goes to sleep again after prolonged inactivity.

Free Heroku dynos are suitable for **development** or **experimentation**, but **not for production** apps.

You can of course [pay][pricing] to get production-quality resources.



### Databases

Heroku provides several databases as addons, for example:

* [Heroku Postgres][heroku-postgres] (free version limited to 10,000 rows)
* [mLab MongoDB][mlab-mongodb] (free version limited to 496 MB)
* [Heroku Redis][heroku-redis] (free version limited to 25 MB)

The pricing model is usually similar to Heroku dynos:
there are free versions available that are restricted, but more powerful versions can be purchased.



## Troubleshooting

Type `heroku logs` while in the directory of your Heroku app to see the **server logs**.
For example, you will see something similar to this if your database configuration is not correct (here it is trying to connect to `localhost` instead of `$MONGODB_URI`):

```bash
$> heroku logs
2017-02-26T17:08 app[web.1]: > express-demo@0.0.0 start /app
2017-02-26T17:08 app[web.1]: > node ./bin/www
2017-02-26T17:08 app[web.1]:
2017-02-26T17:08 app[web.1]: events.js:160
2017-02-26T17:08 app[web.1]:       throw er; // Unhandled 'error' event
2017-02-26T17:08 app[web.1]:       ^
2017-02-26T17:08 app[web.1]: MongoError: failed to connect to server
2017-02-26T17:08 app[web.1]:   [localhost:27017] on first connect
2017-02-26T17:08 app[web.1]:     at Pool.<anonymous> (/.../server.js:326:35)
2017-02-26T17:08 app[web.1]:     ...
2017-02-26T17:08 app[web.1]:
2017-02-26T17:08 app[web.1]: ...
2017-02-26T17:08 heroku[web.1]: State changed from starting to crashed
2017-02-26T17:08 heroku[web.1]: `Process exited with status 1`
```

You can also stream logs to your CLI (keep them open) with `heroku logs -t`
to identify issues while making requests.



## Configuration

Sometimes your app needs a few **configuration properties** (e.g. database URL, cookie signing secret).
This information is often **sensitive**, so it's good practice **NOT to commit it to your Git repository**.

Heroku provides configuration through **environment variables**.

> "[Environment variables][env-vars] are a set of **dynamic named values** that can affect the way **running processes** will behave on a computer."

One of the most often used environment variables is the `PATH`.

### Server listening port configuration

On a **managed platform** like Heroku, you can't always run your app on the same port (port 3000 in our Express app),
as that port **might not be available**.
Why does our app work then?

If you look at the `bin/www` file, you will see the following lines of code:

```js
var port = normalizePort(`process.env.PORT || '3000'`);
app.set('port', port);
```

Basically, this piece of code says:

* If the `PORT` environment variable is available, use that
* Otherwise, use `3000` by default

### Accessing environment variables in Node.js

`process.env` is an object provided by Node.js that contains **all available environment variables**.
You can see it in your CLI:

```bash
$> node

> process.env
{ SHELL: '/bin/bash',
  USER: 'foo',
  PATH: '/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin',
  PWD: '/path/to/current/working/directory',
  LANG: 'en_US.utf-8',
  HOME: '/path/to/home' }

> process.env.PATH
/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin
```

### Setting environment variables locally

When you run the app locally, you have no `PORT` environment variable defined, so it will run on port `3000`:

```bash
$> DEBUG=express-demo* npm start

> express-demo@0.0.0 start /path/to/projects/express-demo
> node ./bin/www

  express-demo:server Listening on port `3000` +0ms
```

You can override an environment variable by prepending it to the command:

```bash
$> `PORT=4321` DEBUG=express-demo* npm start

> express-demo@0.0.0 start /path/to/projects/express-demo
> node ./bin/www

  express-demo:server Listening on port `4321` +0ms
```

You can also permanently override a variable by adding `export NAME=value` to your CLI configuration file (e.g. `~/.bash_profile`).

### Setting environment variables on Heroku

Heroku will provide some variables to all apps, like `PORT`.
You can also **add your own** with the `config:set` command:

```bash
$> heroku config:set HELLO=world
Adding config vars and restarting myapp... done, v12
HELLO: world

$> heroku config
HELLO: world
OTHER_VAR: data

$> heroku config:get HELLO
world

$> heroku config:unset HELLO
Unsetting HELLO and restarting myapp... done, v13
```

Heroku add-ons can also add variables.
Typically, **database add-ons** will add an environment variable with the **database URL** to connect to.



## Resources

* [Heroku dev center][dev-center]
* [Getting started on Heroku with Node.js][getting-started]



[dev-center]: https://devcenter.heroku.com
[devops]: https://en.wikipedia.org/wiki/DevOps
[env-vars]: https://en.wikipedia.org/wiki/Environment_variable
[express]: https://expressjs.com
[express-generator]: https://www.npmjs.com/package/express-generator
[faas]: https://en.wikipedia.org/wiki/Function_as_a_Service
[free-dyno-hours]: https://devcenter.heroku.com/articles/free-dyno-hours
[getting-started]: https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction
[git]: https://git-scm.com
[git-hooks]: https://git-scm.com/book/gr/v2/Customizing-Git-Git-Hooks
[heroku]: https://www.heroku.com/home
[heroku-cli]: https://devcenter.heroku.com/articles/heroku-cli
[heroku-dashboard]: https://dashboard.heroku.com
[heroku-postgres]: https://devcenter.heroku.com/articles/heroku-postgresql
[heroku-redis]: https://devcenter.heroku.com/articles/heroku-redis
[iaas]: https://en.wikipedia.org/wiki/Cloud_computing
[mlab-mongodb]: https://devcenter.heroku.com/articles/mongolab
[mongodb]: https://www.mongodb.com
[node]: https://nodejs.org/en/
[paas]: https://en.wikipedia.org/wiki/Platform_as_a_service
[pricing]: https://www.heroku.com/pricing
[saas]: https://en.wikipedia.org/wiki/Software_as_a_service
