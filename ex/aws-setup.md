# Run your own virtual server on Amazon Web Services

This guide describes how to run a virtual server appropriate for the COMEM+ Architecture & Deployment course on the Amazon Web Services cloud platform.

<!-- START doctoc -->
<!-- END doctoc -->



## Procedure

* Apply for [AWS Educate](https://aws.amazon.com/education/awseducate/apply/) if you are a student.
  * If you have a credit card, you can register a [standard AWS account](https://portal.aws.amazon.com/billing/signup#/start) instead.

    You will be able to run a small *free* server that is sufficient for the needs of this course.
* Access the [EC2 Dashboard](https://eu-west-1.console.aws.amazon.com/ec2).
* Select the **EU Ireland region** if you have a standard account at the top right of the screen in the menu bar.
  It is the cheapest european region.

  If you have a student account, you can use whatever region is available to you instead.

  ![AWS Region](../images/aws-region.png)
* [Import your public key](https://eu-west-1.console.aws.amazon.com/ec2) under **Key Pairs** so that you don't have to create a new one.

  You can display your public key by running the following command in your terminal: `cat ~/.ssh/id_rsa.pub`.

  ![AWS Import Public Key](../images/aws-import-public-key.png)

  This will make it simpler for you to connect to your virtual server once it's launched.
* Go to [**Instances**](https://eu-west-1.console.aws.amazon.com/ec2) and **launch an instance**.

  ![AWS Launch Instance](../images/aws-launch-instance.png)
  * **Step 1:** Search and select the following Ubuntu AMI: `Ubuntu Server 18.04 LTS (HVM), SSD Volume Type`.
    Use the default 64-bit (x86) version.

    ![AWS AMI](../images/aws-step-1-ami.png)
  * **Step 2:** Select the `t2.micro` instance type.

    ![AWS Instance Type](../images/aws-step-2-instance-type.png)
  * **Step 3:** Leave the default instance details.
  * **Step 4:** Leave the default storage configuration.
  * **Step 5:** Add a `Name` tag to easily identify your instance.

    ![AWS Tags](../images/aws-step-5-tags.png)
  * **Step 6:** Create a security group with the following inbound ports open: 22, 80, 443, 3000 & 3001.

    ![AWS Security Group](../images/aws-step-6-security-group.png)

    The security warning indicates that it's good practice
    to limit the IP addresses authorized to access your virtual server.
    You may do so if you wish, but it's not necessary for this course.
  * **Step 7:** Launch the virtual server.

    ![AWS Launch](../images/aws-step-7-launch.png)

    Select the public key you imported.

    ![AWS Key Pair](../images/aws-step-7-key.png)
* Go to **Elastic IPs** in the menu, and allocate a new IP address.
* Select the new IP address and associate it.

  ![AWS Associate Address](../images/aws-associate-address-1.png)

  Select the instance you just launched and its private IP address
  (*the values will _not be the same_ as in this screenshot*):

  ![AWS Associate Address](../images/aws-associate-address-2.png)

  Your instance now has a fixed public IP address on the Internet.
* Connect to your new instance over SSH.

  By default, the selected instance type creates an `ubuntu` user.

  Assuming the instance's public IP address is `2.2.2.2` (replace with the elastic IP address you allocated):

  ```bash
  $> ssh ubuntu@2.2.2.2
  ```
* Once you are connected as `ubuntu`, run the following command to give the teacher access to your instance (be sure to copy the whole line):

  ```bash
  $> echo "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCxDHpiwKjBPEQsxuYw6nQ4lA/gH9h00QkpVIptLewXFcO/hH8Dir+xvXWfiWe5J/dqAu76jYxDnlmtTyeKGHXRQExhKaX82Qu/krrnKbEotuRqp0hiDFzRLWuHAJ7ms5taDaJUQlu4YIOKsc87BkZz6DIcHRcGiNEnSi6iwhJGRjrP0IfQHtnilLypUfmru9SSNdedYdIIffgAcxJLu2ypC6pmEuV1VFBO1dZC40lP5e051ybbGH/Py1jk0hfjh1QP/W8sbiDsRkNaPYxT3X7CO751EHJKHQLMpCOed8zs9pU4KN6vXvCSj0Ppy0uPODE6cBpEjzYtHfbMz0EBCiGT comem-archidep" | sudo tee --append /home/ubuntu/.ssh/authorized_keys
  ```
* Create your own user.
  Assuming your username is `john_doe` (replace with your actual name):

  ```bash
  $> sudo useradd -m john_doe

  $> sudo passwd john_doe
  Enter new UNIX password:
  Retype new UNIX password:
  passwd: password updated successfully
  ```

  Set your shell to Bash:

  ```bash
  $> sudo usermod -s /bin/bash john_doe
  ```

  Make your new user an administrator by adding it to the `sudo` group:

  ```bash
  $> sudo usermod -a -G sudo john_doe
  ```

  Copy the `ubuntu` user's SSH authorized keys to your new user:

  ```bash
  $> sudo mkdir -p /home/john_doe/.ssh

  $> sudo chown john_doe:john_doe /home/john_doe/.ssh

  $> sudo chmod 700 /home/john_doe/.ssh

  $> sudo cp /home/ubuntu/.ssh/authorized_keys /home/john_doe/.ssh/authorized_keys

  $> sudo chown john_doe:john_doe /home/john_doe/.ssh/authorized_keys
  ```

  Disconnect once you are done:

  ```bash
  $> exit
  ```
* Reconnect as your own user (again, replace `john_doe` and `2.2.2.2` by the appropriate values):

  ```bash
  $> ssh john_doe@2.2.2.2
  ```
* Change your hostname (note that you cannot use the `_` character in a hostname, use `-` instead):

  ```bash
  $> sudo hostname john-doe.archidep.media
  ```

  Also save your new hostname to the `/etc/hostname` file so that it will persist when you reboot the server:

  ```bash
  $> echo "john-doe.archidep.media" | sudo tee /etc/hostname
  ```
* Reboot the server.

  ```bash
  $> sudo reboot
  ```

  *After a couple of minutes*, check that you can still connect and that your hostname is correct:

  ```bash
  $> ssh john_doe@2.2.2.2
  Welcome to Ubuntu 18.04.1 LTS
  ...

  $> hostname
  john-doe.archidep.media
  ```
* Send your instance's public IP address to the teacher.



## End result

![Diagram](aws-setup.png)

> [PDF version](aws-setup.pdf).
