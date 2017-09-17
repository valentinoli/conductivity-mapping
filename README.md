# Jarðleiðniverkefnið - Ground Conductivity Project

Mapping of ground conductivity in Iceland

Valentin Oliver Loftsson

August 2017

### Guidelines for running app on local machine and making changes to the Heroku app

Install [Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction)

Install [Node.js and NPM](https://nodejs.org/en/download/)

Open command line and verify you have installed Node.js and NPM properly

```
% npm -v
% node -v
```

* Install packages from NPM defined in package.json

```
% npm install
```

------------------------------

Now you can turn on the web server.

Open the command line in the application's directory and run


```
% gulp run
```

or

```
% gulp
```

Browser-sync runs on a proxy server and watches files in the \dist directory and fires when it detects changes

Open another command line window and run

```
% gulp watch
```

to watch files in the \src directory (source-files)

### Guidelines for Heroku 

Install Heroku

Log in to Heroku with provided credentials

```
% heroku login
```

Clone existing heroku application

```
% heroku git:clone -a jardleidni
```

Now you should be all set up for pushing