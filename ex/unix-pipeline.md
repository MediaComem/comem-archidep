# Unix Pipeline

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Setup](#setup)
- [The exercise](#the-exercise)
- [Your tools](#your-tools)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Setup

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

## The exercise

Use command pipelines and stream redirections to:

* Count the number of lines and characters in the text.
* Print the lines of the text containing the word `rainbow`.
* Do the same but without any duplicates.
* Print the second word of each line in the text.
* Compress the text and save it to `rainbow.txt.gz`.
* Count the number of times the letter `e` or the word `the` is used.
* Display a list of the unique words in the text along with the number of times each word is used,
  sorted from the least used to the most used.

## Your tools

Here are commands you might find useful for the exercise. They all operate on
the data received from their standard input stream, and print the result on
their standard output stream, so they can be piped into each other:

Command                             | Description
:---------------------------------- | :---------------------------------------------------------------------------
`cut -d ' ' -f <n>`                 | Select word in column `<n>` of each line (using one space as the delimiter).
`fold -w 1`                         | Print one character by line.
`grep <letterOrWord>`               | Select only lines that contain a given letter or word, e.g. `grep foo`.
`gzip -c`                           | Compress data.
`sort`                              | Sort lines alphabetically.
`tr '[:upper:]' '[:lower:]'`        | Convert all uppercase characters to lowercase.
`tr -s '[[:punct:][:space:]]' '\n'` | Split by word.
`uniq [-c]`                         | Filter out repeated lines (`-c` also counts them).
`wc [-l] [-w] [-m]`                 | Count lines, words or characters.
