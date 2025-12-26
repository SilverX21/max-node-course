const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  // const isLoggedIn =
  //   req.get("Cookie") && req.get("Cookie").includes("loggedIn=true");
  let message = req.flash("error");

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message,
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message,
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        //we pass the key name, and the message
        console.log("User not found!".bgRed);
        req.flash("error", "Invalid email or password.");
        return res.redirect("/login");
      }

      //compare the password with the hashed password stored in the database
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          // if the passwords match, let's start a session
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = {
              _id: user._id.toString(),
              email: user.email,
              cart: user.cart,
            };

            return req.session.save((err) => {
              console.log(err);
              res.redirect("/");
            });
          }

          req.flash("error", "Invalid email or password.");
          res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  //here we destroy the session on logout
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.postSignup = (req, res, next) => {
  // const email = req.body.email;
  // const password = req.body.password;
  // const confirmPassword = req.body.confirmPassword;

  const { email, password, confirmPassword } = req.body;

  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash(
          "error",
          "Email already in use. Please pick a different one."
        );
        //user already exists
        //after this, we will add a message to show the error to the user
        return res.redirect("/signup");
      }

      //hash the password before storing it, this hash method will return a promise
      return bcrypt
        .hash(password, 12) //12 is the salt rounds (higher is more secure but slower)
        .then((hashedPassword) => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] },
          });

          return user.save();
        })
        .then((result) => {
          res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};
