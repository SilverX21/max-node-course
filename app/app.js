require("dotenv").config();
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const colors = require("colors");
const mongodb = require("mongodb");

const errorController = require("./controllers/error");
const mongoConnect = require("./util/database").mongoConnect;
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("6938b4c999dc03f11724b05b")
    .then((user) => {
      req.user = new User(user.name, user.email, user.cart, user._id);
      next();
    })
    .catch((err) => console.log(err.red));
});

//here we change to use the admin routes for any route that starts with /admin
app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

//here we connect to mongodb
mongoConnect(() => {
  app.listen(3000, () => {
    console.log("Server started on port 3000".blue);
  });
});
