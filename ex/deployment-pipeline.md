# Set up an automated deployment pipeline with GitHub, Travis CI and Heroku

The goal of this exercice is to set up a continuous testing and deployment pipeline for the One Chat Room application.
The end result should be that:

* You push new code to GitHub.
* GitHub notifies Travis CI to run automated tests.
* If the tests pass, Travis CI triggers a deployment on Heroku.

Except for the push to GitHub, all remaining steps should be automated.

<!-- START doctoc -->
<!-- END doctoc -->



## Clone the One Chat Room application locally

Make sure you have forked the [One Chat Room repository][one-chat-room-repo]
to your own account by clicking the **Fork** button at the top:

![Fork](../images/fork.png)

> You can click it again if you are not sure.
> GitHub will tell you if you have already forked it.

Clone your forked repository **to your local machine**
(replacing `JohnDoe` by your GitHub username):

```bash
$> cd /path/to/projects
$> git clone git@github.com:JohnDoe/one-chat-room.git
```

Go into the repository:

```bash
$> cd one-chat-room
```



## Link your application to Heroku

Make sure your local repository is linked to the Heroku application that was prepared for you.
If you list your Git remotes, you should have at least a `heroku` and an `origin` remote:

```bash
$> git remote -v
heroku  https://git.heroku.com/ad-john-doe-chat.git (fetch)
heroku  https://git.heroku.com/ad-john-doe-chat.git (push)
origin  git@github.com:JohnDoe/one-chat-room.git (fetch)
origin  git@github.com:JohnDoe/one-chat-room.git (push)
```

> You may also have an `archidep` remote if you did the One Chat Room deployment exercice.

If you do not have the `heroku` remote,
run this command to configure it (replacing `john-doe` with your username):

```bash
$> heroku git:remote -a ad-john-doe-chat
```

Make sure you have the mLab addon enabled:

```bash
$> heroku addons

Add-on                                Plan     Price  State
────────────────────────────────────  ───────  ─────  ───────
mongolab (mongolab-random-12345)      sandbox  free   created
```

If it's not listed, run this command to add it:

```bash
$> heroku addons:create mongolab:sandbox
```



## Run the application on your local machine

Install [Node.js][node] 10.x on your machine if you do not have it already.

Run this command to retrieve your MongoDB connection URL from Heroku and export it into a `$MONGODB_URI` environment variable:

```bash
$> export MONGODB_URI="$(heroku config:get MONGODB_URI)"
```

Make sure the variable is set with this command:

```bash
$> echo $MONGODB_URI
mongodb://heroku_12345:changeme@23456.mlab.com:61134/heroku_34567
```

> **Warning:** the variable is only set in this terminal.
> If you open a new terminal, you will have to run the `export` command again.

Run this command to launch the application:

```bash
$> npm run dev
```

**Keep this terminal running** and open a new one for the next steps.

> Because the `$MONGODB_URI` environment variable is set and the One Chat Room application [reads that variable into its configuration][one-chat-room-db-url],
> you should now have the application running locally, but using the MongoDB database provisioned by Heroku's mLab addon.



## Implement an API test for the One Chat Room application

Following the [automated testing instructions for JavaScript][automated-testing-js],
write an API test for the One Chat Room application.

You will need to:

* Install Mocha, Chai and SuperTest.
* Define a `mocha` script in your `package.json` file.
* Create a `tests` directory in the application's directory.
* Write an API test in a file named `tests/api.test.js`:

  > The One Chat Room API accepts POST requests on `/api/messages`.
  > It expects a JSON object with the required properties `author` and `content`.
  >
  > A successful response should have status HTTP 201 Created and contain,
  > in addition to the `author` and `content` properties,
  > the additional properties `id`, `createdAt` and `updatedAt`.

  * *Hint:* you can make a POST request with SuperTest like this:

    ```js
    const requestBody = { author: 'SuperTest', contents: 'Hello API' };
    const response = await supertest('http://localhost:3000').post('/api/messages').send(requestBody);
    ```
  * *Hint:* you can check the response status like this:

    ```js
    expect(response.status).to.equal(201);
    ```
  * *Hint:* you can check properties of the response body like this:

    ```js
    expect(response.body.author).to.equal('SuperTest');
    expect(response.body.id).to.be.a('string');
    ```

  > Here's a [fully functional test][one-chat-room-api-test] if you're lazy.

Run `npm run mocha` to make sure your test works.

Commit your changes:

```bash
$> git add .
$> git commit -m "Implement API test"
```



## Run automated tests with Travis CI

### Enable your repository on Travis CI

Log in to [Travis CI][travis-ci] with your GitHub account
and authorize the requested permissions if asked.

Go to [your repositories][travis-ci-repos] and enable automated builds for your One Chat Room repository.

> Press the "Sync account" button if you do not see the repository in the list.

Travis CI should have added a webhook to your GitHub repository.
Make sure it is configured in your GitHub repository's settings:

![Travis CI GitHub Webhook](../images/travis-webhook.png)

> This means that when you push to the repository,
> GitHub will notify Travis CI that new commits are available,
> and Travis CI will trigger an automated build.

