# Unix Pipeline

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Legend](#legend)
- [:exclamation: Setup](#exclamation-setup)
- [:exclamation: The exercise](#exclamation-the-exercise)
- [:gem: Example](#gem-example)
- [:gem: Your tools](#gem-your-tools)
- [:checkered_flag: What have I done?](#checkered_flag-what-have-i-done)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## Legend

Parts of this guide are annotated with the following icons:

- :exclamation: A task you **MUST** perform to complete the exercise.
- :question: An optional step that you _may_ perform to make sure that
  everything is working correctly.
- :warning: **Critically important information about the exercise.**
- :gem: Tips on the exercise, reminders about previous exercises, or
  explanations about how this exercise differs from the previous one.
- :space_invader: More advanced tips on how to save some time. Challenges.
- :books: Additional information about the exercise or the commands and tools
  used.
- :checkered_flag: The end of the exercise.
- :boom: Troubleshooting tips: how to fix common problems you might encounter.



## :exclamation: Setup

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



## :exclamation: The exercise

Use command pipelines and stream redirections to:

- Count the number of lines and characters in the text
- Print the lines of the text containing the word `rainbow`
- Do the same but without any duplicates
- Print the second word of each line in the text
- Compress the text and save it to `rainbow.txt.gz`
- Count the number of times the letter `e` is used (case-insensitive)
- Count the number of times the word `the` is used (case-insensitive)
- :space_invader: Answer the question: what are the five most used words in the
  text (case-insensitive) and how many times are they used?



## :gem: Example

For example, the following command counts the number of words in the text:

```bash
$> cat rainbow.txt | wc -w
255
```



## :gem: Your tools

Here are a few commands you might find useful for the exercise. They all operate
on the data received from their standard input stream, and print the result on
their standard output stream, so they can be piped into each other:

| Command                             | Description                                                                                  |
| :---------------------------------- | :------------------------------------------------------------------------------------------- |
| `cut -d ' ' -f <n>`                 | Select word in column `<n>` of each line (using one space as the delimiter)                  |
| `fold -w 1`                         | Print one character by line                                                                  |
| `grep [-i] <letterOrWord>`          | Select only lines that contain a given letter or word, e.g. `grep foo` (`-i` to ignore case) |
| `grep "^<text>$"`                   | Select only lines that contain this exact text (e.g. `grep "^foo$"`)                         |
| `gzip -c`                           | Compress data                                                                                |
| `sort [-n]`                         | Sort lines alphabetically (`-n` to sort numerically)                                         |
| `tr '[:upper:]' '[:lower:]'`        | Convert all uppercase characters to lowercase                                                |
| `tr -s '[[:punct:][:space:]]' '\n'` | Split by word                                                                                |
| `uniq [-c]`                         | Filter out repeated lines (`-c` also counts them)                                            |
| `wc [-l] [-w] [-m]`                 | Count lines, words or characters                                                             |

> :gem: Remember that if you want to know more about any of these commands or
> their options, all you have to do is type `man <command>`, i.e. `man cut`.



## :checkered_flag: What have I done?

You have seen that text can be passed through several programs and transformed
at each step to obtain the final result you want.

In essence, you have constructed complex programs by piping simpler programs
together, combining them into a more powerful whole. You have applied the Unix
philosophy.
