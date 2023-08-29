<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Hello Shell](#hello-shell)
  - [Legend](#legend)
  - [:exclamation: Creating Directories and files](#exclamation-creating-directories-and-files)
  - [:exclamation: Adding Clues](#exclamation-adding-clues)
  - [:question: Test the treasure hunt](#question-test-the-treasure-hunt)
  - [:exclamation: Automate the treasure hunt using shell scripting](#exclamation-automate-the-treasure-hunt-using-shell-scripting)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Hello Shell

In this exercise you will be setting up a little [Command Line][command-line] treasure hunt for adventurers who might wind up on your server. You will then automate the hunt using [Shell Scripting][shell-scripting]. The goal of this exercise is to familiarise yourself with the command line and its basic programs, as well as the automatisation of tasks using basic scripting.

> :warning: **These tasks should only be completed using Terminal or Git Bash. Using GUI tools would be pointless**.

## Legend

Parts of this guide are annotated with the following icons:

- :exclamation: A task you **MUST** perform to complete the exercise.
- :question: An optional step that you _may_ perform to make sure that
  everything is working correctly.
- :warning: **Critically important information about the exercise.**
- :gem: Tips on the exercise, reminders about previous exercises, or
  explanations about how this exercise differs from the previous one.
- :space_invader: More advanced tips on how to save some time.
- :books: Additional information about the exercise or the commands and tools
  used.
- :checkered_flag: The end of the exercise.
- :boom: Troubleshooting tips: how to fix common problems you might encounter.

## :exclamation: Creating Directories and files
You already know about the `pwd`, `cd`, `ls`, `tar`, `mkdir`, `touch`, `echo` and `cat` commands. Using the appropriate commands, complete the following tasks:

- From your home directory create a new directory called `treasure_hunt`.
- Inside the `treasure_hunt` directory, create three more **directories**: `cave`, `forest` and `lake`.
- Create the following **files**: `cave/echo.txt`, `lake/fish.txt`, and `forest/tree.txt`.

> :books: In Unix-like operating systems, the tilde (~) symbol is a shorthand representation for a user's home directory. It's a convenient way to refer to this directory without needing to know or type the full path. For instance, if a user's home directory is /home/username, typing cd ~ in the terminal would navigate them directly to that location. The tilde is recognized and expanded to the full path by the shell, making it an efficient shortcut. Additionally, the tilde can be combined with other directory or file names, such as ~/Documents, to quickly reference subdirectories or files within the home directory. The adoption of the tilde as a shortcut has become a deeply ingrained convention in the command-line world, providing users with a quick and consistent way to access their personal files and settings.

## :exclamation: Adding Clues
Using the method of your choice, edit your newly created files to contain the following content:

- `cave/echo.txt`: "To find the next clue, search where the water flows."
- `lake/fish.txt`: "Go deep into the woods to find the final hint."
- `forest/tree.txt`: "curl parrot.live"

>:books: The `curl` command is a versatile tool used primarily for transferring data using various protocols, most commonly HTTP and HTTPS. For beginners diving into the world of command-line operations, think of `curl` as a way to communicate with websites and servers directly from the terminal without the need for a web browser. Whether you're trying to fetch the contents of a web page, download a file, or interact with APIs, `curl` is your go-to utility. Its name stands for "Client URL," underscoring its capability to work with URLs to retrieve or send data. Beginners often start with basic `curl` commands, like `curl https://example.com`, which fetches and displays the content of the specified web page in the terminal. As users become more accustomed to it, they'll find that `curl` offers a wide range of options and parameters to customize requests, making it an indispensable tool for many developers and system administrators.

## :question: Test the treasure hunt
Make sure everything is in its setup correctly:
- Navigate to the `treasure_hunt` directory
- Read the content of `echo.txt` in the cave directory.
- Based on the clue, navigate to the next directory.
- Discover the next clue and navigate accordingly.
- Enter the final hint in the terminal.

## :exclamation: Automate the treasure hunt using shell scripting

Write a short script automating the whole treasure hunt. To do so, create a file name `auto_hunt.sh` in the `treasure_hunt` directory.

- Open `auto_hunt.sh` in your favorite command line text editor.
- Add the following line at the top of the file: `#!/bin/bash`
- Squentially write the commands needed to complete the treasure hunt, seperated by 2 second pauses for dramatic impact using the  `sleep` command.
>:books: The sleep command is a simple yet useful utility in Unix-like operating systems that pauses the execution of a program or script for a specified duration. For beginners getting acquainted with scripting or command-line tasks, think of sleep as a way to introduce deliberate delays. By inputting sleep followed by a number, the system will pause for that many seconds. For instance, sleep 5 will introduce a pause of five seconds.

>:gem: You could also write a function combining the reading of the file and the short pause for reusability's sake.

- In order to run the command stored in `forest/tree.txt`, write: `sh forest/tree.txt`.
- Save your script and exit your text editor.
- Test your script by running `sh auto_hunt.sh`



[command-line]: (https://mediacomem.github.io/comem-archidep/2022-2023/subjects/cli?home=MediaComem%2Fcomem-archidep%23readme)
[shell-scripting]: (https://mediacomem.github.io/comem-archidep/2022-2023/subjects/shell-scripting?home=MediaComem%2Fcomem-archidep%23readme)
