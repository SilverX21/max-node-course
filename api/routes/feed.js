const express = require("express");
const feedController = require("../controllers/feed");
const { body } = require("express-validator");
const { body } = require("express-validator");
const router = express.Router();
const isAuth = require("../middleware/is-auth");

router.get("/posts", isAuth, feedController.getPosts);

router.post(
  "/post",
  isAuth,
  [
    body("title")
      .trim()
      .isLength({ min: 5 })
      .withMessage("The title must have more than 5 characters"),
    body("content")
      .trim()
      .isLength({ min: 5 })
      .withMessage("The content must have more than 5 characters"),
  ],
  feedController.createPost
);

router.get("/post/:postId", isAuth, feedController.getPost);

router.put(
  "/post/:postId",
  isAuth,
  [
    body("title")
      .trim()
      .isLength({ min: 5 })
      .withMessage("The title must have more than 5 characters"),
    body("content")
      .trim()
      .isLength({ min: 5 })
      .withMessage("The content must have more than 5 characters"),
  ],
  feedController.updatePost
);

router.delete("/post/:postId", isAuth, feedController.deletePost);

module.exports = router;
