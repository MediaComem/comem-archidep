# Configure a load balancer for an application with Nginx and PM2

The goal of this exercice is to configure a load balancer on Nginx so that it will
redirect traffic to one of three app instances started with PM2.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Required tools](#required-tools)
- [Tasks](#tasks)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Required tools

For this exercise, you'll need some tools installed on your personal server.

You already should have installed **NodeJS** and **Nginx** previously.

You have to install **PM2**. To do this, while logged in on your server, execute the following command:

```bash
$> sudo npm install pm2@latest -g
```
You also need to clone the GitHub repository of the app you'll use in this exercise.

To do that, go to your home directory, where all the other exercise should be, and clone the application:

```bash
$> cd
$> git clone https://github.com/MediaComem/load-balanceable-locator.git
$> cd load-balanceable-locator
$> npm install
```

# Tasks

The purpose of the exercise is to configure `systemd`, Nginx and PM2 so that you have three instances of the `load-balanceable-locator` app running behind a load-balancer.

The idea being that `systemd` starts PM2, which, in turn, will spawn the three app's instances, used by Nginx for the load balancing.

> For `systemd` to start pm2 at startup, you might want to take a look at the **Startup Hook** guide from the PM2 documentation.

> To configure PM2 to launch three instances of the same app, you'll need to take a look at the **Ecosystem file** of the PM2 documentation.

As stated in the [load-balanceable-locator app's documentation](https://github.com/MediaComem/load-balanceable-locator#configuration), you can define a per-instance environement variable named `BACKGROUD_COLOR`, that will be used by the app to set the color of its background. By setting a different background color for each of your three instances, you'll be able to see, when accesing your app multiple time on your browser, that it's not always the same instance.
