//the resolver is an exporter object that contains all the resolver functions for the GraphQL API.
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const { login } = require("../controllers/auth");
const jwt = require("jsonwebtoken");
const Post = require("../models/post");

module.exports = {
  createUser: async function ({ userInput }, req) {
    const errors = [];

    if (!validator.isEmail(userInput.email)) {
      errors.push({ message: "Email is invalid." });
    }
    if (
      validator.isEmpty(userInput.password) ||
      !validator.isLength(userInput.password, { min: 5 })
    ) {
      errors.push({ message: "Password too short!" });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid input.");
      error.data = errors;
      error.code = 422;

      throw error;
    }

    //the args parameter contains all the input data sent by the client in the mutation
    //in the schema we have a, parameter named userInput, so we need to access it
    const { email, password, name } = userInput;
    try {
      const existingUser = await User.findOne({ email: email });

      if (existingUser) {
        const error = new Error("User exists already.");
        error.statusCode = 422;
        throw error;
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({
        email: email,
        name: name,
        password: hashedPassword,
      });

      const createdUser = await user.save();

      //we need to return an object that matches the User type defined in the schema
      return { ...createdUser._doc, _id: createdUser._id.toString() };
    } catch (error) {}
  },
  login: async function ({ email, password }) {
    const user = await User.findOne({ email: email });

    if (!user) {
      const error = new Error("User not found.");
      error.code = 401;
      throw error;
    }

    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      const error = new Error("Password is incorrect.");
      error.code = 401;
      throw error;
    }

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    //this need to match the AuthData type defined in the schema
    return { token: token, userId: user._id.toString() };
  },
  createPost: async function ({ postInput }, req) {
    if (!req.isAuth) {
      const error = new Error("Not authenticated!");
      error.code = 401;
      throw error;
    }

    const errors = [];

    if (
      validator.isEmpty(postInput.title) ||
      !validator.isLength(postInput.title, { min: 5 })
    ) {
      errors.push({ message: "Title must have more than 5 characters!" });
    }

    if (
      validator.isEmpty(postInput.content) ||
      !validator.isLength(postInput.content, { min: 5 })
    ) {
      errors.push({ message: "Content must have more than 5 characters!" });
    }

    if (validator.isEmpty(postInput.imageUrl)) {
      errors.push({ message: "Image is required!" });
    }

    if (errors.length > 0) {
      const error = new Error("Invalid input.");
      error.data = errors;
      error.code = 422;

      throw error;
    }

    //authentication check
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("Invalid user.");
      error.code = 401;
      throw error;
    }

    const post = new Post({
      title: postInput.title,
      content: postInput.content,
      imageUrl: postInput.imageUrl,
      creator: user,
    });

    const createdPost = await post.save();
    user.posts.push(createdPost);

    //graphQL doesn't understand dates, so we need to convert them to string
    return {
      ...createdPost._doc,
      _id: createdPost._id.toString(),
      createdAt: createdPost.createdAt.toISOString(),
      updatedAt: createdPost.updatedAt.toISOString(),
    };
  },
};
