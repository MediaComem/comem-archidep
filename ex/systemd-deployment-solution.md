# Solution: [Manage a PHP application with systemd as a Process Manager](./systemd-deployment.md)

<!-- START doctoc -->
<!-- END doctoc -->

The `/etc/systemd/system/todolist.service` file on your server should look
something like this:

```
[Unit]

Description=PHP TodoList

# The TodoList should start after MySQL since it requires the database to
# list, create, update and delete its todos.
After=mysql.service

[Service]

# Listen on port 3000 with the PHP development server.
ExecStart=/usr/bin/php -S 0.0.0.0:3000

# Run the development server in the directory of the TodoList repository.
WorkingDirectory=/home/jde/todolist-repo

# Run the development server as my user.
User=jde

# Provide the database connection password through the environment.
Environment="TODOLIST_DB_PASS=CHANGEME"

Restart=on-failure

[Install]

# Automatically start on boot.
WantedBy=multi-user.target
```

> :gem: Replace `jde` with your Unix username and `CHANGEME` with the password
> of your `todolist` database user.

You must then enable and start this service:

```bash
$> sudo systemctl enable todolist
$> sudo systemctl start todolist
```