### Add a `test` script to your `package.json` file

Travis CI expects your tests to execute when it runs the standard `npm test` command.

Modify your `package.json` so that you have a `test` script which executes your Mocha tests
(**you only need to add the `test` script, you should already have the rest**):

```json
{
  ...
  "scripts": {
    "dev": "cross-env DEBUG=one-chat-room:* nodemon ./bin/www",
    "mocha": "mocha tests/**/*.test.js",
    "start": "node ./bin/www",
    "test": "npm run mocha"
  },
  ...
}
```

Commit this change:

```bash
$> git add package.json
$> git commit -m "Add test script to package.json"
```

### Add a `.travis.yml` file

The `.travis.yml` file at the root of your repository tells Travis CI how to build and test your project.
The [Building a JavaScript and Node.js Project guide][travis-ci-node] tells you what a basic file for a Node.js project should look like.

Ccreate a `.travis.yml` file at the root of your repository with the following contents,
indicating the correct language and version to Travis CI:

```yml
language: node_js
node_js:
  - "10"
```

The application needs a MongoDB database to work.
You don't want your tests to modify the mLab production database.
Thankfully, Travis CI can [run a MongoDB database for you][travis-ci-mongodb] if you add the following lines to the `.travis.yml` file:

```yml
services:
  - mongodb
```

For your API test to work, you also need to run the application before the tests are executed.
If you read the [Job Lifecycle documentation][travis-ci-job-lifecycle],
you will see that you can run a list of commands by adding a `before_script` key to your `.travis.yml` file:

```yml
before_script:
  - npm start &   # Run the application
  - sleep 5       # Give it time to start
```

### Commit and push your changes

Commit the new `.travis.yml` file and push it to GitHub:

```bash
$> git add .travis.yml
$> git commit -m "Add Travis CI configuration"
$> git push origin master
```

GitHub should trigger the webhook and notify Travis CI.
If you go to the main [Travis CI page][travis-ci],
you should see an automated build appear for your repository.

> If you do not see your build appear,
> go to https://travis-ci.org/JohnDoe/one-chat-room
> (replacing `JohnDoe` with your GitHub username).

As soon as a Travis CI virtual machine is available,
your automated build should execute.
It should:

* Run a MongoDB database.
* Install your dependencies with `npm ci`.
* Execute any additional commands you have defined in `before_script`.
* Run your tests with `npm test`.

The build should complete successfully.

> You now have the first automated step working:
> automated tests are run on Travis CI on every push to GitHub.



## Set up an automated Heroku deployment

Travis CI has an article explaining how to [deploy on Heroku][travis-ci-heroku] after a build.

### Configure Travis CI to deploy on Heroku

You basically need to add this section to your `.travis.yml` file
(replacing `john-doe` with your username):

```yml
deploy:
  provider: heroku
  app: ad-john-doe-chat
  api_key:
    secure: "YOUR ENCRYPTED API KEY"
```

This will not work as is, because it is missing the encrypted key.
Travis has a command line tool that can add it for you.

Make sure you have [Ruby][ruby] installed:

```bash
$> ruby --version
ruby 2.3.3p222 ...
```

> You must have at least Ruby 1.9.3 (2.0.0 recommended).

Install the Travis CI command line tool with this command:

```bash
$> gem install travis --no-rdoc --no-ri
```

Make sure it was installed correctly:

```bash
$> travis --version
1.8.9
```

The `heroku auth:token` command generates an authentication token that can be used by other tools to trigger deployments:

```bash
$> heroku auth:token
 ›   Warning: token will expire 01/01/2020
 ›   Use heroku authorizations:create to generate a long-term token
5cd5c29e-3f06-438b-bc51-4aac30dec5e1
```

The Travis CI command line tool can encrypt this token and add it to your `.travis.yml` file for you:

```bash
$> travis encrypt 5cd5c29e-3f06-438b-bc51-4aac30dec5e1 --add deploy.api_key
```

> *Hint:* you can do both of the previous commands in one step by running this command instead:
>
>     $> travis encrypt $(heroku auth:token) --add deploy.api_key

### Test the automated deployment

Commit and push your changes to the `.travis.yml` file:

```bash
$> git add .travis.yml
$> git commit -m "Configure Travis to deploy on Heroku"
$> git push origin master
```

Go back to [Travis CI][travis-ci] and you should see a new automated build has been launched.

> Click on "Build History" if you do not see your new build right away.

Look at the build log.
At the end, Travis CI should perform the deployment on Heroku.

> You now have a fully functional deployment pipeline!
> As commits are pushed to GitHub,
> an automated build is run on Travis CI,
> which then deploys to Heroku if the tests pass successfully.



## Test the deployment pipeline

Make a visible change to the application.
For example, change the title in the `views/components/app.pug` file.

Commit and push your change, and make sure that your deployment pipeline is working correctly.
After the automated Travis CI build and the automated Heroku deployment,
you should see the change reflected on https://ad-john-doe.herokuapp.com
(replacing `john-doe` with your username).



## Run end-to-end tests on Travis

