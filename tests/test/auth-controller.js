const { expect } = require("chai");
const sinon = require("sinon");

const User = require("../models/user");
const AuthController = require("../controllers/auth");

//the done argument is needed to avoid Mocha's timeout on async tests
//we use the done() function to wait for async code blocks to complete
describe("Auth Controller - Login", function (done) {
  it("should throw an error with code 500 if accessing the database fails", function () {
    sinon.stub(User, "findOne");
    User.findOne.throws();

    const req = {
      body: {
        email: "test@test.com",
        password: "tester",
      },
    };

    AuthController.login(req, {}, () => {}).then((result) => {
      expect(result).to.be.an("error");
      expect(result).to.have.property("statusCode", 500);
      done(); //here we signal mocha to wait for the async test to finish
    });

    User.findOne.restore();
  });
});
