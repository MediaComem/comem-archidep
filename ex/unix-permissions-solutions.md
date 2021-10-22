# Unix Permissions Solutions

<!-- START doctoc -->
<!-- END doctoc -->

* Create a file named `file.txt` in `alice`'s home directory that is readable by
  `alice` but not by you.

  **Solution 1**

  ```bash
  # Switch to alice.
  $> sudo su - alice
  # Create the file (it will belong to alice and the alice group).
  $> touch file.txt
  # Switch back to your user.
  $> exit
  # Remove read permissions for other users (including yours).
  $> sudo chmod o-r /home/alice/file.txt
  ```

  **Solution 2**

  ```bash
  # Create the file as root (it will belong to root and the root group).
  $> sudo touch /home/alice/file.txt
  # Give the file to alice.
  $> sudo chown alice /home/alice/file.txt
  # Remove read permissions for other users (including yours).
  $> sudo chmod o-rwx /home/alice/file.txt
  ```

  **Setting the permissions in octal mode**

  ```bash
  $> sudo chmod 640 /home/alice/file.txt
  ```
* Create a directory named `for_alice` in your home directory. The `alice` user
  must be able to traverse this directory, but not list its contents or create
  new files in it.

  **Solution**

  ```bash
  # Move to your home directory (if necessary).
  $> cd
  # Create the directory.
  $> mkdir for_alice
  # Give the directory to alice's group.
  $> sudo chown john_doe:alice for_alice
  # Specify that the group can only traverse the directory and (optionally) that
  # other users have no permissions.
  $> sudo chmod g=x,o-rwx for_alice
  ```

  **Setting the permissions in octal mode**

  ```bash
  $> sudo chmod 710 for_alice
  ```
* The directory must contain a `readable.txt` file that `alice` can read from,
  but not write to.

  **Solution with access by other users**

  ```bash
  # Move into the directory.
  $> cd ~/for_alice
  # Simply create the file. It will be readable by everyone by default.
  $> echo "Hello, I'm readable" > readable.txt
  ```

  **Without access by other users**

  ```bash
  # Give the file to alice's group (which should have read access by default).
  $> sudo chown john_doe:alice readable.txt
  # Remove all permissions for other users.
  $> sudo chmod o-rwx readable.txt
  ```

  **Setting the permissions in octal mode**

  ```bash
  $> sudo chmod 640 readable.txt
  ```
* The directory must contain a `writable.txt` file that `alice` can read from
  and write to.

  **Solution with access by other users**

  ```bash
  # Create the file.
  $> echo "Hello, I'm writable" > writable.txt
  # Add the write permission to other users.
  $> sudo chmod o+w writable.txt
  ```

  **Without access by other users**

  ```bash
  # Give the file to alice's group.
  $> sudo chown john_doe:alice writable.txt
  # Add the write permission to the group and (optionally) remove all
  # permissions for other users.
  $> sudo chmod g+w,o-rwx writable.txt
  ```

  **Setting the permissions in octal mode**

  ```bash
  $> sudo chmod 660 writable.txt
  ```
