const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const app = express();

//here a global configuration for the value for pug
// view engine allows us to tell express that for every dynamic templates we are trying to render, use this engine
app.set("view engine", "pug"); //we are using pug as our template engine, it works with .pug files
app.set("views", "views"); //we are setting the views directory to the views folder

app.use(bodyParser.urlencoded({ extended: false }));
// here we serve static files from the public folder
// this allows us to serve CSS files, images, etc. from the public folder, so that we can use them in our HTML files
app.use(express.static(path.join(__dirname, "public")));

//here we mount the admin routes
//so that they can handle requests to /admin/add-product and /admin/product
//the admin routes will be prefixed with /admin with the first argument
app.use("/admin", adminData.routes); //we are using .routes because we exported an object with routes and products
//here we mount the shop routes
app.use(shopRoutes);

//here we handle requests that do not match any of the above routes
//this should be the last middleware in the stack
app.use((req, res, next) => {
  // res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
  res.status(404).render("404", { pageTitle: "Page Not Found" });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
