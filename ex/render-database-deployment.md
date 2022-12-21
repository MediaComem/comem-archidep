# Deploy web applications with a database to Render

The goal of this exercice is to deploy the same [PHP Todolist][repo] application as in previous exercises, but this time on the Render Platform-as-a-service (PaaS) cloud instead of your own server in the Infrastructure-as-a-Service (IaaS) Microsoft Azure Web Services cloud. This illustrates the difference between the two cloud service models.


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
  - :classical_building: The architecture of what you deployed during the
    exercise.
- :boom: Troubleshooting tips: how to fix common problems you might encounter.

## :gem: Requirements

This guide assumes that you are familiar with [git][git-slides] and that you have a basic understanding of what a Platform-as-a-Service is.

**You will also need to [register a Render account][render-register]**.

> :warning: Although you *could* work on this exercise from your Azure server, we suggest follow the exercise on your local machine.

## :exclamation: Getting code updates from upstream

When you started working on the Todolist application, you forked an existing codebase from a GitHub repository. While you were working on your configuration, the team with access to the original repository implemented the changes necessary for a PaaS deployment in a branch called ``docker-postgres``.

By default, your fork should've stopped tracking changes from the original repo, which is also referred to as the **upstream**. Let's reconfigure our repository so that it can fetch data from there.

> :question: If you do not remember where the Todolist repository is stored on your local machine, you can simply clone it again from GitHub by running ``git clone https://github.com/username/comem-archidep-php-todo-exercise.git``. Don't forget to replace the placeholder with your GitHub handle.

From the terminal, travel to your repository and add the upstream repository as a remote:

```bash
$> cd comem-archidep-php-todo-exercise
$> git remote add upstream https://github.com/MediaComem/comem-archidep-php-todo-exercise.git
```

