const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  // const isLoggedIn =
  //   req.get("Cookie") && req.get("Cookie").includes("loggedIn=true");
  console.log(req.session);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  //here we can use the .setheader function to set a header to a request
  //in this case we set a cookie using the Set-Cookie header (this one is reserved to set cookies)
  //here we have a key-value pair, the key is loggedIn and the value is true
  //res.setHeader("Set-Cookie", "loggedIn=true");

  //we now use sessions to manage login state by accessing the session object on the request that was added by express-session
  User.findById("694a9ad79dd42ee9f95f1971")
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = {
        _id: user._id.toString(), //this needs to be converted to string because of mongoose objectId type
        name: user.name,
        email: user.email,
        cart: user.cart,
      };
      req.session.save((err) => {
        console.log(err);
        res.redirect("/");
      }); //this will force the session to be saved before we redirect
    })
    .catch((err) => console.log(err));
};
