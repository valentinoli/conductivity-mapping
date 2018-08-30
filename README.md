# Ground Conductivity Project

Mapping of ground conductivity in Iceland <br>
Web application for field strength data representation and interaction

Valentin Oliver Loftsson <br>
August 2017

[Try it out!](https://jardleidni.herokuapp.com)

### Guidelines for running app on local machine and making changes to the Heroku app

Install [Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction)

Install [Node.js and NPM](https://nodejs.org/en/download/)

Open command line and verify you have installed everything

```
% heroku -v
% npm -v
% node -v
```

Log in to Heroku with provided credentials

```
% heroku login
```

Clone the existing heroku application

```
% heroku git:clone -a jardleidni
```

Open the command line in the application's directory

Install packages from NPM defined in package.json

```
% npm install
```

------------------------------

Now you can turn on the local web server and set up a development environment

Open the command line in the application's directory and run


```
% gulp
```

This concurrently runs the web server and browser-sync

Browser-sync watches files in the \dist directory and fires when it detects any changes

Open another command line window and run

```
% gulp watch
```

to watch files in the \src directory (source-files)

------------------------------

You need to make sure the remote git repository has been set before deploying your changes to Heroku

Run the following to check

```
git remote -v
```

If the remote has not been set then run

```
heroku git:remote -a jardleidni
```

Now you should be able to commit and push changes to the git repository by running

```
git add .
git commit -m "commit message"
git push heroku master
```