>:gem: Unlike the [automated deployment exercise][automated-deployment-ex], we will not be pushing to this remote (we couldn't anyway, as we are not collaborators on the upstream). We will instead use it to fetch up-to-date data.

Not let's fetch data from the upstream:

```bash
$> git fetch upstream
remote: Enumerating objects: 11, done.
remote: Counting objects: 100% (11/11), done.
remote: Compressing objects: 100% (6/6), done.
remote: Total 11 (delta 4), reused 11 (delta 4), pack-reused 0
Unpacking objects: 100% (11/11), 3.20 KiB | 545.00 KiB/s, done.
From https://github.com/MediaComem/comem-archidep-php-todo-exercise
 * [new branch]      docker-postgres -> upstream/docker-postgres
 * [new branch]      main            -> upstream/main
 * [new branch]      master          -> upstream/master
```
As you can see, this gives us access to upstream branches, including one called ``upstream/docker-postgres``. The next step is to create our own branch and copy the contents of the upstream.

```bash
$> git checkout -b docker-postgres upstream/docker-postgres
branch 'docker-postgres' set up to track 'upstream/docker-postgres'.
Switched to a new branch 'docker-postgres'
```

This command will create a new branch on **your** repository, based on the contents of the upstream branch. This command automatically switches you to the new branch. If you browse through the project in a code editor, you should now be able to see changes to ``todolist.sql``, as well as a mysterious new ``Dockerfile``.

> :books: Docker is a tool designed to make it easier to create, deploy, and run applications by using containers. Containers allow a developer to package up an application with all of the parts it needs, such as libraries and other dependencies, and ship it all out as one package. A Dockerfile is a text file that contains instructions for how to build a Docker image. Docker is beyond the scope of this course, but you can learn more [on the Docker website][docker].


Let's push this new branch to GitHub:
 ```bash
 $> git push origin
 ...
  * [new branch]      docker-postgres -> docker-postgres
 ```

 You can go check on GitHub if your new branch has been pushed, by displaying the branch dropdown:

 ![Check branch is on GitHub](../images/render-database-branch.png)

>:books: Let's note that this whole step has nothing to do with PaaS deployments in and of themselves. It is just a corollary of some code changes that had to be made for the Todolist to work with Postgres and the fact that we didn't want you to have to implement those changes manually.

## :exclamation: Create a Postgres Database on Render

Instead of manually configuring a Linux server, we will be provisioning a couple of services on Render. The first is a PostgreSQL Database.

Sign-in to your Render account, and click the **new PostgreSQL** button:
 ![Create Postgres](../images/render-database-postgres-create.png)

>:warning: You can only have 1 active PostgreSQL deployment in the free Render tier. If you want more, you gotta pay.

This will take you to the following configuration page, where you will need to setup the following:
- A name for your deployment
- A name for the database
- A username
- The region where the database is deployed (pick the one closest to your customers).

A password will be automatically generated for you.

 ![Configure Postgres](../images/render-database-postgres-configure.png)

When you are done, click **Create Database** and your PostgreSQL database will be provisioned automatically for you. Be patient, this process can take a few minutes.

At this point you will be taken to a page with information pertaining to your new database and you should see the following:
![Postgres Deployed](../images/render-database-postgres-created.png)

## :exclamation: Run the todolist.sql file
At this point, you have a database. Congratulations. But we still need to configure the tables. As we did in the first Todolist tutorial, we will be running a ``todolist.sql`` on the database.

> :books: The script is a bit different because of two factors: First, we are using PostgreSQL instead of MySQL. Second, we do not need to create a database. As a metter of fact, this script is simpler than the previous one.

Let's go back to our terminal. Make sure you are in your repository, and on the ``docker-postgres`` branch:

```bash
$> git branch --show-current
docker-postgres
```

If not, check out your the correct branch with the ``git checkout docker-postgres`` command.

Next, let's connect to out PostgreSQL database from the command line. On the Render dashboard, you should be able to see a **Connections** section. This is where all the connection information to your database lives. You will need this information more than once, so keep that tab open.

What we need right now is located in the **PSQL Command** field. You can display or copy the contents of this field by clicking the icons next to the left of the hidden characters.

![Postgres Connection Information](../images/render-database-postgres-connections.png)

Copy and paste the command in your terminal: this will connect you directly to the remote database deployed by Render.

```bash
$> PGPASSWORD=your_password psql -h your_host.frankfurt-postgres.render.com -U your_user your_database
psql (14.6 (Homebrew), server 15.1)
WARNING: psql major version 14, server major version 15.
         Some psql features might not work.
SSL connection (protocol: TLSv1.3, cipher: TLS_AES_128_GCM_SHA256, bits: 128, compression: off)
Type "help" for help.

your_database=>
```

You can now execute the ``todolist.sql`` file:

```bash
your_database=> \i todolist.sql

CREATE TABLE
```
Make sure the script worked by displaying all the ``todo`` table's columns:
```bash
your_database=> \d+ todo

   Column   |            Type             |             Default              | Storage  |
------------+-----------------------------+----------------------------------+----------
 id         | integer                     | nextval('todo_id_seq'::regclass) | plain    |
 title      | character varying(2048)     |                                  | extended |
 done       | boolean                     | false                            | plain    |
 created_at | timestamp without time zone | CURRENT_TIMESTAMP                | plain    |

```
Now quit the Postgres shell by entering ``\q`` .

## :exclamation: Create a Render Web Service with GitHub hooks

## :exclamation: Configure Environment Variables

## :checkered_flag: What have I done?


[automated-deployment-ex]: https://github.com/MediaComem/comem-archidep/blob/main/ex/git-automated-deployment.md
[docker]: https://www.docker.com/
[git-slides]: https://mediacomem.github.io/comem-archidep/2022-2023/subjects/git/?home=MediaComem%2Fcomem-archidep%23readme#1
[render-register]: https://dashboard.render.com/register
[repo]: https://github.com/MediaComem/comem-archidep-php-todo-exercise
