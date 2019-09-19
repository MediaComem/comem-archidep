# Git Hooks

Learn the basics of Git hooks.

<!-- slide-include ../../BANNER.md -->

**You will need**

* A Unix CLI
* [Git][git]

**Recommended reading**

* [Git Introduction](../git/)
* [Git Branching](../git-branching/)
* [Collaborating with Git](../git-collaborating/)
* [Shell Scripting](../shell-scripting/)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [What is a Git hook?](#what-is-a-git-hook)
    - [What kind of hooks are there?](#what-kind-of-hooks-are-there)
    - [How can I create a hook?](#how-can-i-create-a-hook)
        - [Hooks are not under version control](#hooks-are-not-under-version-control)
    - [How do I use a hook?](#how-do-i-use-a-hook)
    - [What are hooks good for?](#what-are-hooks-good-for)
- [References](#references)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## What is a Git hook?

A Git hook is **custom script** that can be **triggered when certain actions occur**.
Hooks can be any script, e.g. a shell script, a Ruby script, a Python script, etc.

Hooks must be executable files in the `hooks` directory inside a repository's Git directory
(inside the `.git` directory in a normal repository).

You can find example hook files in most Git repositores:

```bash
$> cd /path/to/a/git/repository

$> cat .git/hooks/pre-commit.sample
#!/bin/sh
#
# An example hook script to verify what is about to be committed.
...
```

> These example files are not triggered because they are not executable and do not have the right name.

### What kind of hooks are there?

Hook scripts must have a specific name (and be executable) to be triggered.

These hook scripts are only limited by a developer's imagination.
Some example hook scripts include:

Hook           | Example usage
:---           | :---
`pre-commit`   | Check the commit message for spelling errors.
`pre-receive`  | Enforce project coding standards.
`post-commit`  | Email/SMS team members of a new commit.
`post-receive` | Push the code to production.

You can type the `git help hooks` command to get the full list of hooks and their documentation.
A full list is also available [here][git-hooks].

### How can I create a hook?

Create a new repository:

```bash
$> cd /path/to/projects
$> mkdir git-hook-example
$> cd git-hook-example
$> git init
```

Create a hook script named `pre-commit` that will be executed before every commit:

```bash
$> echo '#!/bin/bash' > .git/hooks/pre-commit
$> echo 'echo You are about to commit...' >> .git/hooks/pre-commit
$> chmod +x .git/hooks/pre-commit
```

You now have a `pre-commit` hook script:

```bash
$> cat .git/hooks/pre-commit
#!/bin/bash
echo You are about to commit...
```

#### Hooks are not under version control

Note that hooks are not part of the working tree and thus **cannot be put under version control**:

```bash
$> git status
On branch master

No commits yet

nothing to commit (create/copy files and use "git add" to track)
```

> This is a good thing, as you don't want people to be able to send malicious hook scripts to your machine
> every time you clone a repository from the Internet.

### How do I use a hook?

Following the previous example, make a commit and the `pre-commit` hook will be automatically triggered:

```bash
$> echo content > file.txt
$> git add .
$> git commit -m "Test"

You are about to commit...

[master 14b306d] Test
 1 file changed, 1 insertion(+), 1 deletion(-)
```

### What are hooks good for?

Hooks can be a way to automate repetitive or mundane tasks,
like removing trailing spaces at each commit.

Or they can be used to automate deployments,
for example to run the latest version of a server-side application every time new commits are pushed.



## References

* [Pro Git Book](https://git-scm.com/book/en/v2)
  * [Customizing Git - Git Hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)
* [Git Hooks][git-hooks]





[git]: https://git-scm.com
[git-hooks]: https://githooks.com
