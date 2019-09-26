# Unix Pipeline

<!-- START doctoc -->
<!-- END doctoc -->

Download the exercise file to your computer with the following command:

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
* Print the lines of the text containing the word `rainbow`.
* Do the same but without any duplicates.
* Print the second word of each line in the text.
* Compress the text and save it to `rainbow.txt.gz`.
* Count the number of times the letter `e` or the word `the` is used.
* Display a list of the unique words in the text along with the number of times each word is used,
  sorted from the least used to the most used.
