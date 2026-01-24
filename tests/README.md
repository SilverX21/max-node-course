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

Also, if we want to mock some methods and functions, we can use `sinon`, so let's also install it: `npm install --save-dev sinon`

## 2. How to create tests?

Let's start by having the tests grouped by theme/reason/class/etc.

Here we can group them using describe:

```javascript
describe("Auth Middleware", function () {
  //...
});
```

After the group is created, let's check how to create some tests:

```javascript
describe("Auth Middleware", function () {
  //it is a test case that has a brief description of the test and a function
  it("should yield a userId after decoding the token", function () {
    const req = {
      get: function (headerNAme) {
        return "Bearer sfibvwibfiwbefvbwieofbv";
      },
    };

    //here we pass the object/funtcion and then the name of the function we want to stub
    sinon.stub(jwt, "verify");
    //then we can define what we want the stub to return when called
    jwt.verify.returns({ userId: "abc" });

    //here we are testing a valid token, so we need to mock the jwt verify function
    authMiddleware(req, {}, () => {});
    expect(req).to.have.property("userId"); //given we expect a userId property
    expect(req).to.have.property("userId", "abc"); //given we expect the userId to be abc

    //here we can check if the function was called like this
    expect(jwt.verify.called).to.be.true;

    //here we restore the original function so other tests are not affected
    jwt.verify.restore();
  });
});
```
