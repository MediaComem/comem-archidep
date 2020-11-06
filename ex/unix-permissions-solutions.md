# Unix Permissions Solutions

<!-- START doctoc -->
<!-- END doctoc -->

* Create a file named `file.txt` in `alice`'s home directory that is readable by
  `alice` but not by you.

  **Solution**

  ```bash
  $> sudo touch /home/alice/file.txt
  $> sudo chown alice /home/alice/file.txt
  $> sudo chmod o-rwx /home/alice/file.txt
  ```

  **With octal mode**

  ```bash
  $> sudo chmod 640 /home/alice/file.txt
  ```
* Create a directory named `for_alice` in your home directory. The `alice` user
  must be able to traverse this directory, but not list its contents or create
  new files in it.

  **Solution**

  ```bash
  $> cd ~
  $> mkdir for_alice
  $> sudo chown john_doe:alice for_alice
  $> sudo chmod g=x,o-rwx for_alice
  ```

  **With octal mode**

  ```bash
  $> sudo chmod 710 for_alice
  ```
* The directory must contain a `readable.txt` file that `alice` can read from,
  but not write to.

  **Solution with access by other users**

  ```bash
  $> cd ~/for_alice
  $> echo "Hello, I'm readable" > readable.txt
  ```

  **Without access by other users**

  ```bash
  $> sudo chown john_doe:alice readable.txt
  $> sudo chmod o-rwx readable.txt
  ```

  **With octal mode**

  ```bash
  $> sudo chmod 640 readable.txt
  ```
* The directory must contain a `writable.txt` file that `alice` can read from
  and write to.

  **Solution**

  ```bash
  $> echo "Hello, I'm writable" > writable.txt
  $> sudo chmod o+w writable.txt
  ```

  **Without access by other users**

  ```bash
  $> sudo chown john_doe:alice writable.txt
  $> sudo chmod g+w,o-rwx writable.txt
  ```

  **With octal mode**

  ```bash
  $> sudo chmod 660 writable.txt
  ```
