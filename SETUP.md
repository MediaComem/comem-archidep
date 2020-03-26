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
* `node scripts/manage-instances.js inventory`
* `ANSIBLE_HOST_KEY_CHECKING=false ansible-playbook -vv -D -i ec2/inventory ec2/playbook.yml`
* `ansible-playbook -vv -D -i ec2/inventory ec2/playbook.yml`
