#!/bin/bash
fail() {
  >&2 echo "$@"
  exit 1
}

STUDENT_IP="$1"
test -n "$STUDENT_IP" || fail "The IP address of the machine to check must be provided to this script as the first argument"

scp -i id_rsa scripts/listen-server-ports.sh ubuntu@$STUDENT_IP:/home/ubuntu/listen-server-ports.sh || fail "Could not copy listen-server-ports.sh script to server"
ssh -i id_rsa ubuntu@$STUDENT_IP chmod 755 /home/ubuntu/listen-server-ports.sh || fail "Could not set permissions of listen-server-ports.sh script on server"
ssh -i id_rsa ubuntu@$STUDENT_IP 'sudo nohup /home/ubuntu/listen-server-ports.sh &>/dev/null < /dev/null &' || fail "Could not execute listen-server-ports.sh script on server"

echo
for port in 80 443 3000 3001; do
  echo $port; nc -w 1 $STUDENT_IP $port
done

ssh -i id_rsa ubuntu@$STUDENT_IP sudo killall listen-server-ports.sh

echo
for port in 80 443 3000 3001; do
  echo $port; nc -w 1 $STUDENT_IP $port && echo NOK || echo closed
done

ssh -i id_rsa ubuntu@$STUDENT_IP rm -f /home/ubuntu/listen-server-ports.sh
ssh -i id_rsa ubuntu@$STUDENT_IP "sudo ls -laR /home/*/.ssh"

echo
ssh -i id_rsa ubuntu@$STUDENT_IP hostname
ssh -i id_rsa ubuntu@$STUDENT_IP cat /etc/hostname