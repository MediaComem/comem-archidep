# Git Cheatsheet

If you want to learn more about Git, read the [Pro Git
book](https://git-scm.com/book/en/v2) (online & free).

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Best practices](#best-practices)
- [One-time configuration](#one-time-configuration)
  - [Configure your identity](#configure-your-identity)
  - [Automagically exclude annoying `.DS_Store` files from your commits (macOS only)](#automagically-exclude-annoying-ds_store-files-from-your-commits-mac-only)
- [Frequent operations](#frequent-operations)
  - [Create a new empty repository](#create-a-new-empty-repository)
  - [Put an existing project on GitHub](#put-an-existing-project-on-github)
  - [Push my latest changes to the GitHub repository](#push-my-latest-changes-to-the-github-repository)
  - [Pull the latest changes from the GitHub repository](#pull-the-latest-changes-from-the-github-repository)
  - [Add an SSH key to my GitHub account](#add-an-ssh-key-to-my-github-account)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Best practices

- [**Commit early and often, perfect later** (Seth
  Robertson)](https://sethrobertson.github.io/GitBestPractices/)

  Git only takes full responsibility for your data when you commit. If you fail
  to commit and then do something poorly thought out, you can run into trouble.
  Additionally, having periodic checkpoints means that you can understand how
  you broke something.

- [**Writing a good commit message**
  (GitKraken)](https://www.gitkraken.com/learn/git/best-practices/git-commit-message)

  If by taking a quick look at previous commit messages, you can discern what
  each commit does and why the change was made, you’re on the right track. But
  if your commit messages are confusing or disorganized, then you can help your
  future self and your team by improving your commit message practices with help
  from this article.

- [**Conventional Commits**](https://www.conventionalcommits.org)

  If you want to go further, look at _Conventional Commits_, a specification for
  adding human and machine readable meaning to commit messages.

- Choose a **branching workflow**:
  - [A successful branching model](http://nvie.com/posts/a-successful-git-branching-model/) (for large teams)
  - [A successful branching model considered harmful](https://barro.github.io/2016/02/a-succesful-git-branching-model-considered-harmful/)
  - [Branch-per-feature](http://dymitruk.com/blog/2012/02/05/branch-per-feature/)
  - [Trunk-based development](https://trunkbaseddevelopment.com)
- Use a [Git-aware prompt](https://github.com/magicmonty/bash-git-prompt)
- Enable [Git Rerere](https://git-scm.com/book/en/v2/Git-Tools-Rerere)

## One-time configuration

### Configure your identity

You must configure identity using your user name and e-mail address. This is
important because every Git commit uses this information, and it's immutably
baked into every commit you make. **You should obviously replace your `"John
Doe"` and `john.doe@example.com` with your own information.**

```bash
$> git config --global user.name "John Doe"
$> git config --global user.email john.doe@example.com
```

### Automagically exclude annoying `.DS_Store` files from your commits (macOS only)

You can create a global ignore file in your home directory to ignore them:

```bash
$> echo ".DS_Store" >> ~/.gitignore
```

Run the following command to configure Git to use this file. You only have to do it once on each machine:

```bash
$> git config --global core.excludesfile ~/.gitignore
```

## Frequent operations

### Create a new empty repository

```bash
$> cd /path/to/projects
$> mkdir my-new-project
$> cd my-new-project
$> git init
```

### Put an existing project on GitHub

```bash
$> cd /path/to/projects/my-project
$> git init
```

If you **don't want to commit some files**, create a `.gitignore` file listing them each on one line, e.g.

```txt
*.log
node_modules
```

Commit the project's files:

```bash
$> git add --all
$> git commit -m "Initial commit"
```

Create your new repository [on GitHub](http://github.com), copy the SSH clone
URL (e.g. `git@github.com:MyUser/my-project.git`), and add it as a remote:

```bash
$> git remote add origin git@github.com:MyUser/my-project.git
```

Push your `main` branch and track it (with the `-u` option):

```bash
$> git push -u origin main
```

### Push my latest changes to the GitHub repository

Commit and push your changes:

```bash
$> git add --all
$> git commit -m "My changes"
$> git push origin main
```

**If GitHub rejects your push**, you should **pull the latest changes** first.

### Pull the latest changes from the GitHub repository

**If you have uncommitted change** (check with `git status`), stage and commit them:

```bash
$> git add --all
$> git commit -m "My changes"
```

Pull the changes:

```bash
$> git pull
```

If you've worked on the same files, there might be a **merge**. **If there is a
merge conflict**, [resolve
it](https://mediacomem.github.io/comem-archidep/2024-2025/subjects/git-branching/?home=MediaComem%2Fcomem-archidep%23readme#33)
and complete the merge with `git commit`.

### Add an SSH key to my GitHub account

See [Adding a new SSH key to your GitHub account](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account).
