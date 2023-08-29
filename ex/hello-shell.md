# Hello Shell

In this exercise you will be setting up a little [Command Line][command-line] treasure hunt for adventurers who might wind up on your server. You will then automate the hunt using [Shell Scripting][shell-scripting]. The goal of this exercise is to familiarise yourself with the command line and its basic programs, as well as the automatisation of tasks using basic scripting.

> :warning: **These tasks should only be completed using Terminal or Git Bash. Using GUI tools would be pointless**.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Legend](#legend)
- [:exclamation: Creating Directories and files](#exclamation-creating-directories-and-files)
- [:exclamation: Adding Clues](#exclamation-adding-clues)
- [:question: Test the treasure hunt](#question-test-the-treasure-hunt)
- [:exclamation: Automate the treasure hunt using shell scripting](#exclamation-automate-the-treasure-hunt-using-shell-scripting)
- [:exclamation: Make `auto_hunt` executable from any directory](#exclamation-make-auto_hunt-executable-from-any-directory)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

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
We already know about the `pwd`, `cd`, `ls`, `tar`, `mkdir`, `touch`, `echo` and `cat` commands. Using the appropriate commands, complete the following tasks:

- From our home directory create a new directory called `treasure_hunt`.
- Inside the `treasure_hunt` directory, create three more **directories**: `cave`, `forest` and `lake`.
- Create the following **files**: `cave/echo.txt`, `lake/fish.txt`, and `forest/tree.txt`.

> :books: In Unix-like operating systems, the tilde (~) symbol is a shorthand representation for a user's home directory. It's a convenient way to refer to this directory without needing to know or type the full path. For instance, if a user's home directory is /home/username, typing cd ~ in the terminal would navigate them directly to that location. The tilde is recognized and expanded to the full path by the shell, making it an efficient shortcut. Additionally, the tilde can be combined with other directory or file names, such as ~/Documents, to quickly reference subdirectories or files within the home directory. The adoption of the tilde as a shortcut has become a deeply ingrained convention in the command-line world, providing users with a quick and consistent way to access their personal files and settings.

## :exclamation: Adding Clues
Using the method of your choice, edit our newly created files to contain the following content:

- `cave/echo.txt`: "To find the next clue, search where the water flows."
- `lake/fish.txt`: "Go deep into the woods to find the final hint."
- `forest/tree.txt`: "curl parrot.live"

>:books: The `curl` command is a versatile tool used primarily for transferring data using various protocols, most commonly HTTP and HTTPS. For beginners diving into the world of command-line operations, think of `curl` as a way to communicate with websites and servers directly from the terminal without the need for a web browser. Whether you're trying to fetch the contents of a web page, download a file, or interact with APIs, `curl` is your go-to utility. Its name stands for "Client URL," underscoring its capability to work with URLs to retrieve or send data. Beginners often start with basic `curl` commands, like `curl https://example.com`, which fetches and displays the content of the specified web page in the terminal. As users become more accustomed to it, they'll find that `curl` offers a wide range of options and parameters to customize requests, making it an indispensable tool for many developers and system administrators.

## :question: Test the treasure hunt
Make sure everything is correctly set up:
- Navigate to the `treasure_hunt` directory
- Read the content of `echo.txt` in the cave directory.
- Based on the clue, navigate to the next directory.
- Discover the next clue and navigate accordingly.
- Enter the final hint in the terminal.
- Enjoy the treasure.

## :exclamation: Automate the treasure hunt using shell scripting

Write a short script automating the whole treasure hunt:
- Create a file name `auto_hunt` in the `treasure_hunt` directory.
- Open `auto_hunt` in your favorite command line text editor.
- Add the following line at the top of the file: `#!/bin/bash`
- Squentially write the commands needed to complete the treasure hunt, seperated by 2 second pauses for dramatic impact using the  `sleep` command.
>:books: The sleep command is a simple yet useful utility in Unix-like operating systems that pauses the execution of a program or script for a specified duration. For beginners getting acquainted with scripting or command-line tasks, think of sleep as a way to introduce deliberate delays. By inputting sleep followed by a number, the system will pause for that many seconds. For instance, sleep 5 will introduce a pause of five seconds.

>:gem: You could also write a function combining the reading of the file and the short pause for reusability's sake.

- In order to run the command stored in `forest/tree.txt`, write: `sh forest/tree.txt`.
- Save your script and exit your text editor.
- Test your script by running `sh auto_hunt`

<details>
<summary>Solution</summary>

```bash
#!/bin/bash
cd ~/treasure_hunt

read_clue() {
        cat $1
        sleep 2
}

read_clue cave/echo.txt

read_clue lake/fish.txt

read_clue forest/tree.txt

sh forest/tree.txt
```
</details>

## :exclamation: Make `auto_hunt` executable from any directory
As of now, we need to use the `sh` command and provide an accurate filepath to run the shell script. Try running:

```bash
$> ./auto_hunt
permission denied: ./auto_hunt
```
The error message `permission denied: ./auto_hunt` that you see is coming from the shell, indicating that it has been denied the permission to execute the file named auto_hunt. In Unix-like operating systems, files have certain permissions associated with them, determining who can read, write, or execute them. When you try to run ./auto_hunt without the necessary execute permission, the system prevents it from being executed, leading to this error.

Let's fix this error by making `auto_hunt` executable :

```bash
$> chmod +x auto_hunt
```
:warning: **You do not need to understand the intricacies of Unix permissions at this point in the course. We will be introducing this topic later in the semester**.

Running the script now works:

```bash
$> ./auto_hunt
To find the next clue, search where the water flows
...
```

But wouldn't it be nice to be able to run this script without the path leading to it, like other commands we've been using? Try running:

```bash
$> auto_hunt
command not found: auto_hunt
```
The error message `command not found: auto_hunt` essentially means that the shell couldn't find a command or program named auto_hunt in the places it usually looks for such commands.

When you type a command in the terminal, the shell searches for that command in a list of directories specified in a variable called `PATH`. If the command or program isn't located in any of these directories, you'll get the "command not found" error.

To add `auto_hunt` to your `PATH`, you need to update the `PATH` environment variable to include the directory containing the `auto_hunt` script or program. Here's how you can do it:

You can temporarily add the directory to your `PATH` for the current session with:

```bash
$> export PATH=$PATH:~/treasure_hunt
$> auto_hunt
To find the next clue, search where the water flows
```

However, if you close your shell session, this change to the `PATH` will not be saved. To permemenantly change the `PATH`, you'll need to add the export line to your shell's startup file. The specific file depends on the shell you're using:

- For bash (Git Bash), it's typically `~/.bashrc` or `~/.bash_profile`.

- For zsh (MacOS), it's `~/.zshrc`.

You can add the line using a text editor. For example, to add it to `~/.bashrc`:

```bash
$> nano ~/.bashrc
```

At the bottom of the file, add the following line:

```bash
export PATH=$PATH:~/treasure_hunt
```

>:books: Let's break this line down.
>
> **`export`**: This is a shell builtin command used to mark variables for export to subsequent commands or to child processes. By exporting a variable, it becomes an environment variable and can be accessed by any child processes (like scripts or other programs) that the shell spawns.
>
>**`PATH`**: This is one of the most critical environment variables in Unix-like operating systems. It tells the shell where to look for executable files in response to commands entered by the user. Its value is a list of directories separated by colons (:).
>
>**`$PATH`**: Here, the $ is used to retrieve the current value of the `PATH` variable. So, `$PATH` represents whatever directories are currently in your `PATH`.
>
>**`:`** : In the context of the PATH variable, the colon (:) is used as a delimiter to separate different directory paths.
>
>**`~/treasure_hunt`**: This is a directory named treasure_hunt located within the user's home directory.
>
>By combining all these components this line, retrieves the current value of `PATH` with `$PATH`, appends `~/treasure_hunt` to that value, which effectively adds the `treasure_hunt` directory from the user's home to the list of directories the shell searches when looking for executables. In simple terms, after executing this command, the shell will also look in the ~/treasure_hunt directory when you try to run a command, in addition to all the other directories already in your PATH.


To apply the changes made to the configuration file without having to close and reopen the terminal, you can source it:

For bash:
```bash
$> source ~/.bashrc
```


For zsh:
```bash
$> source ~/.zshrc
```

Now, the `auto_hunt` command should be accessible from any location in the terminal.

```bash
$> auto_hunt
To find the next clue, search where the water flows
...
           .ccccccc.
      .,,,;cooolccoo;;,,.
     .dOx;..;lllll;..;xOd.
   .cdo;',loOXXXXXkll;';odc.
  ,ol:;c,':oko:cccccc,...ckl.
  ;c.;kXo..::..;c::'.......oc
,dc..oXX0kk0o.':lll;..cxxc.,ld,
kNo.'oXXXXXXo',:lll;..oXXOo;cOd.
KOc;oOXXXXXXo.':lol;..dXXXXl';xc
Ol,:k0XXXXXX0c.,clc'.:0XXXXx,.oc
KOc;dOXXXXXXXl..';'..lXXXXXo..oc
dNo..oXXXXXXXOx:..'lxOXXXXXk,.:; ..
cNo..lXXXXXXXXXOolkXXXXXXXXXkl,..;:';.
.,;'.,dkkkkk0XXXXXXXXXXXXXXXXXOxxl;,;,;l:.
  ;c.;:''''':doOXXXXXXXXXXXXXXXXXXOdo;';clc.
  ;c.lOdood:'''oXXXXXXXXXXXXXXXXXXXXXk,..;ol.
  ';.:xxxxxocccoxxxxxxxxxxxxxxxxxxxxxxl::'.';;.
  ';........................................;l'
```

[command-line]: (https://mediacomem.github.io/comem-archidep/2022-2023/subjects/cli?home=MediaComem%2Fcomem-archidep%23readme)
[shell-scripting]: (https://mediacomem.github.io/comem-archidep/2022-2023/subjects/shell-scripting?home=MediaComem%2Fcomem-archidep%23readme)
