# Notes

## List a server's SSH key fingerprints

```bash
$> find /etc/ssh -name "*.pub" -exec ssh-keygen -l -f {} \;
```

# Check a student's EC2 virtual machine

This requires netcat to be installed locally and on the server. Install it with
`brew install netcat` on macOS with [Homebrew](https://brew.sh).

The script below will copy the `scripts/listen-server-ports.sh` script to the
student's server and run it. That script runs a netcat process on each of the 4
ports that are supposed to be open. Those processes echo `OK` once as soon as a
client connects.

Local netcat commands are then run to connect to each port and verify that the
`OK` is received. This shows that the AWS firewall was correctly configured to
open these ports.

The `listen-server-ports.sh` script is then killed and deleted from the server.

The contents of all `/home/*/.ssh` directories is listed to check that the
student has correctly created their own user, and that all SSH directory/file
permissions are correct for the `ubuntu` user and the student's user.

The `hostname` and the contents of the `/etc/hostname` files are also displayed
for validation.

```bash
$> ./scripts/check-aws-instance.sh 1.2.3.4
```

> Note: each `nc` command must be stopped by typing `Ctrl-C` **once** after the
> `OK` received from the server is displayed.
