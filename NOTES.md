# Notes

## List a server's SSH key fingerprints

```bash
$> find /etc/ssh -name "*.pub" -exec ssh-keygen -l -f {} \;
```
