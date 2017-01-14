Alexa, who are my Congressmen?
========================================
An Alexa skill for finding information on your members of Congress. 

[![CircleCI](https://circleci.com/gh/chrisdevwords/alexa-who-are-my-congressmen/tree/master.svg?style=shield&nocache=1)](https://circleci.com/gh/chrisdevwords/alexa-who-are-my-congressmen/tree/master)
[![Coverage Status](https://coveralls.io/repos/github/chrisdevwords/alexa-who-are-my-congressmen/badge.svg?branch=master&nocache=1)](https://coveralls.io/github/chrisdevwords/alexa-who-are-my-congressmen?branch=master)
[![Dependency Status](https://david-dm.org/chrisdevwords/alexa-who-are-my-congressmen.svg)](https://david-dm.org/chrisdevwords/alexa-who-are-my-congressmen)
[![Dev Dependency Status](https://david-dm.org/chrisdevwords/alexa-who-are-my-congressmen/dev-status.svg)](https://david-dm.org/chrisdevwords/alexa-who-are-my-congressmen?type=dev)
[![Known Vulnerabilities](https://snyk.io/test/github/chrisdevwords/alexa-who-are-my-congressmen/badge.svg)](https://snyk.io/test/github/chrisdevwords/alexa-who-are-my-congressmen)


Requirements
------------
* Requires Node v4.3.2 
* Package engine is set to strict to match [AWS Lambda Environment](https://aws.amazon.com/blogs/compute/node-js-4-3-2-runtime-now-available-on-lambda/)
* I recommend using [NVM](https://github.com/creationix/nvm)

## Running Tests
This project includes [Mocha](https://mochajs.org/) and [Chai](http://chaijs.com/) for testing service data parsing. If you add to this, write more tests. And run them:
````
$ npm test
````

### Running Locally
As far as I know, you can't connect to an Alexa Device locally, but there is a way to [run a development server with a test harness](https://www.bignerdranch.com/blog/developing-alexa-skills-locally-with-nodejs-implementing-an-intent-with-alexa-app-and-alexa-app-server/) using [Alexa App Server](https://github.com/matt-kruse/alexa-app-server).

Open another terminal window and cd into the parent directory where you can clone the test harness:
````
$ cd ../
$ git clone https://github.com/matt-kruse/alexa-app-server
$ cd alexa-app-server && npm i 
````

Then, in this directory's terminal, create a sim link in the alexa-app-server test harness to this project:
````
$ ln -s "$(pwd)" "../alexa-app-server/examples/apps/${PWD##*/}"
````

Then run a watch to transpile the alexa app source code from ES6 to ES5
```
$ npm run local
```
Return to the terminal/directory in which you installed alexa-app-server and run the following:
```
cd examples && node server

```

Then visit the test harness at http://localhost:8000/alexa-who-are-my-congressmen


###Compiling For Upload
Make sure the bin directory has executable permissions:
````
$ chmod +x ./bin/build.sh
````
If this throws an error, trying using sudo:
```
$ sudo chmod +x .bin/build.sh
```

Transpile the ES6 and zip up the relevant files for upload by running:
````
$ npm run build
````
This should output files.zip to the project root for upload to the AWS Lambda Console.


### Contributing
All code is transpiled from ES6 with Babel. The lint config is based on [AirBnB's eslint](https://www.npmjs.com/package/eslint-config-airbnb).
To lint the code run:
```
$ npm run lint
```
