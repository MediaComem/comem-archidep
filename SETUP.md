# Setup

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Initial setup](#initial-setup)
- [Set up a virtual machine for SSH exercises](#set-up-a-virtual-machine-for-ssh-exercises)
  - [Send credentials to students](#send-credentials-to-students)
  - [Enable/disable password authentication](#enabledisable-password-authentication)
  - [List a server's SSH key fingerprints](#list-a-servers-ssh-key-fingerprints)
  - [Renegerate SSH host keys](#renegerate-ssh-host-keys)
- [Configure Azure virtual machines for students](#configure-azure-virtual-machines-for-students)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Initial setup

- Put a random secret in `secret.txt`.
- Download CSV student data to `students.csv`.
- Check CSV encoding with `file -I students.csv`.
- If necessary, convert it to UTF-8:

  ```bash
  mv students.csv original.csv
  iconv -f macintosh -t UTF-8 < original.csv > students.csv
  ```

- Make sure number and content of columns are as expected in `scripts/utils.js`.
  Update the scripts and/or the CSV file if necessary.
- Run `npm run setup`.

## Set up a virtual machine for SSH exercises

```bash
ansible-playbook -i ssh-vm/inventory -vv -D ssh-vm/playbook.yml
```

### Send credentials to students

```bash
npm run mails
```

### Enable/disable password authentication

```bash
# Enable
ansible-playbook -i ssh-vm/inventory -vv -D -t ssh -e ssh_password_authentication=true ssh-vm/playbook.yml

# Disable
ansible-playbook -i ssh-vm/inventory -vv -D -t ssh -e ssh_password_authentication=false ssh-vm/playbook.yml
```

### List a server's SSH key fingerprints

```bash
$> find /etc/ssh -name "*.pub" -exec ssh-keygen -l -f {} \;
```

### Renegerate SSH host keys

```bash
ansible-playbook -i ssh-vm/inventory -vv -D -t ssh -e ssh_regenerate_host_keys=true ssh-vm/playbook.yml
```

## Configure Azure virtual machines for students

- `npm run azure:inventory`
- `ANSIBLE_HOST_KEY_CHECKING=false ansible-playbook -vv -D -i azure/inventory azure/playbook.yml`
