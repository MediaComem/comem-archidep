# Notes

## List a server's SSH key fingerprints

```bash
$> find /etc/ssh -name "*.pub" -exec ssh-keygen -l -f {} \;
```

# Check a student's EC2 virtual machine

This requires netcat to be installed locally and on the server. Install it with
`brew install netcat` on macOS with [Homebrew](https://brew.sh).

The command below will copy the `scripts/listen-server-ports.sh` script to the
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
$> export STUDENT_IP=1.2.3.4

$> scp -i id_rsa scripts/listen-server-ports.sh ubuntu@$STUDENT_IP:/home/ubuntu/listen-server-ports.sh && \
   ssh -i id_rsa ubuntu@$STUDENT_IP chmod 755 /home/ubuntu/listen-server-ports.sh && \
   ssh -i id_rsa ubuntu@$STUDENT_IP 'sudo nohup /home/ubuntu/listen-server-ports.sh &>/dev/null < /dev/null &' && \
   echo && \
   for port in 80 443 3000 3001; do echo $port; nc -w 1 $STUDENT_IP $port; done && \
   ssh -i id_rsa ubuntu@$STUDENT_IP sudo killall listen-server-ports.sh && \
   echo && \
   for port in 80 443 3000 3001; do echo $port; nc -w 1 $STUDENT_IP $port && echo NOK || echo closed; done && \
   ssh -i id_rsa ubuntu@$STUDENT_IP rm -f /home/ubuntu/listen-server-ports.sh && \
   ssh -i id_rsa ubuntu@$STUDENT_IP "sudo ls -laR /home/*/.ssh" && \
   echo && \
   ssh -i id_rsa ubuntu@$STUDENT_IP hostname && \
   ssh -i id_rsa ubuntu@$STUDENT_IP cat /etc/hostname
```

> Note: each `nc` command must be stopped with `Ctrl-C` once after displaying
> the `OK` received from the server.
