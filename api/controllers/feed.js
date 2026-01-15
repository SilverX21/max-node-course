const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");
const Post = require("../models/post");
const User = require("../models/user");

//to make a function async, we just need to add it before the parameters declaration
exports.getPosts = async (req, res, next) => {
  // #swagger.tags = ['Feed']
  const currentPage = req.query.page || 1;
  const perPage = req.query.perPage || 2;

  //to catch errors, we can use try... catch
  //with this, if we have an exception inside the try bloack, the error will be caught inside the catch block
  try {
    //here we just prepend the methods call like this with await, we will receive the result and not the promise
    const totalItems = await Post.find().countDocuments();
    const posts = await Post.find()
      .populate("creator")
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    if (posts.length == 0) {
      const error = new Error("No posts found");
      error.statusCode = 404;
      throw error;
    }

    console.log(`Got ${totalItems} posts`.green);

    res.status(200).json({
      message: "fetched all posts",
      posts: posts,
      totalItems: totalItems,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
      next(error);
    }
  }
};

exports.createPost = async (req, res, next) => {
  // #swagger.tags = ['Feed']
  const { title, content } = req.body;
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed, entered data is incorrect");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    if (!req.file) {
      const error = new Error("No image provided");
      error.statusCode = 422;
      throw error;
    }

    // this path is given by multer
    const imageUrl = req.file.path;
    const userId = req.userId;

    const post = new Post({
      title: title,
      content: content,
      imageUrl: imageUrl,
      creator: userId,
    });

    let creator;

    const postResult = await post.save();
    if (!postResult) {
      const error = new Error("It wasn't possible to create the post");
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findById(userId);
    creator = user;
    user.posts.push(post._id);
    const userResult = await user.save();

    if (!userResult) {
      const error = new Error(
        "There was an error while trying to add the created post to the current user posts"
      );
      error.statusCode = 400;
      throw error;
    }

    res.status(201).json({
      message: "Post created successfully",
      post: post,
      creator: {
        _id: creator._id,
        name: creator.name,
      },
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

exports.getPost = async (req, res, next) => {
  // #swagger.tags = ['Feed']
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      const error = new Error("Couldn't find the requested psot");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ message: "Fetched post", post: post });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

exports.updatePost = async (req, res, next) => {
  // #swagger.tags = ['Feed']
  const postId = req.params.postId;
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed, entered data is incorrect");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const { title, content } = req.body;
    let imageUrl = req.body.image;

    if (req.file) imageUrl = req.file.path;

    if (!req.file) {
      const error = new Error("No file picked");
      error.statusCode = 422;
      throw error;
    }

    const post = await Post.findById(postId);

    if (!post) {
      const error = new Error("Couldn't find the requested post");
      error.statusCode = 404;
      throw error;
    }

    if (post.creator.toString() !== req.userId) {
      const error = new Error("Not authorized");
      error.statusCode = 403;
      throw error;
    }

    //first we delete the image in the directory, then we proceed to the update
    if (imageUrl !== post.imageUrl) {
      clearImage(post.imageUrl);
    }

    post.title = title;
    post.imageUrl = imageUrl;
    post.content = content;

    const postResult = await post.save();

    if (!postResult) {
      const error = new Error("It wasn't possible to save the requested post");
      error.statusCode = 403;
      throw error;
    }

    return res.status(200).json({ message: "Post updated", post: postResult });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  // #swagger.tags = ['Feed']
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      console.log("didn't found the post: ", post);
      const error = new Error("Post not found");
      error.statusCode = 404;
      throw error;
    }
    console.log("Current user is: ", req.userId);

    if (post.creator.toString() !== req.userId) {
      console.log("Not the current user: ", post.creator.toString());
      const error = new Error("Not authorized");
      error.statusCode = 403;
      throw error;
    }

    clearImage(post.imageUrl);

    const postResult = await Post.findByIdAndDelete(postId);

    if (!postResult) {
      const error = new Error("It wasn't possible to delete the post");
      error.statusCode = 403;
      throw error;
    }

    const user = await User.findById(req.userId);

    if (!user) {
      const error = new Error("It wasn't possible to find the current user");
      error.statusCode = 400;
      throw error;
    }

    user.posts.pull(postId);
    const userResult = await user.save();

    if (!userResult) {
      const error = new Error(
        "There was an error while trying to delete the user post"
      );
      error.statusCode = 500;
      throw error;
    }

    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

const clearImage = async (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
