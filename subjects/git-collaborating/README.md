# Collaborating with Git

Learn how to collaborate on [GitHub][github] with [Git][git].

<!-- slide-include ../../BANNER.md -->

**You will need**

* [Git][git]
* A free [GitHub][github] account
* A Unix CLI

**Recommended reading**

* [Version control with Git](../git/)
* [Git branching](../git-branching/)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Group work](#group-work)
- [Distributed version control system](#distributed-version-control-system)
  - [What is a remote?](#what-is-a-remote)
  - [Centralized workflow](#centralized-workflow)
  - [Working with GitHub](#working-with-github)
    - [Create a free GitHub account](#create-a-free-github-account)
    - [Check your SSH key](#check-your-ssh-key)
    - [Create an SSH key](#create-an-ssh-key)
    - [Copy the SSH key](#copy-the-ssh-key)
    - [Add the SSH key to your GitHub account](#add-the-ssh-key-to-your-github-account)
- [Sharing changes](#sharing-changes)
  - [Bob: create a repository on GitHub](#bob-create-a-repository-on-github)
  - [Bob: add Alice as a collaborator](#bob-add-alice-as-a-collaborator)
  - [Bob: copy the remote SSH URL](#bob-copy-the-remote-ssh-url)
  - [Bob: add the remote to your local repository](#bob-add-the-remote-to-your-local-repository)
  - [Bob: push your commits to the shared repository](#bob-push-your-commits-to-the-shared-repository)
  - [Bob: remote branches](#bob-remote-branches)
  - [Alice: get the remote repository's SSH URL](#alice-get-the-remote-repositorys-ssh-url)
  - [Alice: clone the shared repository](#alice-clone-the-shared-repository)
  - [Alice: remote branches](#alice-remote-branches)
  - [Alice: make local changes](#alice-make-local-changes)
  - [Alice: check the state of branches](#alice-check-the-state-of-branches)
  - [Alice: push to the shared repository](#alice-push-to-the-shared-repository)
  - [Bob: check the state of branches](#bob-check-the-state-of-branches)
  - [Bob: fetch changes from the shared repository](#bob-fetch-changes-from-the-shared-repository)
  - [Bob: check the state of branches](#bob-check-the-state-of-branches-1)
  - [Using git pull](#using-git-pull)
- [Managing conflicting commit histories](#managing-conflicting-commit-histories)
  - [Bob: fix the bug](#bob-fix-the-bug)
  - [Alice: make other changes](#alice-make-other-changes)
  - [Alice: push the other changes](#alice-push-the-other-changes)
  - [Rejected pushes](#rejected-pushes)
    - [Alice: fetch the changes](#alice-fetch-the-changes)
    - [Alice: try to push again](#alice-try-to-push-again)
  - [Divergent history](#divergent-history)
  - [Alice: pull changes from the shared repository](#alice-pull-changes-from-the-shared-repository)
  - [Alice: check the conflict markers](#alice-check-the-conflict-markers)
  - [Alice: check the state of branches](#alice-check-the-state-of-branches-1)
  - [Alice: push the changes](#alice-push-the-changes)
  - [Bob: pull the changes](#bob-pull-the-changes)
- [Resources](#resources)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Group work

This tutorial is meant to be performed by a group of two.
Throughout the rest of the document, the members of the group will be referred to as **Bob** and **Alice**.

The tutorial assumes that you have followed the [previous Git tutorial][git-tutorial] and have kept your calculator repository.



## Distributed version control system

<!-- slide-front-matter class: center, middle -->

Working with remote repositories



### What is a remote?

A **remote repository** is a version of your project that is hosted on the Internet or network somewhere.
You can have **several of them**.

Collaborating with others involves **pushing** and **pulling** data to and from these remote repositories when you need to share work.

<p class='center'><img src='images/remotes.png' width='70%' /></p>



### Centralized workflow

There are [many ways][distributed-workflows] to work with Git as a team.
Here we will use a simple **centralized workflow**:

<p class='center'><img src='images/centralized-workflow.png' width='60%' /></p>

In this workflow:

* A **shared central repository** is hosted on GitHub.
* Each developer has a **repository on their local machine**.
  * Each developer will add the shared repository as a **remote**.



### Working with GitHub

> "[GitHub][github] is a web-based Git repository and Internet hosting service.
> It offers all of the **distributed version control** and **source code
> management (SCM)** functionality of **Git** as well as other features like
> access control, bug tracking, feature requests, task management, and wikis for
> every project."

<p class='center'><img src='images/github.png' width='70%'></p>

#### Create a free GitHub account

Both group members should register on [GitHub][github]:

<p class='center'><img src='images/github-account.jpg' width='100%'></p>

#### Check your SSH key

To push code to GitHub, you will need to **authenticate** yourself. There are
two methods of authentication: HTTPS username/password or SSH keys. We will use
an **SSH key** in this course. You can check if you have one already with this
command:

```bash
$> ls ~/.ssh
id_ed25519  id_ed25519.pub
```

If you see these files, then you already have an SSH key pair (`id_ed25519` is
the **private** key, `id_ed25519.pub` is the **public** key, or it might be
`id_rsa` and `id_rsa.pub` for older SSH clients).

> Using an SSH key arguably simplifies authentication. If you don't have a
> password on your private SSH key, you won't have to enter one when you use Git
> over SSH either. If you have a password, you should already have learned to
> use an SSH agent to avoid having to enter your password every time. Git will
> also use the agent to authenticate.

#### Create an SSH key

If you don't have a key yet (or see a *"No such file or directory"* error), use
the `ssh-keygen` command to generate a new key pair (press Enter at every prompt
to keep the defaults):

```bash
$> ssh-keygen
Generating public/private rsa key pair.
Enter file in which to save the key (/home/.ssh/id_ed25519):
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /home/.ssh/id_ed25519.
Your public key has been saved in /home/.ssh/id_ed25519.pub.
The key fingerprint is:
SHA256:ULmjUQDN4Snkh0s9u093mcva4cI94cDk name@host
```

> Read [SSH Key Protection](../ssh/#47) again as a reminder on whether or not to
> set a passphrase.

#### Copy the SSH key

To authenticate using your SSH key on GitHub, you will need to copy your **public key**.
You can display it on the CLI with this command:

```bash
$> cat ~/.ssh/id_ed25519.pub
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAAEAQC+OMYWxBCiKa1lZuUc8sLcSBW17h
l4VTy9DaarFC98KxS3NQao/7+eMkOS3o1II4QL7pn7WMYITWpWP9UdJKNef/KQlTpS
1QVbhb6iJ2z2+GGt8+b0GvBRAZgab9TeOIrzN1QyknO4 name@host
```

> The file might be `~/.ssh/id_rsa.pub` with older SSH clients that still use
> RSA as the default algorithm. **DO NOT** copy the private key (the
> `~/.ssh/id_ed25519` or `~/.ssh/id_rsa` file).

#### Add the SSH key to your GitHub account

<!-- slide-column 20 -->

<img src='images/github-settings.png' width='100%' />

<img src='images/github-settings-ssh.png' width='100%' />

<!-- slide-column -->

On GitHub, find the **SSH and GPG keys** section of your account settings and paste your **public SSH key** there:

<img src='images/github-settings-ssh-key.png' width='100%' />

(The title of the key is not important. It's useful when you have multiple keys, to remember which is which.)



## Sharing changes

<!-- slide-front-matter class: center, middle -->

Clone repositories, push and pull commits



### Bob: create a repository on GitHub

**Bob** should create a repository from the GitHub menu:

<!-- slide-column 20 -->

<img src='images/github-new-repo-menu.png' width='100%' />

<!-- slide-column 80 -->

<img src='images/github-new-repo.jpg' width='90%' />



### Bob: add Alice as a collaborator

For this tutorial, both team members will need push access to the repository.
**Bob** should go to the repository's **collaborator settings**,
and add the GitHub username of **Alice** as a collaborator:

<img src='images/github-collaborators.png' width='100%' />

**Alice** must then **_accept the invitation sent by e-mail_** for the change to be effective.



### Bob: copy the remote SSH URL

**Bob** should copy the SSH URL of the GitHub repository:

<img src='images/github-ssh-url.png' width='100%' />

**WARNING:** be sure to select the **SSH** URL, not the **HTTPS** URL
(which might be selected by default).



### Bob: add the remote to your local repository

**Bob** should move into his local repository and add the GitHub repository as a
remote:

```bash
$> cd /path/to/projects/comem-archidep-git-branching

$> git remote add origin git@github.com:bob/github-demo.git
```

It's a convention to name the default remote **origin**.

You can check what remotes are available with `git remote`:

```bash
$> git remote -v
origin  git@github.com:bob/github-demo.git (fetch)
origin  git@github.com:bob/github-demo.git (push)
```

> The `-v` (**v**erbose) option makes the `git remote` command display more
> information. Without it, the URLs are not shown.



### Bob: push your commits to the shared repository

It's time for **Bob** to put the code in the shared GitHub repository.
This is done using the `git push` command:

```bash
$> git push -u origin main
Counting objects: 35, done.
Delta compression using up to 8 threads.
Compressing objects: 100% (33/33), done.
Writing objects: 100% (35/35), 4.16 KiB | 0 bytes/s, done.
Total 35 (delta 14), reused 11 (delta 2)
remote: Resolving deltas: 100% (14/14), done.
To github.com:bob/github-demo.git
 * [new branch]      main -> main
```

The command `git push <remote> <branch>` tells Git to push the commit pointed to
by `<branch>` to the remote named `<remote>`.

The `-u` option (or `--set-upstream`) tells Git to remember that you have linked this branch to that remote.



### Bob: remote branches

<!-- slide-column 60 -->

<git-memoir name='github' chapter='bob-push' svg-height='300px'></git-memoir>

<!-- slide-column 40 -->

The commit objects and file snapshots have been **pushed** (or uploaded) to the GitHub repository.

This includes not only the commit pointed to by main, but also the **entire history** of the repository up to that commit.

<!-- slide-container -->

Note the **origin/main** branch that has appeared in your local repository.
This is a **remote-tracking branch**.
It tells you where the **main** branch points to on the **origin** remote (the GitHub repository in this case).



### Alice: get the remote repository's SSH URL

**Alice** can now go to the repository's page on GitHub (under **Bob**'s account) and copy the SSH URL:

<img src='images/github-clone-url.png' width='100%' />

**WARNING:** again, be sure to select the **SSH** URL, not the **HTTPS** URL
(which might be selected by default).



### Alice: clone the shared repository

**Alice** can now get a copy of the shared GitHub repository on her machine.
This is done using the `git clone` command:

```bash
$> git clone git@github.com:bob/github-demo.git
Cloning into 'github-demo'...
remote: Counting objects: 35, done.
remote: Compressing objects: 100% (21/21), done.
remote: Total 35 (delta 14), reused 35 (delta 14), pack-reused 0
Receiving objects: 100% (35/35), 4.16 KiB | 0 bytes/s, done.
Resolving deltas: 100% (14/14), done.

$> cd github-demo
```

The `git clone [url]` command copies the **remote** repository to your machine.



### Alice: remote branches

<!-- slide-column 60 -->

<git-memoir name='github' chapter='alice-pull' svg-height='275px'></git-memoir>

<!-- slide-column 40 -->

The entire history of the project is **pulled** (or downloaded) from the GitHub
repository.

Git will also automatically switch to the **main** branch in the working
directory so you have something to work from.

Again, Git has created a **remote-tracking branch** in Alice's repository,
so that you can know what the current state of the remote is.



### Alice: make local changes

**Alice** thinks that the project's file names are too long. Let's fix that:

```bash
$> mv addition.js add.js
$> mv subtraction.js sub.js
$> git add .
$> git commit -m "Shorter file names"
```



### Alice: check the state of branches

<!-- slide-column 70 -->

<git-memoir name='github' chapter='alice-commit' svg-height='275px'></git-memoir>

<!-- slide-column -->

This is now the state of the shared repository and **Alice**'s local repository.

There is a new commit in **Alice**'s repository that is not in the shared GitHub repository.



### Alice: push to the shared repository

Push to update the shared repository:

```bash
$> git push origin main
```

<git-memoir name='github' chapter='alice-push' svg-height='275px'></git-memoir>



### Bob: check the state of branches

<!-- slide-column 60 -->

<git-memoir name='github' chapter='bob-look' controls='false' svg-height='275px'></git-memoir>

<!-- slide-column 40 -->

This is now the state from **Bob**'s perspective.

Notice that the new commit is in the shared repository (on GitHub)
but that the remote-tracking branch origin/main **is not up-to-date** in **Bob**'s repository.

<!-- slide-container -->

Git does not automatically synchronize repositories. **As far as Bob knows**
looking at information from his local repository, the main branch still points
to `4f94ba` in the shared repository.



### Bob: fetch changes from the shared repository

**Bob** should now get the changes from the shared repository:

```bash
$> git fetch origin
remote: Counting objects: 2, done.
remote: Compressing objects: 100% (1/1), done.
remote: Total 2 (delta 1), reused 2 (delta 1), pack-reused 0
Unpacking objects: 100% (2/2), done.
From github.com:bob/github-demo
   4f94ba..92fb8c  main     -> origin/main
```

<!-- slide-column 70 -->

<git-memoir name='github' chapter='bob-fetch' svg-height='250px'></git-memoir>

<!-- slide-column -->

The new commit is now here and the remote-tracking branch has been updated.

However, the local main branch **has not moved** and the working directory has **not been updated**.



### Bob: check the state of branches

Now you can use `git merge` like in the previous tutorial to bring the changes of origin/main into main:

```bash
$> git merge origin/main
Updating 4f94ga..92fb8c
Fast-forward
 addition.js => add.js | 0
 1 file changed, 0 insertions(+), 0 deletions(-)
 rename addition.js => add.js (100%)
```

<!-- slide-column 70 -->

<git-memoir name='github' chapter='bob-merge' svg-height='240px'></git-memoir>

<!-- slide-column -->

As expected, main has been fast-forwarded to the commit pointed to by origin/main and the working directory has been updated.

**Bob**'s repository is now up-to-date.



### Using git pull

You can also use `git pull [remote] [branch]` to save time.

The following command:

```bash
$> git pull origin main
```

Is equivalent to running the two commands we just used:

```bash
$> git fetch origin
$> git merge origin/main
```



## Managing conflicting commit histories

<!-- slide-front-matter class: center, middle -->



### Bob: fix the bug

**Bob** now notices that the last change breaks the calculator.
This is because the files were renamed, but the `<script>` tags in `index.html` were not updated.
Fix that bug, then commit and push the change:

```bash
(Make the fix...)
$> git add index.html
$> git commit -m "Fix bad <script> tags"
$> git push origin main
```

<git-memoir name='github' chapter='bob-fix' svg-height='250px'></git-memoir>



### Alice: make other changes

**Alice**, not having noticed the bug, proceeds to make 2 changes on `index.html`:

* Add an `<h2>` title before each computation.
* Put the two last `<script>` tags on one line.

```html
*<h2>Addition</h2>
<p id="addition">...</p>

*<h2>Subtraction</h2>
<p id="subtraction">...</p>

<script src="calculations.js"></script>
*<script src="addition.js"></script><script src="subtraction.js"></script>
```



### Alice: push the other changes

Commit and then push the changes:

```bash
$> git add index.html
$> git commit -m "Improve layout"
```

<git-memoir name='github' chapter='alice-fix' svg-height='250px'></git-memoir>

```bash
$> git push origin main
```



### Rejected pushes

```bash
To github.com:bob/github-demo.git
 ! [rejected]        main -> main (fetch first)
error: failed to push some refs to 'git@github.com:bob/github-demo.git'
hint: Updates were rejected because the remote contains work that you do
hint: not have locally. This is usually caused by another repository pushing
hint: to the same ref. You may want to first integrate the remote changes
hint: (e.g., 'git pull ...') before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.
```

<!-- slide-column 70 -->

<git-memoir name='github' chapter='alice-fix' controls='false' svg-height='250px'></git-memoir>

<!-- slide-column -->

The push was **rejected** by the remote repository. Why?

This is the state of **Alice**'s repository right now.

#### Alice: fetch the changes

Since Git tells Alice that the local copy of the remote repository is out of date, try fetching those changes:

```bash
$> git fetch origin
```

<git-memoir name='github' chapter='alice-fetch-changes' svg-height='325px'></git-memoir>

#### Alice: try to push again

```bash
$> git push origin main
To github.com:bob/github-demo.git
 ! [rejected]        main -> main (non-fast forward)
error: failed to push some refs to 'git@github.com:bob/github-demo.git'
hint: Updates were rejected because the tip of your current branch is behind
hint: its remote counterpart. Integrate the remote changes (e.g.
hint: 'git pull ...') before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.
```

<!-- slide-column 70 -->

<git-memoir name='github' chapter='alice-fetch-changes' controls='false' svg-height='315px'></git-memoir>

<!-- slide-column -->

The push was **rejected again**! **Why?**

This is the state of **Alice**'s repository right now.




### Divergent history

<!-- slide-column 70 -->

<git-memoir name='github' chapter='alice-fetch-changes' controls='false' svg-height='325px'></git-memoir>

<!-- slide-column -->

It's for the same reason as in the previous tutorial: **Bob** and **Alice**'s
work have diverged from a common ancestor (`92fb8c` in this example).

A remote repository will **only accept fast-forward pushes** by default.



### Alice: pull changes from the shared repository

**Alice** wants to fetch **and** merge the changes made by **Bob**.
Let's use the `git pull` command:

```bash
$> git pull origin main
remote: Counting objects: 3, done.
remote: Compressing objects: 100% (2/2), done.
remote: Total 3 (delta 1), reused 3 (delta 1), pack-reused 0
Unpacking objects: 100% (3/3), done.
From github.com:bob/github-demo
 * branch            main     -> FETCH_HEAD
   92fb8c..3ff531    main     -> origin/main
Auto-merging index.html
CONFLICT (content): Merge conflict in index.html
Automatic merge failed; fix conflicts and then commit the result.
```

The fetch succeeded, but the merge failed because of a **conflict** on
`index.html`.

> As we've seen before, a `pull` is equivalent to a `fetch` followed by a
> `merge`.



### Alice: check the conflict markers

**Alice** should take a look at `index.html`:

```txt
<<<<<<< HEAD
    <script src="addition.js"></script><script src="subtraction.js"></script>
=======
    <script src="add.js"></script>
    <script src="sub.js"></script>
>>>>>>> 3ff5311406e73c7d2cc1691f9535214c2543937f
```

Let's make sure we keep it on one line while still renaming the files, and
remove the conflict markers:

```txt
    <script src="add.js"></script><script src="sub.js"></script>
```

Mark the conflict as resolved and finish the merge:

```bash
$> git add index.html
$> git commit -m "Merge origin/main"
```



### Alice: check the state of branches

Now the state of **Alice**'s local repository is consistent with the state of
the shared repository: the commit pointed to by `main` is ahead of the commit
pointed to by `origin/main`.

<git-memoir name='github' chapter='alice-pull-changes' svg-height='325px'></git-memoir>



### Alice: push the changes

The push will be accepted now:

```bash
$> git push origin main
```

<git-memoir name='github' chapter='alice-push-merge' svg-height='335px'></git-memoir>



### Bob: pull the changes

**Bob** can now pull those latest changes to keep up-to-date:

```bash
$> git pull origin main
```

<git-memoir name='github' chapter='bob-pull-merge' svg-height='335px'></git-memoir>



## Resources

* [Git Branching - Remote Branches](https://git-scm.com/book/en/v2/Git-Branching-Remote-Branches)
* [Distributed Git](https://git-scm.com/book/en/v2/Distributed-Git-Distributed-Workflows)



[distributed-workflows]: https://git-scm.com/book/en/v2/Distributed-Git-Distributed-Workflows
[git]: https://git-scm.com
[git-tutorial]: ../git/
[github]: https://github.com
