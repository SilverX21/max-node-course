const { expect } = require("chai");
const sinon = require("sinon");
const mongoose = require("mongoose");

const User = require("../models/user");
const Post = require("../models/post");
const FeedController = require("../controllers/feed");

describe("Feed Controller", function (done) {
  before(function (done) {
    mongoose
      .connect(process.env.MONGO_DB_TESTS_DB)
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

  it("should add a created post to the posts of the creator", function (done) {
    const req = {
      body: {
        title: "Test post",
        content: "Test post",
      },
      file: {
        path: "images/test.png",
      },
      userId: "64a7f0c9f1d2c12f34567999",
    };

    const res = {
      status: function () {
        return this;
      },
      json: function () {},
    };

    FeedController.createPost(req, res, () => {}).then((savedUser) => {
      expect(savedUser).to.have.property("posts");
      expect(savedUser.posts).to.have.length(1);
      done();
    });
  });

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
