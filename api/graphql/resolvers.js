//the resolver is an exporter object that contains all the resolver functions for the GraphQL API.
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const { login } = require("../controllers/auth");
const jwt = require("jsonwebtoken");
const Post = require("../models/post");
const { deletePost } = require("../controllers/feed");
const clearImage = require("../util/file");

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
    await user.save();
    //graphQL doesn't understand dates, so we need to convert them to string
    return {
      ...createdPost._doc,
      _id: createdPost._id.toString(),
      createdAt: createdPost.createdAt.toISOString(),
      updatedAt: createdPost.updatedAt.toISOString(),
    };
  },
  posts: async function ({ page, perPage }, req) {
    if (!req.isAuth) {
      const error = new Error("Not authenticated!");
      error.code = 401;
      throw error;
    }

    if (!page) {
      page = 1;
    }

    if (!perPage) {
      perPage = 2;
    }

    const totalPosts = await Post.find().countDocuments();
    const posts = await Post.find()
      .populate("creator")
      .skip((page - 1) * perPage) //here we do the pagination
      .limit(perPage)
      .sort({ createdAt: -1 }); //sort by createdAt descending

    return {
      posts: posts.map((p) => {
        return {
          ...p._doc,
          _id: p._id.toString(),
          createdAt: p.createdAt.toISOString(),
          updatedAt: p.updatedAt.toISOString(),
        };
      }),
      totalPosts: totalPosts,
    };
  },
  post: async function ({ id }, req) {
    if (!req.isAuth) {
      const error = new Error("Not authenticated!");
      error.code = 401;
      throw error;
    }

    const post = await Post.findById(id).populate("creator");

    if (!post) {
      const error = new Error("No post found!");
      error.code = 404;
      throw error;
    }

    return {
      ...post._doc,
      _id: post._id.toString(),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };
  },
  updatePost: async function ({ id, postInput }, req) {
    if (!req.isAuth) {
      const error = new Error("Not authenticated!");
      error.code = 401;
      throw error;
    }

    const post = await Post.findById(id).populate("creator");

    if (!post) {
      const error = new Error("No post found!");
      error.code = 404;
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

    if (post.creator._id.toString() !== req.userId.toString()) {
      const error = new Error("Not authorized to update this post!");
      error.code = 403;
      throw error;
    }

    post.title = postInput.title;
    post.content = postInput.content;
    if (postInput.imageUrl !== "undefined") {
      post.imageUrl = postInput.imageUrl;
    }

    const updatePost = await post.save();

    if (!updatePost) {
      const error = new Error("Error updating post!");
      error.code = 500;
      throw error;
    }

    return {
      ...updatePost._doc,
      _id: updatePost._id.toString(),
      createdAt: updatePost.createdAt.toISOString(),
      updatedAt: updatePost.updatedAt.toISOString(),
    };
  },
  deletePost: async function ({ id }, req) {
    if (!req.isAuth) {
      const error = new Error("Not authenticated!");
      error.code = 401;
      throw error;
    }

    const post = await Post.findById(id);

    if (!post) {
      const error = new Error("No post found!");
      error.code = 404;
      throw error;
    }

    //here we check if the user deleting the post is the creator of the post
    //post.creator is a ObjectId, so we need to convert it to string to compare
    if (post.creator.toString() !== req.userId.toString()) {
      const error = new Error("Not authorized to delete this post!");
      error.code = 403;
      throw error;
    }

    clearImage(post.imageUrl); //delete the image associated with the post

    await Post.findByIdAndDelete(id);

    if (!deletePost) {
      const error = new Error("Error deleting post!");
      error.code = 500;
      throw error;
    }

    //also need to remove the post from the user's posts array
    const user = await User.findById(req.userId);
    user.posts.pull(id);
    await user.save();

    return true;
  },
  user: async function (args, req) {
    if (!req.isAuth) {
      const error = new Error("Not authenticated!");
      error.code = 401;
      throw error;
    }

    const user = await User.findById(req.userId);

    if (!user) {
      const error = new Error("No user found!");
      error.code = 404;
      throw error;
    }

    return { ...user._doc, _id: user._id.toString() };
  },
  updateStatus: async function ({ status }, req) {
    if (!req.isAuth) {
      const error = new Error("Not authenticated!");
      error.code = 401;
      throw error;
    }

    const user = await User.findById(req.userId);

    if (!user) {
      const error = new Error("No user found!");
      error.code = 404;
      throw error;
    }

    user.status = status;
    await user.save();

    return { ...user._doc, _id: user._id.toString() };
  },
};
