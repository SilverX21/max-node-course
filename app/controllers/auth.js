exports.getLogin = (req, res, next) => {
  const isLoggedIn =
    req.get("Cookie") && req.get("Cookie").includes("loggedIn=true");
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  //here we can use the .setheader function to set a header to a request
  //in this case we set a cookie using the Set-Cookie header (this one is reserved to set cookies)
  //here we have a key-value pair, the key is loggedIn and the value is true
  res.setHeader("Set-Cookie", "loggedIn=true");
  req.isLoggedIn = true;

  res.redirect("/");
};
