# Jarðleiðniverkefnið

Kortlagning á jarðleiðni Íslands - Mapping of ground conductivity in Iceland

Valentin Oliver Loftsson

ágúst 2017

### Guidelines for running app on local machine

* Clone the GitHub Repository

* Install [Node.js and NPM](https://nodejs.org/en/download/)

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
