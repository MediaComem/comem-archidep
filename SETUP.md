# Setup

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Initial setup](#initial-setup)
- [Set up an EC2 instance for SSH exercises](#set-up-an-ec2-instance-for-ssh-exercises)
  - [Enable/disable password authentication](#enabledisable-password-authentication)
  - [Renegerate SSH host keys](#renegerate-ssh-host-keys)
- [Run AWS EC2 instances for students](#run-aws-ec2-instances-for-students)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Initial setup

* Put a random secret in `secret.txt`.
* Download CSV student data to `students.csv`.
* Check CSV encoding with `file -I students.csv`.
* If necessary, convert it to UTF-8:

  ```bash
  mv students.csv original.csv
  iconv -f macintosh -t UTF-8 < original.csv > students.csv
  ```
* Make sure number and content of columns are as expected in `scripts/utils.js`
  and `scripts/create-heroku-apps.sh`, update the scripts and/or the CSV file if
  necessary.
* Run `npm run setup`.

## Set up an EC2 instance for SSH exercises

```bash
ansible-playbook -i ssh/inventory -vv -D ssh/playbook.yml
```

### Send credentials to students

```bash
npm run mails
```

### Enable/disable password authentication

```bash
# Enable
ansible-playbook -i ssh/inventory -vv -D -t ssh -e ssh_password_authentication=true ssh/playbook.yml

# Disable
ansible-playbook -i ssh/inventory -vv -D -t ssh -e ssh_password_authentication=false ssh/playbook.yml
```

### List a server's SSH key fingerprints

```bash
$> find /etc/ssh -name "*.pub" -exec ssh-keygen -l -f {} \;
```

### Renegerate SSH host keys

```bash
ansible-playbook -i ssh/inventory -vv -D -t ssh -e ssh_regenerate_host_keys=true ssh/playbook.yml
```

## Run AWS EC2 instances for students

* Select VPC & subnet
* Create a key pair named `ArchiDep` in the AWS console
* Create a security group with the following inbound rules:
  * SSH (port 22)
  * HTTP (port 80)
  * HTTPS (port 443)
  * Port 3000
  * Port 3001
* Put the security group ID in the `config.yml` file
* Configure access policy:

  ```json
  {
      "Version": "2012-10-17",
      "Statement": [
          {
              "Sid": "VisualEditor0",
              "Effect": "Allow",
              "Action": [
                  "ec2:RebootInstances",
                  "ec2:TerminateInstances",
                  "ec2:StartInstances",
                  "ec2:CreateTags",
                  "ec2:RunInstances",
                  "ec2:StopInstances"
              ],
              "Resource": [
                  "arn:aws:ec2:*:*:subnet/*",
                  "arn:aws:ec2:*:*:vpn-gateway/*",
                  "arn:aws:ec2:*:*:reserved-instances/*",
                  "arn:aws:ec2:*:*:vpn-connection/*",
                  "arn:aws:ec2:*:*:launch-template/*",
                  "arn:aws:ec2:*::snapshot/*",
                  "arn:aws:ec2:*:*:security-group/*",
                  "arn:aws:ec2:*:*:network-acl/*",
                  "arn:aws:ec2:*:*:placement-group/*",
                  "arn:aws:ec2:*:*:network-interface/*",
                  "arn:aws:ec2:*:*:internet-gateway/*",
                  "arn:aws:ec2:*:*:route-table/*",
                  "arn:aws:ec2:*:*:key-pair/*",
                  "arn:aws:ec2:*:*:dhcp-options/*",
                  "arn:aws:ec2:*::spot-instance-request/*",
                  "arn:aws:ec2:*:*:instance/*",
                  "arn:aws:ec2:*:*:volume/*",
                  "arn:aws:ec2:*::fpga-image/*",
                  "arn:aws:ec2:*:*:vpc/*",
                  "arn:aws:ec2:*::image/*"
              ]
          },
          {
              "Sid": "VisualEditor1",
              "Effect": "Allow",
              "Action": [
                  "ec2:ReleaseAddress",
                  "ec2:DescribeAddresses",
                  "ec2:DescribeInstances",
                  "ec2:DescribeTags",
                  "ec2:CreateTags",
                  "sts:DecodeAuthorizationMessage",
                  "ec2:DescribeAccountAttributes",
                  "ec2:AssociateAddress",
                  "ec2:AllocateAddress"
              ],
              "Resource": "*"
          }
      ]
  }
  ```
* `npm run inventory`
* `ANSIBLE_HOST_KEY_CHECKING=false ansible-playbook -vv -D -i ec2/inventory ec2/playbook.yml`
* `ansible-playbook -vv -D -i ec2/inventory ec2/playbook.yml`
