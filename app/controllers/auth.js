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
  req.session.isLoggedIn = true;

  res.redirect("/");
};
