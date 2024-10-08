# Version Control with Git

Learn the basics of [Git][git], one of the most popular distributed version control systems.
This is a condensed version of the first chapters of the [Git Book](https://git-scm.com/book/en/v2), which you should read if you want more detailed information on the subject.

<!-- slide-include ../../BANNER.md -->

**You will need**

* A Unix CLI

**Recommended reading**

* [Command line](../cli/)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [What is Git?](#what-is-git)
- [What is a version control system?](#what-is-a-version-control-system)
- [A short history](#a-short-history)
  - [**Local** version control systems (1980s)](#local-version-control-systems-1980s)
  - [**Centralized** version control systems (1990s)](#centralized-version-control-systems-1990s)
  - [**Distributed** version control systems (2000+)](#distributed-version-control-systems-2000)
- [Git basics](#git-basics)
  - [Snapshots, not differences](#snapshots-not-differences)
  - [Git has integrity](#git-has-integrity)
  - [What's in a Git project?](#whats-in-a-git-project)
    - [The Git directory](#the-git-directory)
    - [The working directory (also called the working tree)](#the-working-directory-also-called-the-working-tree)
    - [The staging area (also called the index)](#the-staging-area-also-called-the-index)
  - [The basic Git workflow](#the-basic-git-workflow)
    - [Using the staging area](#using-the-staging-area)
- [Getting started](#getting-started)
  - [Git and the command line](#git-and-the-command-line)
    - [Installing Git](#installing-git)
  - [First-time Git setup](#first-time-git-setup)
  - [Choosing a default branch name](#choosing-a-default-branch-name)
  - [Creating a new repository](#creating-a-new-repository)
  - [Checking the status of your files](#checking-the-status-of-your-files)
  - [Adding new files](#adding-new-files)
    - [Tracking new files](#tracking-new-files)
    - [Checking staged changes](#checking-staged-changes)
  - [Committing your changes](#committing-your-changes)
  - [Modifying files](#modifying-files)
    - [Staging modified files](#staging-modified-files)
    - [Modifying a staged file](#modifying-a-staged-file)
    - [Checking staged and unstaged changes](#checking-staged-and-unstaged-changes)
    - [Staging area versus working directory](#staging-area-versus-working-directory)
    - [Committing partially staged changes](#committing-partially-staged-changes)
  - [Moving and removing files](#moving-and-removing-files)
    - [Adding all changes](#adding-all-changes)
- [Viewing the commit history](#viewing-the-commit-history)
  - [Viewing the changes in the history](#viewing-the-changes-in-the-history)
  - [Other log options](#other-log-options)
- [Ignoring files](#ignoring-files)
  - [Committing the ignore file](#committing-the-ignore-file)
  - [Status of ignored files](#status-of-ignored-files)
  - [Global ignore file](#global-ignore-file)
- [Undoing things](#undoing-things)
  - [Unmodifying a modified file](#unmodifying-a-modified-file)
  - [Unstaging a staged file](#unstaging-a-staged-file)
  - [Changing the commit message](#changing-the-commit-message)
  - [Adding changes to a commit](#adding-changes-to-a-commit)
- [Best practices](#best-practices)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## What is Git?

<a href='https://git-scm.com'><img src='images/git-logo.png' width='30%' /></a>

Git is a [**version control system (VCS)**][vcs] originally developed by Linus
Torvalds, the creator of Linux, to manage the source code of the Linux kernel.

Its goals are:

* **Speed**
* **Simple** design
* Strong support for **non-linear development** (thousands of parallel branches)
* Fully **distributed**
* Able to handle **large projects** like the Linux kernel efficiently (speed and
  data size)



## What is a version control system?

> A system that records changes to a file or set of files over time so that you can recall specific versions later.

<p class='center'><img src='images/commits.png' width='50%' /></p>

What can I do with it?

* **Revert** specific files (or an entire project) back to a previous state
* **Compare** changes over time
* See who last modified something that might be causing a problem, when the
  issue was introduced, and more
* **Recover** if you screw things up or lose files
* **Collaborate** on a project as a distributed team



## A short history

<!-- slide-front-matter class: center, middle -->



### **Local** version control systems (1980s)

<!-- slide-column -->

Basically, you **manually** copy your files into other directories to keep old versions.

Systems such as [**R**evision **C**ontrol **S**ystem (RCS)][rcs] automate this
process.

> RCS was first released in 1982.

<!-- slide-column -->

<img src='images/local-vcs.png' width='100%' />

<!-- slide-container -->

**But:**

* It's easy to accidentally edit the wrong files.
* It's hard to **collaborate** on different versions with other people.



### **Centralized** version control systems (1990s)

<!-- slide-column -->

Systems such as [**C**oncurrent **V**ersion **S**ystems (CVS)][cvs] and
[**S**ub**v**ersio**n** (SVN)][svn] use a **single central server** that keeps
all the versioned files, and clients get files from there.

Administrators have **fine-grained control** over who can do what.

> CVS and SVN were first released in 1990 and 2000, respectively.

<!-- slide-column 45 -->

<img src='images/centralized-vcs.png' width='100%' />

<!-- slide-container -->

**But:**

* Most operations are **slow** since they require connecting to a server.
* The centralized server is a **single point of failure**.
* If proper backups are not kept, the history of the project **can be lost**.

> You could also consider storing your files in a shared Dropbox, Google Drive,
> etc. to be a kind of centralized version control system. However, it doesn't
> have as many tools for **consulting and manipulating the history** of your
> project, or to **collaborate on source code**.



### **Distributed** version control systems (2000+)

<!-- slide-column -->

Systems such as [Git][git] and [Mercurial][mercurial] are **distributed**.
Clients **fully mirror** the repository, not just the latest snapshot.

* Each client has a **full backup** of the project.
* Different [types of collaborative workflows][distributed-workflows] can be
  used.

> Git and Mercurial were first released in 2005.

<!-- slide-column -->

<img src='images/distributed-vcs.png' width='100%' />



## Git basics

<!-- slide-front-matter class: center, middle -->



### Snapshots, not differences

<!-- slide-column 45 -->

Unlike other version control systems, Git stores its data as **snapshots** instead of file-based changes.

Because Git stores all versions of all files **locally**, most Git operations are almost instantaneous and do not require a connection to a server:

* Browsing the history
* Checking a file's changes from a month ago
* Committing

<!-- slide-column -->

**Changes (Subversion)**

<img src='images/deltas.png' width='100%' />

**Snapshots (Git)**

<img src='images/snapshots.png' width='100%' />

<!-- slide-notes -->

Git thinks of its data more like a set of **snapshots** of a miniature filesystem.

Every time you save the state of your project in Git, it basically takes a picture of what all your files look like at that moment and stores a reference to that snapshot.
To be efficient, **if files have not changed, Git doesn't store the file again**, just a link to the previous identical file it has already stored.
Git thinks about its data more like a stream of snapshots.



### Git has integrity

All Git objects are identified by a [SHA-1][sha1] hash that looks like this:

```
24b9da6552252987aa493b52f8696cd6d3b00373
```

You will see them all over the place in Git.
Often you will only see a prefix (the first 6-7 characters):

```
24b9da6
```

Because all content is [hashed][hash], it's virtually impossible for files to be
lost or corrupted without Git knowing about it. This functionality is built into
Git at the lowest levels and is integral to its philosophy.



### What's in a Git project?

The file structure in a Git project looks like this:

```txt
my-project:
  .git:
    HEAD
    config
    hooks
    index
    objects
    ...
  file1.txt
  file2.txt
  dir:
    file3.txt
```

A Git project has three main parts:

* The Git directory
* The working directory
* The staging area (also called the index)

#### The Git directory

The Git directory is where Git stores all the **snapshots** of the different **versions** of your files.
This is the most important part of Git, and it is what is copied when you clone a repository from another computer or a server.

It's located in the `.git` directory in the project's directory:

```txt
my-project:
* .git:
*   HEAD
*   config
*   hooks
*   index
*   objects
*   ...
  file1.txt
  file2.txt
  dir:
    file3.txt
```

You should never modify any of the files in this directory yourself;
you could easily corrupt the Git repository.

It is hidden by default, but you can see it on the command line.

#### The working directory (also called the working tree)

The working directory contains the **files you are currently working on**; that is, **one specific version** of your project.
These files are pulled out of the compressed database in the Git directory and placed in your project's directory for you to use or modify:

```txt
*my-project:
  .git:
    HEAD
    config
    hooks
    index
    objects
    ...
* file1.txt
* file2.txt
* dir:
*   file3.txt
```

#### The staging area (also called the index)

The staging area is a file in your Git directory, that stores information about
**what will go into the next commit (or version)**.

Before file snapshots are **committed** in the Git directory, they must go
through the *staging area*:

```txt
my-project:
  .git:
    HEAD
    config
    hooks
*   index
    objects
    ...
  file1.txt
  file2.txt
  dir:
    file3.txt
```



### The basic Git workflow

This is one of the **most important things to remember about Git**:

<p class='center'><img src='images/workflow.png' width='60%' /></p>

* You **check out** (or **switch to**) a specific version of your files into the
  *working directory*.
* You **modify** files (or add new files) in your *working directory*.
* You **stage** the files, adding snapshots of them to your *staging area*.
* You make a **commit**, which takes the files as they are in the *staging area*
  and stores these snapshots permanently to your *Git directory*.

#### Using the staging area

New snapshots of files **MUST go through the staging area** to be **committed** into the Git directory.

<img src='images/staging-area-loading-dock.jpg' width='100%' />



## Getting started

The rest of this documentation is a tutorial where you will learn how to:

* Configure Git for the first time
* Create a new repository
* Check the status of your files
* Track new files
* Stage and commit modified files
* Move and remove files
* Ignore files



### Git and the command line

There are a lot of different ways to use Git: the original **command line
tools** and various **GUIs** of varying capabilities. But the command line is
the only place you can run **all** Git commands with all their options.

If you know how to run the command line version, you can easily figure out how
to use the GUI version, while the opposite is not necessarily true. So the
**command line** is what we will use.

Some of you may already have Git installed. Run the following command in your
CLI to make sure:

```bash
$> git --version
git version 2.46.0
```

#### Installing Git

On **macOS**, Git may already be installed. If not, it is part of the
command-line tools, which you can install by running the following command:

```bash
$> xcode-select --install
```

On **Windows**, you should have Git if you have Git Bash installed. If not, you
can download it directly from https://git-scm.com/download/win

On **Linux**, Git may already be installed. If not, you can install it using
your distribution's package manager, for example on APT-based systems:

```bash
$> sudo apt install git-all
```

Otherwise, follow the [official installation instructions][install-git].



### First-time Git setup

Now that you have Git, you must configure your **identity**: your user name and
e-mail address. This is important because **every Git commit uses this
information**, and it's *immutably* baked into every commit you make.

Use the `git config` command to do this:

```bash
$> git config --global user.name "John Doe"
$> git config --global user.email john.doe@example.com
```

You can also run the command with the `--list` option to check that the settings
were successfully applied:

```bash
$> git config --list
user.name=John Doe
user.email=john.doe@example.com
```

> Note that with the `--global` option, Git will store these settings in your user configuration file (`~/.gitconfig`),
> so you only need to do this **once on any given computer**.
> You can also change them at any time by running the commands again.
> Run `cat ~/.gitconfig` to display this file.



### Choosing a default branch name

You should also configure a default branch name, like `main`, for all your
repositories:

```bash
$> git config --global init.defaultBranch main
```

We will talk more about branches later. If you don't perform this configuration
now, you may see this warning when creating your first repository:

```bash
$> git init
hint: Using 'master' as the name for the initial branch. This default branch name
hint: is subject to change. To configure the initial branch name to use in all
hint: of your new repositories, which will suppress this warning, call:
hint:
hint: 	git config --global init.defaultBranch <name>
hint:
hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and
hint: 'development'. The just-created branch can be renamed via this command:
hint:
hint: 	git branch -m <name>
```



### Creating a new repository

Let's get started by creating a directory for our new project:

```bash
$> cd /path/to/projects
$> mkdir hello-project
```

Go into the directory and run `git init` to create a Git repository:

```bash
$> cd hello-project
$> git init
Initialized empty Git repository in /path/to/projects/hello-project
```

This creates a Git directory (`.git`) with an empty object database.
At this point, nothing in your project is tracked yet.



### Checking the status of your files

The main tool you use to determine which files are in which state is the `git status` command.
If you run it in the repo you just created, you should see something like this:

```bash
$> git status
On branch main

Initial commit

nothing to commit (create/copy files and use "git add" to track)
```

This means you have an empty repo with no commits, and a **clean working directory** – there is nothing there.

As you can see, Git often helps you by telling you what you can do next: you need to start adding some files.

> **The `git status` command is your best friend when using Git.**
> Do not hesitate to use it at any time to check in what state you are.



### Adding new files

In the project's directory, write "Hello World" into a `hello.txt` file and "Hi Bob" into a `hi.txt` file:

```bash
$> echo "Hello World" > hello.txt
$> echo "Hi Bob" > hi.txt
```

Re-run the `git status` command:

```bash
$> git status
On branch main

Initial commit

Untracked files:
  (use "git add <file>..." to include in what will be committed)

  hello.txt
  hi.txt

nothing added to commit but untracked files present (use "git add" to track)
```

Those files are **untracked**.
Git will not include them in the repository unless you **explicitly** tell it to do so.

#### Tracking new files

In order to begin tracking a new file, you must use the `git add` command:

```bash
$> git add hello.txt
$> git add hi.txt
$> git status
On branch main

Initial commit

Changes to be committed:
  (use "git rm --cached <file>..." to unstage)

    new file:   hello.txt
    new file:   hi.txt
```

The files are now **staged**: they will be in the next commit.

> **Tips:**
>
> * `git add *.txt` would have added all files with the `.txt` extension in one
>   command.
> * `git add .` would have added all the files in the current directory
>   (recursively).

#### Checking staged changes

Git can show you what you have **staged**:

```diff
$> git diff --staged

diff --git a/hello.txt b/`hello.txt`
new file mode 100644
index 0000000..557db03
--- /dev/null
+++ b/hello.txt
@@ -0,0 +1 @@
+Hello World
diff --git a/hi.txt b/`hi.txt`
new file mode 100644
index 0000000..e5db1d9
--- /dev/null
+++ b/hi.txt
@@ -0,0 +1 @@
+Hi Bob
```

It shows you each staged file and the changes in those files.



### Committing your changes

Now that your staging area is set up the way you want it, you can **commit** your changes with the `git commit` command.
This command takes a `--message` or `-m` option where you should put a short description of the changes you made:

```bash
$> git commit -m "Add hello and hi files"

[main (root-commit) `c90aa36`] Add hello and hi files
 2 files changed, 2 insertions(+)
 create mode 100644 hello.txt
 create mode 100644 hi.txt
```

Note that Git gives you the beginning of the new commit's SHA-1 checksum (`c90aa36` in this example, but it will be different on your machine)
along with change statistics and other information.

```bash
$> git status
On branch main
nothing to commit, working tree clean
```



### Modifying files

Let's make some changes.
Add one line to both files:

```bash
echo "You are beautiful" >> hello.txt
echo "Hi Jane" >> hi.txt
```

And see what Git tells us:

```bash
$> git status
On branch main
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)

  modified:   hello.txt
  modified:   hi.txt

no changes added to commit (use "git add" and/or "git commit -a")
```

Git has identified the **modified files** different from the last commit,
but they are **not staged**, meaning that if you try to commit now, those changes will **not** be committed.

#### Staging modified files

Stage the changes on the `hello.txt` file and check the status:

```bash
$> git add hello.txt

$> git status
On branch main
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)

  modified:   hello.txt

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)

  modified:   hi.txt
```

If you commit now, only the changes on `hello.txt` will be included in the snapshot, while the changes in `hi.txt` will remain uncommitted.

#### Modifying a staged file

Before committing, let's make another change to `hello.txt` and check the status:

```bash
$> echo "I see trees of green" >> hello.txt

$> git status
On branch main
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)

  modified:   hello.txt

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)

  modified:   hello.txt
  modified:   hi.txt
```

`hello.txt` is shown both under "Changes to be committed" and "Changes not staged for commit".
What does this mean?

#### Checking staged and unstaged changes

<!-- slide-column 40 -->

Use `git diff` with the `--staged` option to show **staged** changes.

<!-- slide-column -->

```diff
$> git diff --staged
diff --git a/hello.txt b/hello.txt
index 557db03..2136a8e 100644
--- a/hello.txt
+++ b/hello.txt
@@ -1 +1,2 @@
 Hello World
+You are beautiful
```

<!-- slide-container -->

<!-- slide-column 40 -->

You can also use it without the option to see **unstaged** changes.

<!-- slide-column -->

```diff
$> git diff
diff --git a/hello.txt b/hello.txt
index 2136a8e..730ea5a 100644
--- a/hello.txt
+++ b/hello.txt
@@ -1,2 +1,3 @@
 Hello World
 You are beautiful
+I see trees of green
diff --git a/hi.txt b/hi.txt
index e5db1d9..f74a87a 100644
--- a/hi.txt
+++ b/hi.txt
@@ -1 +1,2 @@
 Hi Bob
+Hi Jane
```

#### Staging area versus working directory

This example shows you that the working directory and the staging area are
really two separate steps:

* The version of `hello.txt` you have **staged** contains two lines of text
  ("Hello World" and "You are beautiful"). This is what will be committed.
* The version of `hello.txt` in the **working directory** has an additional line
  of text ("I see trees of green") which you added later. It will not be
  included in the next commit unless you stage the file again.

<p class='center'><img src='images/areas.png' width='60%' /></p>

#### Committing partially staged changes

Commit now:

```bash
$> git commit -m "The world is beautiful"
[main b65ec9c] The world is beautiful
 1 file changed, 1 insertion(+)
```

As expected, the changes we did not stage are still **uncommitted**.

```bash
$> git status
On branch main
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)

  modified:   hello.txt
  modified:   hi.txt

no changes added to commit (use "git add" and/or "git commit -a")
```

Let's fix that:

```bash
$> git add .
$> git commit -m "New lines in hello.txt and hi.txt"
[main dfc6c75] New lines in hello.txt and hi.txt
 2 files changed, 2 insertions(+)
```



### Moving and removing files

Git has a `git mv` (**m**o**v**e) and `git rm` (**r**e**m**ove) command, but
nobody uses them for day-to-day work on files. It's simpler to just move or
remove the files yourself. Rename `hi.txt` to `people.txt` in your editor or
with this command:

```bash
$> mv hi.txt people.txt
```

Then see what Git tells you:

```bash
$> git status
On branch main
Changes not staged for commit:
  (use "git add/rm <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)

  deleted:    hi.txt

Untracked files:
  (use "git add <file>..." to include in what will be committed)

  people.txt

no changes added to commit (use "git add" and/or "git commit -a")
```

#### Adding all changes

You can tell Git to add all changes (additions, modifications and removals):

```bash
$> git add .

$> git status
On branch main
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)

  renamed:    hi.txt -> people.txt
```

Note that Git can now tell that the file was moved.

Many developers simply modify and manipulate files in their favorite editor or IDE, then use the command above.

You may commit the rename now:

```bash
$> git commit -m "Rename hi.txt to people.txt"
```



## Viewing the commit history

Git has a very powerful `log` command:

```bash
$> git log
commit 739b7c8987d72879f79ac7979as8f9db790a82da
Author: John Doe <john.doe@example.com>
Date:   Mon Jan 23 11:50:09 2017 +0100

    Rename hi.txt to people.txt

commit e753ceb86806b285aa105a846c7295e826439637
Author: John Doe <john.doe@example.com>
Date:   Mon Jan 23 11:50:07 2017 +0100

    New lines in hello.txt and hi.txt

commit 4c56257f622c53f1ddeaf3d58b6729b01b35aedb
Author: John Doe <john.doe@example.com>
Date:   Mon Jan 23 11:50:00 2017 +0100

    The world is beautiful

...
```



### Viewing the changes in the history

With the `--patch` option, you can see that Git shows you the differences you introduced in each commit:

```diff
$> git log --patch
commit e753ceb86806b285aa105a846c7295e826439637
Author: John Doe <john.doe@example.com>
Date:   Mon Jan 23 11:50:07 2017 +0100

    New lines in hello.txt and hi.txt

diff --git a/hello.txt b/hello.txt
index 2136a8e..730ea5a 100644
--- a/hello.txt
+++ b/hello.txt
@@ -1,2 +1,3 @@
 Hello World
 You are beautiful
+I see trees of green
diff --git a/hi.txt b/hi.txt
index e5db1d9..f74a87a 100644
--- a/hi.txt
+++ b/hi.txt
@@ -1 +1,2 @@
 Hi Bob
+Hi Jane
```



### Other log options

The `git log` has many options to customize its output or limit what commits it shows you.
Here are some other useful options:

Option     | Limit to
:-         | :-
`--stat`   | Show the list of changed files
`--pretty` | Show the commit history with a [custom format][git-log-pretty-formats]
`-(n)`     | Only the last n commits
`--after`  | Only commits made after the specified date
`--before` | Only commits made before the specified date
`--author` | Only commits whose author matches the specified string
`--grep`   | Only commits with a commit message containing the string
`-S`       | Only commits adding or removing code matching the string

Use `git help log` or read [the documentation][git-log] to learn more.



## Ignoring files

Sometimes there are files you don't want to commit in your repository:

* Log files
* Dependencies
* Build artifacts

You can tell Git not to track them by adding a `.gitignore` file to your repository.
Create it now with this content:

```
**.log
*node_modules
```



### Committing the ignore file

Do not forget to stage and commit the `.gitignore` file:

```bash
$> git add .gitignore
$> git commit -m "Ignore file"
```

> That way, when you start collaborating with the other developers in your team,
> the same files will be ignored on their machine.



### Status of ignored files

Ignored files are no longer shown when using `git status`:

```bash
$> echo data > app.log

$> git status
On branch main
nothing to commit, working tree clean
```



### Global ignore file

There are **some files you might want to always ignore** for all projects on your machine.

For example, macOS creates `.DS_Store` files in directories you open in the Finder.
There is no reason to keep these files in your Git history,
and they are useless on other operating systems.

You can create a **global ignore file** in your home directory to ignore them:

```bash
$> echo ".DS_Store" >> ~/.gitignore
```

Run the following command to configure Git to use this file.
You only have to do it once on each machine:

```bash
$> git config --global core.excludesfile ~/.gitignore
```

`.DS_Store` files will no longer show up in your `git status` output,
and they will not be staged or committed.



## Undoing things

There are several ways of undoing things with Git.
We'll review a few of the tools available.

**_Be careful:_** you can't always undo some of these operations.



### Unmodifying a modified file

Sometimes you make a change and you realize it was wrong or you don't need it anymore.
Git actually tells you what to do to discard that change:

```bash
$> echo "Hi Steve" >> people.txt
$> git status
On branch main
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  `(use "git restore <file>..." to discard changes in working directory)`

  modified:   people.txt

no changes added to commit (use "git add" and/or "git commit -a")
```

Simply use `git restore` as instructed:

```bash
$> git restore people.txt

$> git status
On branch main
nothing to commit, working tree clean
```

Note that in this case, **the change is forever lost** as it was never committed.



### Unstaging a staged file

If you have staged a file but realize you don't want it in the next commit anymore, Git also tells you what to do:

```bash
$> echo "Hi Steve" >> people.txt
$> git add people.txt
$> git status
On branch main
Changes to be committed:
  `(use "git restore --staged <file>..." to unstage)`

  modified:   people.txt
```

Use `git restore` as instructed:

```bash
$> git restore --staged people.txt
```

The changes will still be in the file in the working directory. If you want to
completely get rid of them, you can use `git restore` as shown before.



### Changing the commit message

Commit a new change:

```bash
$> echo Wolf >> people.txt
$> git add people.txt
$> git commit -m "Fix teh prblme"
```

Oops, you've used the wrong commit message. Want to change it?

```bash
$> git commit --amend -m "Fix the problem"
```

> **Be careful:** this changes the commit and its SHA-1 hash. You should not do
> this if you have already shared this commit with others.



### Adding changes to a commit

Make two changes but only commit one of them:

```bash
$> echo a > a.txt
$> echo b > b.txt
$> git add a.txt
$> git commit -m "Add a & b"
```

Oops, you forgot to stage one file. Want to add it to the last commit?

```bash
$> git add b.txt
$> git commit --amend
```

Your editor will open to give you the opportunity to change the message if you
want, but you do not have to. Simply save and exit the editor. The changes to
`b.txt` will now also be in the last commit.

> **Be careful:** this changes the commit and its SHA-1 hash. You should not do
> this if you have already shared this commit with others.



## Best practices

* [**Commit early and often, perfect later** (Seth
  Robertson)](https://sethrobertson.github.io/GitBestPractices/)

  Git only takes full responsibility for your data when you commit. If you fail
  to commit and then do something poorly thought out, you can run into trouble.
  Additionally, having periodic checkpoints means that you can understand how
  you broke something.
* [**Writing a good commit message**
  (GitKraken)](https://www.gitkraken.com/learn/git/best-practices/git-commit-message)

  If by taking a quick look at previous commit messages, you can discern what
  each commit does and why the change was made, you’re on the right track. But
  if your commit messages are confusing or disorganized, then you can help your
  future self and your team by improving your commit message practices with help
  from this article.
* [**Conventional Commits**](https://www.conventionalcommits.org)

  If you want to go further, look at *Conventional Commits*, a specification for
  adding human and machine readable meaning to commit messages.





[cvs]: https://en.wikipedia.org/wiki/Concurrent_Versions_System
[distributed-workflows]: https://git-scm.com/book/en/v2/Distributed-Git-Distributed-Workflows
[dsstore]: https://en.wikipedia.org/wiki/.DS_Store
[git]: https://git-scm.com/
[git-log]: https://git-scm.com/book/en/v2/Git-Basics-Viewing-the-Commit-History
[git-log-pretty-formats]: https://git-scm.com/docs/git-log#_pretty_formats
[hash]: https://en.wikipedia.org/wiki/Hash_function
[install-git]: https://git-scm.com/book/en/v2/Getting-Started-Installing-Git
[mercurial]: https://www.mercurial-scm.org/
[rcs]: https://en.wikipedia.org/wiki/Revision_Control_System
[sha1]: https://en.wikipedia.org/wiki/SHA-1
[svn]: https://subversion.apache.org/
[vcs]: https://en.wikipedia.org/wiki/Version_control
