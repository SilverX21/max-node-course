//the resolver is an exporter object that contains all the resolver functions for the GraphQL API.
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const validator = require("validator");

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
      //   error.data = errors;
      //   error.statusCode = 422;
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
};
