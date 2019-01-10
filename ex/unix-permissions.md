# Unix Permissions

* Create a `/home/YOURUSER/alice` directory.

  **Solution:**

  ```bash
  $> cd ~
  $> mkdir alice
  ```
* The `alice` user must be able to traverse, but not read this directory.

  **Solution with symbolic mode:**

  ```bash
  $> chmod o-x alice
  ```

  **Solution with octal mode:**

  ```bash
  $> chmod 751 alice
  ```
* The directory must contain a `readable.txt` file that `alice` can read from, but not write to.

  **Solution:**

  ```bash
  $> echo "some content" > readable.txt
  ```
* The directory must contain a `writable.txt` file that `alice` can read from and write to.

  **Solution with chmod with symbolic or octal mode:**

  ```bash
  $> echo "some other content" > writable.txt
  $> chmod o+w writable.txt
  $> chmod 666 writable.txt
  ```

  **Solution with chown:**

  ```bash
  $> echo "some other content" > writable.txt
  $> sudo chown alice writable.txt
  ```
