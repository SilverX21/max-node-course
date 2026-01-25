const { expect } = require("chai");
const sinon = require("sinon");
const mongoose = require("mongoose");

const User = require("../models/user");
const AuthController = require("../controllers/auth");

//the done argument is needed to avoid Mocha's timeout on async tests
//we use the done() function to wait for async code blocks to complete
describe("Auth Controller", function (done) {
  //before will run once before all tests in this block
  before(function (done) {
    //here we connect to a test database so we don't mess with the production one
    mongoose
      .connect(
        "mongodb+srv://silver21guitar02_db_user:bFYgz2b2oXSm2X4r@silvercluster.4hbkqav.mongodb.net/test-messages?appName=SilverCluster",
      )
      .then((result) => {
        const user = new User({
          email: "test@test.com",
          password: "tester",
          name: "Test",
          posts: [],
          _id: "64a7f0c9f1d2c12f34567999",
        });

        return user.save();
      })
      .then(() => done());
  });

  //beforeEach will run before each test in this block
  //so, if we needed to reset some state before each test, we could do it here

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

  it("should send a response with a valid user status for an existing user", function (done) {
    const req = { userId: "64a7f0c9f1d2c12f34567999" };
    const res = {
      statusCode: 500,
      userStatus: null,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.userStatus = data.status;
      },
    };

    AuthController.getUserStatus(req, res, () => {}).then(() => {
      expect(res.statusCode).to.be.equal(200);
      expect(res.userStatus).to.be.equal("I am new!");
      done();
    });
  });

  //afterEach will run after each test in this block
  //so we could use it to restore some state after each test

  //after will run once after all tests in this block
  //here we do the cleanup by deleting the test user and disconnecting from the database
  after(function (done) {
    User.deleteMany({})
      .then(() => {
        mongoose.disconnect();
      })
      .then(() => {
        done();
      });
  });
});
