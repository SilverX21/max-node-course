const express = require("express");
const authController = require("../controllers/auth");
const User = require("../models/user");
const { body, check } = require("express-validator");
const router = express.Router();

router.put(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              "E-mail exists already, please pick a different one"
            );
          }
        });
      })
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Password must have at least 5 characters"),
    body("name")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please enter a valid name"),
  ],
  authController.signUp
);

router.post("/login", authController.login);

module.exports = router;
