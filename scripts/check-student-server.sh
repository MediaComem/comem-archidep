#!/bin/bash
fail() {
  >&2 echo "$@"
  exit 1
}

STUDENT_IP="$1"
STUDENT_USER="$2"
test -n "$STUDENT_IP" || fail "The IP address of the machine to check must be provided to this script as the first argument"
test -n "$STUDENT_USER" || fail "The username of the account to connect as must be provided to this script as the second argument"

scp -i id_rsa scripts/listen-server-ports.sh ${STUDENT_USER}@$STUDENT_IP:/home/${STUDENT_USER}/listen-server-ports.sh || fail "Could not copy listen-server-ports.sh script to server"
ssh -i id_rsa ${STUDENT_USER}@$STUDENT_IP chmod 755 /home/${STUDENT_USER}/listen-server-ports.sh || fail "Could not set permissions of listen-server-ports.sh script on server"
ssh -i id_rsa ${STUDENT_USER}@$STUDENT_IP "sudo nohup /home/${STUDENT_USER}/listen-server-ports.sh &>/dev/null < /dev/null &" || fail "Could not execute listen-server-ports.sh script on server"

echo
echo "Waiting 3 seconds for script to launch..."
sleep 3

echo
for port in 80 443 3000 3001; do
  echo $port; nc -w 1 $STUDENT_IP $port
done

ssh -i id_rsa ${STUDENT_USER}@$STUDENT_IP sudo killall listen-server-ports.sh

echo
for port in 80 443 3000 3001; do
  echo $port; nc -w 1 $STUDENT_IP $port && echo NOK || echo closed
done

ssh -i id_rsa ${STUDENT_USER}@$STUDENT_IP rm -f /home/${STUDENT_USER}/listen-server-ports.sh

echo
ssh -i id_rsa ${STUDENT_USER}@$STUDENT_IP "sudo ls -laR /home/*/.ssh"

echo
ssh -i id_rsa ${STUDENT_USER}@$STUDENT_IP hostname
ssh -i id_rsa ${STUDENT_USER}@$STUDENT_IP cat /etc/hostname

echo
ssh -i id_rsa ${STUDENT_USER}@$STUDENT_IP ls -lah /swapfile || echo "Swap file not found"
echo
ssh -i id_rsa ${STUDENT_USER}@$STUDENT_IP cat /etc/fstab
echo
ssh -i id_rsa ${STUDENT_USER}@$STUDENT_IP free -h
