const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
// here we serve static files from the public folder
// this allows us to serve CSS files, images, etc. from the public folder, so that we can use them in our HTML files
app.use(express.static(path.join(__dirname, "public")));

//here we mount the admin routes
//so that they can handle requests to /admin/add-product and /admin/product
//the admin routes will be prefixed with /admin with the first argument
app.use("/admin", adminRoutes);
//here we mount the shop routes
app.use(shopRoutes);

//here we handle requests that do not match any of the above routes
//this should be the last middleware in the stack
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
