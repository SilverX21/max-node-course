require("dotenv").config();
const path = require("path");
const fs = require("fs");
const https = require("https");
const express = require("express");
const bodyParser = require("body-parser");
const colors = require("colors");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");

const errorController = require("./controllers/error");
const User = require("./models/user");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

const app = express();
//here we create a new MongoDBStore instance to store our sessions in MongoDB
const store = new MongoDBStore({
  uri: process.env.MONGO_DB_CONNECTION_STRING,
  collection: "sessions", //this is the name of the collection where the sessions will be stored
});

//here we set up CSRF protection middleware
const csrfProtection = csrf();

//here we will setup our https  by getting the private key and the certificate
const privateKey = fs.readFileSync("server.key");
const certificate = fs.readFileSync("server.cert");

//this is a storage engine that multer can use
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    //this takes a request, a file and a callback function
    //the first argument it's an error message, if it's null, multer will proceed to store it in the "images" folder
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    //here we have the same for the error message, and then we have the file name we want
    //we need first to do these tweaks to the timestamp so we don't have problems saving it in the disk
    const safeTimestamp = new Date().toISOString().replace(/:/g, "-");
    const safeOriginal = file.originalname.replace(/[<>:"/\\|?*]/g, "_");
    cb(null, `${safeTimestamp}-${safeOriginal}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

//here we use helmet to set some secure headers
//app.use(helmet());

//here we use compression to gzip the responses, after adding this you would see that the assets loaded have a smaller size!
app.use(compression());

//here we configure morgan to add a file for logging
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }, //the "a" flag means "append" - we want to append new logs to the file
);

//morgan will log our http requests so we can track what is done in our application
//app.use(morgan("combined", { stream: accessLogStream })); //here we add the stream option to tell morgan to use our file
app.use(morgan("combined"));

app.use(bodyParser.urlencoded({ extended: false }));

//here we use multer to parse incoming requests where the image property will have a file
//the dest property refers to "destination", it will basically store the image in a folder called "images"
//here we pass the filStorage to have the options we defined above
//the fileFilter options will let us filter which types of files can be uploaded
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image"),
);
app.use(express.static(path.join(__dirname, "public")));

//here we say that we want to statically serve our images in the images folder
app.use("/images", express.static(path.join(__dirname, "images")));

//here we set up the session middleware
//we use the session and provide: secret key (this must be a long string in prod), resave to false (this won't save every session on every
//request that is done), saveUninitialized to false (this won't create a session until something is stored)
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store, //here we pass the store instance to store sessions in MongoDB
  }),
);

//here we initialize the CSRF protection middleware after the session middleware
app.use(csrfProtection);

app.use(flash());

app.use((req, res, next) => {
  //for every view we render, we will have these two variables available
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  //inside sync code, Express detect this handle the exception by executing the error handling middleware for it
  //throw new Error("Sync dummy"); //TODO: Remove this line
  if (!req.session.user) {
    return next();
  }

  User.findById(req.session.user._id)
    .then((user) => {
      //inside async code with then() and catch() we need to pass the next with the error for us to handle it
      //throw new Error("Sync dummy"); //TODO: Remove this line
      if (!user) {
        return next();
      }

      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});

//here we change to use the admin routes for any route that starts with /admin
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get("/500", errorController.get500);
app.use(errorController.get404);

//express will check first this middleware with 4 arguments, the first one is the error and then we have the usual 3
//here we can handle the error the way we want. If we have more than 1 of these, it will execute from top to bottom
app.use((error, req, res, next) => {
  res.status(500).render("500", {
    pageTitle: "Error!",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
  });
});

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

    //here we create the https server using our private key and certificate
    //https.createServer({ key: privateKey, cert: certificate }).listen(3000);
    app.listen(3000);
    console.log("Connected to MongoDB".bgMagenta.white);
  })
  .catch((err) => console.log(err.red));
