# Deployment with systemd as a Process Manager

<!-- START doctoc -->
<!-- END doctoc -->

```
[Unit]
Description=PHP TodoList

[Service]
ExecStart=/usr/bin/php -S 0.0.0.0:3000
User=john_doe
WorkingDirectory=/home/john_doe/comem-archidep-php-todo-exercise
Environment=TODOLIST_DB_PASS=chAngeMeN0w!

[Install]
WantedBy=mysql.service
```
