const { expect } = require("chai");
const authMiddleware = require("../middleware/is-auth");
const jwt = require("jsonwebtoken");
const sinon = require("sinon");

// describe is a way to group related tests together
describe("Auth Middleware", function () {
  //here we are going to do a unit test for our auth middleware
  it("should throw an error if no authorization header is present", function () {
    const req = {
      get: function (headerNAme) {
        return null;
      },
    };

    //here we just want to bind the req object to the middleware and see if it throws an error
    //we are simulating calling the middleware with our req object, an empty res object, and an empty next function
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw(
      "Not authenticated.",
    );
  });

  it("should throw an error if the authorization header is only one string", function () {
    const req = {
      get: function (headerNAme) {
        return "xyz";
      },
    };

    //here we just want to bind the req object to the middleware and see if it throws an error
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });

  it("should throw an error if the token cannot be verified", function () {
    const req = {
      get: function (headerNAme) {
        return "Bearer xyz";
      },
    };

    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });

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
