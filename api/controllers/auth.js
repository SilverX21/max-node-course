const User = require("../../api/models/user");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.signUp = async (req, res, next) => {
  // #swagger.tags = ['Users']
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const { email, password, name } = req.body;

    var hashedPassword = await bcrypt.hash(password, 12);

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

    var userResult = await user.save();

    if (!userResult) {
      const error = new Error("It wasn't possible to create the user");
      error.statusCode = 400;
      throw error;
    }

    res.status(200).json({ message: "User created!", userId: userResult._id });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  let loadedUser;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      const error = new Error("User with this email could not be found");
      error.statusCode = 401;
      throw error;
    }

    loadedUser = user;
    const isEqual = await bcrypt.compare(password, user.password);

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
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};
