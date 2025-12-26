module.exports = (req, res, next) => {
  //here we protect routes by checking if the user is authenticated
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }

  //if the user is authenticated, we call next to proceed to the next middleware or route handler
  next();
};
