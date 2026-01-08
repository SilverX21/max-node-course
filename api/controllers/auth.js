const User = require("../../api/models/user");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.signUp = async (req, res, next) => {
  // #swagger.tags = ['Users']
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const { email, password, name } = req.body;

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      if (!hashedPassword) {
        res
          .status(400)
          .json({ message: "There was a problem creating new user" });
      }

      const user = new User({
        email: email,
        password: hashedPassword,
        name: name,
      });

      return user.save();
    })
    .then((result) => {
      res.status(200).json({ message: "User created!", userId: result._id });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }

      next(err);
    });
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  let loadedUser;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error = new Error("User with this email could not be found");
        error.statusCode = 401;
        throw error;
      }

      loadedUser = user;
      console.log("Got the user:".green, user);
      console.log("user password:".green, user.password);
      console.log("password:".green, password);
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Wrong password");
        error.statusCode = 401;
        throw error;
      }

      //here we generate a JWT Token
      //in the object we cann add the data we want (don't store passwords), for example: eail, userId, name, etc
      //the second parameter is a secret we will use for generate the token (must be a secret)
      //then the third is an object that we can pass the duration of the token, in this case we will put 1 hour
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString(),
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({ token: token, userId: loadedUser._id.toString() });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }

      next(err);
    });
};
