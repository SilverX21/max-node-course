# Testing

This section is going to take care of testing a Node.js application using some packages.

## 1. Setting up test environment

Let's start by installing `mocha`and `chai`: `npm install --save-dev mocha chai`

Then, after the packages are installed, let's go to `package.json` and inside the scripts section, let's add a `test` script like this:
```javascript
"scripts": {
    "test": "mocha",
    "start": "nodemon app.js"
  }
```

Here it will use mocha to run all the tests we have inside our project!
Mocha will look for a folder called `test`
