# Setup

## Run AWS EC2 instances for students

* Put a secret in `secret.txt`
* Download CSV student data
* If necessary, convert it to UTF-8

  ```bash
  iconv -f macintosh -t UTF-8 < original.csv > students.csv
  ```
* Select VPC & subnet
* Create a key pair named `ArchiDep` in the AWS console
* Create a security group with the following inbound rules:
  * SSH (port 22)
  * HTTP (port 80)
  * HTTPS (port 443)
  * Port 3000
  * Port 3001
* Put the security group ID in the `config.yml` file
* Configure access policy
* `node scripts/manage-instances.js inventory`
* `ANSIBLE_HOST_KEY_CHECKING=false ansible-playbook -vv -D -i ec2/inventory ec2/playbook.yml`
* `ansible-playbook -vv -D -i ec2/inventory ec2/playbook.yml`
