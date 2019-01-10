# Unix Pipeline

<!-- START doctoc -->
<!-- END doctoc -->

Download the exercice file to your computer with the following command:

```bash
$> curl -L https://git.io/fAjRa > rainbow.txt
```

Display the file:

```bash
$> cat rainbow.txt
Somewhere over the rainbow
...
```

Use command pipelines and stream redirections to:

* Count the number of lines and characters in the text.

  **Solution:**

  ```bash
  $> cat rainbow.txt | wc -l
  50
  $> cat rainbow.txt | wc -m
  1284
  ```

  **Solution counting the number of characters excluding new lines:**

  ```bash
  $> cat rainbow.txt | fold -w 1 | wc -l
  1242
  ```
* Print the lines of the text containing the word `rainbow`.

  **Solution:**

  ```bash
  $> cat rainbow.txt | grep rainbow
  Somewhere over the rainbow
  Somewhere over the rainbow
  Somewhere over the rainbow
  The colors of the rainbow so pretty in the sky
  Oh, somewhere over the rainbow
  ```

* Do the same but without any duplicates.

  **Solution:**

  ```bash
  $> cat rainbow.txt | grep rainbow | sort | uniq
  Oh, somewhere over the rainbow
  Somewhere over the rainbow
  The colors of the rainbow so pretty in the sky
  ```
* Print the second word of each line in the text.

  **Solution:**

  ```bash
  $> cat rainbow.txt | cut -d ' ' -f 2
  over
  up
  the
  in

  over
  fly
  ...
  ```
* Compress the text and save it to `rainbow.txt.gz`.

  **Solution:**

  ```bash
  $> cat rainbow.txt | gzip -c > rainbow.txt.gz
  ```
* Count the number of times the letter `e` or the word `the` is used.

  **Solution for the letter `e`:**

  ```bash
  $> cat rainbow.txt | fold -w 1 | grep e | wc -l
  131
  ```

  **Solution for the word `the`:**

  ```bash
  $> cat rainbow.txt | tr '[:upper:]' '[:lower:]' | tr -s '[[:punct:][:space:]]' '\n' | grep -w the | wc -l
  ```
* Display a list of the unique words in the text along with the number of times each word is used,
  sorted from the least used to the most used.

  **Solution:**

  ```bash
  cat rainbow.txt | tr '[:upper:]' '[:lower:]' | tr -s '[[:punct:][:space:]]' '\n' | sort | uniq -c | sort -bn
  ```
