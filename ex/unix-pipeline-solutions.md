# Unix Pipeline Solutions

Here are some solutions to the Unix pipeline exercise. These are not the only
solutions. You might have found others that work just as well. There are often
several ways to obtain the same result by chaining different Unix programs into
different pipelines.

<!-- START doctoc -->
<!-- END doctoc -->

* Count the number of lines and characters in the text

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
* Print the lines of the text containing the word `rainbow`

  **Solution:**

  ```bash
  $> cat rainbow.txt | grep rainbow
  Somewhere over the rainbow
  Somewhere over the rainbow
  Somewhere over the rainbow
  The colors of the rainbow so pretty in the sky
  Oh, somewhere over the rainbow
  ```

  > :gem: Note that this looks for occurrences of the work "rainbow" exactly
  > like this, in lowercase. If you wanted to make a case-insensitive search,
  > you would use the `grep` command's `-i` or `--ignore-case` option.
* Do the same but without any duplicates

  **Solution:**

  ```bash
  $> cat rainbow.txt | grep rainbow | sort | uniq
  Oh, somewhere over the rainbow
  Somewhere over the rainbow
  The colors of the rainbow so pretty in the sky
  ```
* Print the second word of each line in the text

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
* Compress the text and save it to `rainbow.txt.gz`

  **Solution:**

  ```bash
  $> cat rainbow.txt | gzip -c > rainbow.txt.gz
  ```
* Count the number of times the letter `e` is used (case-insensitive)

  ```bash
  $> cat rainbow.txt | fold -w 1 | grep -i e | wc -l
  131
  ```
* Count the number of times the word `the` is used (case-insensitive)

  ```bash
  $> cat rainbow.txt | tr '[:upper:]' '[:lower:]' | tr -s '[[:punct:][:space:]]' '\n' | grep -i '^the$' | wc -l
  ```

  > :gem: Instead of using a regular expression (`^the$`) with `grep`, you could
  > also use its `-w` (**w**ord regexp) option which does the same thing in this
  > case: `grep -i -w the`.
* :space_invader: Answer the question: what are the five most used words in the
  text (case-insensitive) and how many times are they used?

  **Solution:**

  ```bash
  cat rainbow.txt | tr '[:upper:]' '[:lower:]' | tr -s '[[:punct:][:space:]]' '\n' | sort | uniq -c | sort -r | head -n 5
  ```

  > :gem: By luck, simply sorting alphabetically works because the numbers are
  > correctly aligned. But if you want a more robust solution, you can add the
  > `-b` or `--ignore-leading-blanks` option and the `-n` or `--numeric-sort`
  > option to the `sort` command: `sort -bnr`.