Following the [automated testing instructions for end-to-end tests][automated-testing-e2e],
write an end-to-end test for the One Chat Room application.

### Implement an end-to-end test for the One Chat Room application

You will need to:

* Install Selenium WebDriver and the driver for your favorite browser.
* Write an end-to-end test in a file named `tests/e2e.test.js`:

  Your test should fill the Author and Message fields,
  click the submit button, and ensure your message is successfully displayed in the list.

  * *Hint:* you might need to add `name` attributes to the two input fields
    in `views/components/app.pug` to more easily select them by name with Selenium WebDriver.
  * *Hint:* you can select the submit button like this:

    ```js
    const submitButton = await driver.findElement(By.css('form button[type="submit"]'));
    ```
  * *Hint:* you can select the title of the first message in the list like this:

    ```js
    const firstMessageTitle = await driver.findElement(By.css('.list-group .list-group-item:first-child h5'));
    ```

  > Here's a [fully functional test][one-chat-room-e2e-test] if you're lazy.
  > It assumes that the two input fields are named `author` and `contents`.

Run `npm run mocha` to make sure your new test works.

Commit your changes:

```bash
$> git add .
$> git commit -m "Implement end-to-end test"
```

### Configure Travis CI to run your end-to-end test

Travis CI needs additional configuration to run Selenium tests in a browser.

First, you will need to [have Travis CI install Chrome for you][travis-ci-chrome].
You will also need to install the Chrome driver required by [Selenium WebDriver][selenium-webdriver].
You can tell Travis CI to install both of those by adding this section to your `.travis.yml` file:

```yml
addons:
  chrome: stable
  apt:
    packages:
      - chromium-chromedriver
```

You also need to put the Chrome driver in the `PATH`, which is not the case by default.
Add this last line to your `before_script` commands
(**you already have the first few lines**):

```yml
before_script:
  - npm start &
  - sleep 5
  - sudo ln -s /usr/lib/chromium-browser/chromedriver /usr/local/bin/chromedriver
```

> `/usr/local/bin` is a standard directory that is usually already in the `PATH` in all Unix-like systems.

Another problem is that automated builds on Travis CI run on a headless server.
In other words, it has no graphical user interface, so it cannot run Chrome out of the box.

The simplest solution is to use [X virtual framebuffer (Xvfb)][xvfb].
It's basically a virtual screen that exists only in memory and is never displayed on an actual physical screen.
It will provide the GUI Chrome needs to run.

Add the `xvfb` service to your `.travis.yml` file
(**you already have the `mongodb` service**):

```yml
services:
  - mongodb
  - xvfb
```

Finally, you need to tell Travis CI to run your tests in the context of an X virtual framebuffer.
Travis CI provides a wrapper script, `xvfb-run`, to easily do that.

Tell travis to change your test command by adding a `script` property to your `.travis.yml` file,
and run `npm test` with the wrapper script:

```yml
script: xvfb-run npm test
```

### Trigger the deployment pipeline to run the test

Commit and push your changes:

```bash
$> git add .travis.yml
$> git commit -m "Configure Travis CI to run end-to-end tests with Chrome"
```

Go to [Travis CI][travis-ci] and make sure your latest build passes.



[automated-testing-e2e]: https://mediacomem.github.io/comem-webdev-docs/2018-2019/subjects/automated-testing/?home=MediaComem%2Fcomem-archidep%23readme#50
[automated-testing-js]: https://mediacomem.github.io/comem-webdev-docs/2018-2019/subjects/automated-testing/?home=MediaComem%2Fcomem-archidep%23readme#23
[node]: https://nodejs.org
[one-chat-room-api-test]: https://gist.github.com/AlphaHydrae/8d6e76355d865594bd6672e7291e13e4
[one-chat-room-e2e-test]: https://gist.github.com/AlphaHydrae/4c79ecb391f9b81b7221e3de2d53d824
[one-chat-room-db-url]: https://github.com/MediaComem/one-chat-room/blob/158d7ff1aaaf9bd760e395405c3e743e59f505e0/config.js#L4
[one-chat-room-repo]: https://github.com/MediaComem/one-chat-room
[ruby]: https://www.ruby-lang.org
[selenium-webdriver]: https://www.npmjs.com/package/selenium-webdriver
[travis-ci]: https://travis-ci.org
[travis-ci-chrome]: https://docs.travis-ci.com/user/chrome
[travis-ci-heroku]: https://docs.travis-ci.com/user/deployment/heroku/
[travis-ci-job-lifecycle]: https://docs.travis-ci.com/user/job-lifecycle/
[travis-ci-mongob]: https://docs.travis-ci.com/user/database-setup/#mongodb
[travis-ci-node]: https://docs.travis-ci.com/user/languages/javascript-with-nodejs/
[travis-ci-repos]: https://travis-ci.org/account/repositories
[travis-ci-xvfb]: https://docs.travis-ci.com/user/gui-and-headless-browsers/#using-xvfb-to-run-tests-that-require-a-gui
[xvfb]: https://en.wikipedia.org/wiki/Xvfb
