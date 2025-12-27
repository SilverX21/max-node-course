require("dotenv").config();
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const colors = require("colors");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");

const errorController = require("./controllers/error");
const User = require("./models/user");

const app = express();
//here we create a new MongoDBStore instance to store our sessions in MongoDB
const store = new MongoDBStore({
  uri: process.env.MONGO_DB_CONNECTION_STRING,
  collection: "sessions", //this is the name of the collection where the sessions will be stored
});

//here we set up CSRF protection middleware
const csrfProtection = csrf();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

//here we set up the session middleware
//we use the session and provide: secret key (this must be a long string in prod), resave to false (this won't save every session on every
//request that is done), saveUninitialized to false (this won't create a session until something is stored)
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store, //here we pass the store instance to store sessions in MongoDB
  })
);

//here we initialize the CSRF protection middleware after the session middleware
app.use(csrfProtection);

app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }

  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err.red));
});

app.use((req, res, next) => {
  //for every view we render, we will have these two variables available
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

//here we change to use the admin routes for any route that starts with /admin
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

//connect to MongoDB using mongoose
//mongoose will manage the connection pool for us
mongoose
  .connect(process.env.MONGO_DB_CONNECTION_STRING)
  .then((result) => {
    // User.findOne().then((user) => {
    //   if (!user) {
    //     const user = new User({
    //       name: "Silver",
    //       email: "silver@gmail.com",
    //       items: [],
    //     });
    //     user.save();
    //   }
    // });

    app.listen(3000);
    console.log("Connected to MongoDB".bgMagenta.white);
  })
  .catch((err) => console.log(err.red));
