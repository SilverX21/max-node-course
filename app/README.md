# Max Node.js Course on Udemy

This course is to learn more about Node.js and to begin my journey on JavaScript backend development 🚀

We will work inside the app folder, so this way we can follow after the section 4 on this course!

## 0. First setup

Check this video out for the walkthrough: [Project Setup](https://www.youtube.com/watch?v=GTDYsV5pyZU)

Let's start to setup the project, so we can have a better developer experience.

### 0.1 Eslint

Let's install `eslint` first: `npm init @eslint/config@latest`
Let's set it up like this:

√ What do you want to lint? · javascript
√ How would you like to use ESLint? · problems
√ What type of modules does your project use? · commonjs
√ Which framework does your project use? · none
√ Does your project use TypeScript? · No / Yes
√ Where does your code run? · node

It will generate the following file: `eslint.config.mjs`

Then, let's add a new script to the package.json:

```
"lint": "eslint"
```

This will output in the terminal errors, problems and other warnings of your application

Check the docs for `eslint`: https://eslint.org/docs/latest/use/configure/

### 0.2 Prettier

For Prettier, you can check the docs here for the integration with linters: [ESLint setup](https://prettier.io/docs/integrating-with-linters)

To integrate with `eslint` we can first install these packages:

- `npm install --save-dev eslint-plugin-prettier eslint-config-prettier`
- `npm install --save-dev --save-exact prettier`

## 1. Section 4 - Improved Development Workflow and Debugging

1. First, we created the app folder, then we proceeded to run the following script, inside the app directory: `npm init`
2. Then, let's add the start line to the `package.json` file:

```json
"scripts": {
    ...
    "start": "node app.js"
}
```

This will run every time you run the `npm start` command, so if you need to do something everytime you run the project, you can add it here 👌 3. If we add another line inside the scripts section:

```json
"scripts": {
    "start": "node app.js",
    "start-server": "node app.js"
}
```

If you now needed to start using the `start-server` script, you should do something like this: `npm run start-server`

4. If we want to install a package from `npm` you can run the following command: `npm install package_name`
5. There are two types of packages: production dependencies, that we use in production, and development dependencies, that we only use for the development. For this case, we are going to install `nodemon`.

   This package is a development dependency, so it will only be used during the development phase (this package restarts the server every time we update our code, instead of running the commands manually, we can use this package to restart it).
   In this case, we need to add `--save-dev` at the end, something like this: `npm install nodemon --save-dev`. This way the npm can know which of these packages is for production 🚀
   If we installed it as `npm install nodemon --save`, it would install it as a production package.
   If we installed it as `npm install nodemon -g`, it would install it globally.

6. If we want to start using nodemon, we can change the `start` script in the `package.json` file to use it:

```json
"scripts": {
    "start": "nodemon app.js"
}
```

7. To use the debugger with nodemon, you can do the following:

   ![setting debugger options](/images/1.set%20debugger%20options.png)

   We need to go to `Run` > `Add Configuration...`
   Then, the file `launch.json` will be created, there you'll need to add the following options inside the `configurations` array:

   ```json
    "restart": true,
    "runtimeExecutable": "nodemon",
    "console": "integratedTerminal"
   ```

   This will enable the VS Code to restart the server, using nodemon.
   NOTE: There could be an error that it fails. This is due to nodemon not being installed globally, so we need to install it like this: `npm install nodemon -g`
   We also added the option `console` to the options so we could have the loggs in the integrated terminal off VS Code.

## Section 5 - Working with Express.js

8. To install Express, we just need to run the command `npm install --save express`. We use the `--save` because this will be on production 🚀
9. Let's also install the body-parser package to parse requests from the front end: `npm install --save body-parser`

## Section 6 - Working with dynamic content & adding templating engines

10. let's install the folllwing: `npm install --save ejs pug express-handlebars`
    Here we have some of the templates for dynamic content using html 💪

## Section 9 - Sql Introduction

Here we will install MySQL and work with it using node!

11. let's install `npm install --save mysql2`

## Section 10 - Sequelize

12. let's install the package: `npm install --save sequelize`
    Sequelize will require `mysql2` to be installed before being installed

## Section 12 - MongoDb

13. let's install the package: `npm install --save mongodb`
    then let's set it up like this:

```javascript
const mongodb = require("mongodb");
const colors = require("colors");

const MongoClient = mongodb.MongoClient;
let _db;

const mongoConnect = (callback) => {
  console.log("MongoDB connecting...");
  console.log(
    ".env variable for connection string: " +
      process.env.MONGO_DB_CONNECTION_STRING
  );

  MongoClient.connect(process.env.MONGO_DB_CONNECTION_STRING)
    .then((client) => {
      console.log("Connected to MongoDB".green);
      _db = client.db();
      callback(client);
    })
    .catch((err) => {
      console.log(err.red);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }

  throw "No database found";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
```

14. For the connection string, we will need to have a .env file for best practices, to use this approach, we need to install this package: `npm install dotenv`
    Then we need to import it in the app.js file for global usage: `require("dotenv").config()`

## Section 13 - Working with Mongoose

15. To add Mongoose to our project, we need to install the package `npm install --save mongoose`

Mongoose is an ODM (Object Document Mapper), it can pick up our documents and help us to focus on our data instead of focusing in our queries

## Section 14 - Sessions and Cookies 🍪

Let's start by installing this package: `npm install --save express-session`

This will add express middleware for session management

16. Let's use the database to help us to have our session data stored. We are using MongoDb, so we can use the following package: `npm install --save connect-mongodb-session`

We can create a session store for MongoDB like this:

```javascript
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const store = new MongoDBStore({
  uri: process.env.MONGO_DB_CONNECTION_STRING,
  collection: "sessions", //this is the name of the collection where the sessions will be stored
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store, //here we pass the store instance to store sessions in MongoDB
  })
);
```

## Section 15 - Adding Authentication

17. Let's start by adding this package: `npm install --save bcryptjs`

This package can help us encrypt some data, in this case, we will need to encrypt passwords in order to not have security flaws in our code 🔑

18. We can use middleware to protect our routes from being accessed without the required user rights.
    For that, we can create a middleware (this way it is more scalable). We can do it like this:

```javascript
module.exports = (req, res, next) => {
  //first we check if it's authenticated
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  next();
};
```

Then, we can go to the routes folder and then use it like this:

```javascript
const isAuth = require("../middleware/is-auth");

//here we add the isAuth middleware to protect the route before calling the controller
router.get("/add-product", isAuth, adminController.getAddProduct);
```

The middleware is executed from left to right, if the `isAuth` one doesn't call the `next()` function, it won't let the next middleware to execute 🚀

19. To protect us against CSRF attacks, we can use the following package: `npm install --save csurf`
    This package can generate tokens to embed in our pages that change the user state, this way we can protect our requests and the user as well.

```javascript
const csrf = require("csurf");
//here we set up CSRF protection middleware
const csrfProtection = csrf();

//session middleware here

//here we initialize the CSRF protection middleware after the session middleware
app.use(csrfProtection);
```

Then we need to add it in the views, so we can do post requests as well, if we don't do this, it will not work and we will have an exception.
To pass it to the views, we can do something like this:

```javascript
res.render("shop/index", {
  prods: products,
  pageTitle: "Shop",
  path: "/",
  isAuthenticated: req.session.isLoggedIn,
  csrfToken: req.csrfToken(), // Pass the CSRF token to the view
});
```

In the views, when we do post requests (in forms) we can add something like this inside the form element:

```ejs
<input type="hidden" name="_csrf" value="<%= csrfToken %>" />
```

20. If we want to pass some data that needs to be in every request to the views, instead of duplicating the code, we can do something like this:

```javascript
//...after the code for csrf and auth
app.use((req, res, next) => {
  //for every view we render, we will have these two variables available
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});
```

21. For us to send messages to the client (user), we need to pass in the render of the pages those messages.
22. For that, we can use the package `npm install --save connect-flash` to add that functionality to it and help us do that like this:

```javascript
//...code for the session
const flash = require("connect-flash");

app.use(flash());

//...this is the controller endpoint
if (!user) {
  //we pass the key name, and the message
  req.flash("error", "Invalid email or password.");
  return res.redirect("/login");
}

//...other endpoint
res.render("auth/login", {
  path: "/login",
  pageTitle: "Login",
  errorMessage: req.flash("error"), //here we pass the error message and we access the message through the key we created before
});
```

## Section 16 - Sending Emails

23. In this section we will introduce mail sending, we are going to use SendGrid as a mail server 📧

    For the email sending, we can use these packages: `npm install --save nodemailer`

_NOTE_: Instead of following the sendgrid mail settings, we are using google app. For that, we can follow this to set it up: [Google App Setup](https://www.youtube.com/watch?v=cqdAS49RthQ)

Here's a basic setup:

```javascript
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "your_host",
  port: 111,
  secure: true,
  auth: {
    user: "your_email",
    pass: "your_key",
  },
});

transporter
  .sendMail({
    to: email,
    subject: "Signup succeeded!",
    html: "<h1>You successfully signed up!</h1>",
  })
  .then((result) => console.log(result))
  .catch((err) => console.log(err));
```

## Section 17 - Advanced Authentication

Here we will be adding some safety features to our application.

24. Let's add a password reset feature, for this, we need to do the following:

```javascript
const { randomBytes } = require("node:crypto");

randomBytes(32, (err, buffer) => {
  if (err) {
    console.log(err);
    return res.redirect("/reset");
  }

  const token = buffer.toString("hex");

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "No account with that email found.");
        return res.redirect("/reset");
      }

      //we added 2 fields to the user model to store the reset token and its expiration time
      //this will allow us to verify the token later when the user clicks the link in the email
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3_600_000; //this is 1 hour from now
      return user.save();
    })
    .then((result) => {
      res.redirect("/");
      transporter.sendMail({
        to: req.body.email,
        subject: "Password Reset",
        html: `
          <p>You requested a password reset</p>
          <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to reset your password</p>
          `,
      });
    })
    .catch((err) => console.log(err));
});
```

_NOTE_: For crypto we needed to use an updated version of node, for that, we used the `randomBytes` function from the documentation: [Crypto Documentation](https://nodejs.org/api/crypto.html)

## Section 18 - Understanding Validation

Here we will focus on server side validation! 🚀

25. Let's install the package `npm install express-validator`, this is an express validator, we can check the documentation here: [Express Validator documentation](https://express-validator.github.io/docs/)

We can set it up in the routes files, this way it's cleaner! Here's an example:

```javascript
//... routes file
const { check } = require("express-validator");
//here we can pass the name of the field we want to validate and then use the package methods to do some checking
//we can also pass a custom message using .withMessage() -> it will refer to the validation before
router.post(
  "/signup",
  check("email").isEmail().withMessage("Please enter a valid email"),
  authController.postSignup
);

//... in the controller
const { validationResult } = require("express-validator");

exports.postSignup = (req, res, next) => {
  onst errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());

    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: errors.array(),
    });
  }

  //...rest of the code
};
```

We can also have custom validators like this:

```javascript
check("email")
  .isEmail()
  .withMessage("Please enter a valid email")
  .custom((value, { req }) => {
    if (value === "test@test.com") {
      throw new Error("This email address is invalid");
    }
    return true;
  });
```

## Section 19 - Error Handling

Handling error is one of the most important aspects in programming.

We can have error handling middleware like this that Express has:

```javascript
app.use((error, req, res, next) => {
  res.status(500).render("500", {
    pageTitle: "Error!",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
  });
});
```

In here we have 4 arguments, were the first is the error that was thrown and the other 3 are the same ones (request, response and next)
Express will first execute this one and then the other middlewares. If we have multiple error handlers, they will be executed from top to bottom.

Also, look at the following code:

```javascript
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
```

If we throw an error inside synchronous code, Express detect this handle the exception by executing the error handling middleware for it, like
we have above.

If we throw an exception inside asynchronous code, inside then() and catch(), we need to pass the next with the error for us to handle it

## Section 20 - File upload and download

Let's start by installing this package: `npm install --save multer`

Multer is a package that lets us parse incoming requests for files

We can set up multer like this:

```javascript
const multer = require("multer");

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

//here we use multer to parse incoming requests where the image property will have a file
//the dest property refers to "destination", it will basically store the image in a folder called "images"
//here we pass the filStorage to have the options we defined above
//the fileFilter options will let us filter which types of files can be uploaded
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
```

As you can see, we can have multer have a defined way to store the images we pass through our requests from the forms

For us to send a file in a response, we must stream it like this:

```javascript
const file = fs.createReadStream(invoicePath);
res.setHeader("Content-Type", "application/pdf");
res.setHeader("Content-Disposition", `inline; filename="${invoiceName}"`);

file.pipe(res);
```

This will write the data into the response object and send it to the user, this data will be writen chunk by chunk. 🚀

We can also create a .pdf file on the fly, for that we can use this package: `npm install --save pdfkit`.
To use it, we can do something like this:

```javascript
const PDFDocument = require("pdfkit");

//we can then use it like this:
exports.getPdfDoc = (req, res, next) => {
  const invoicePath = "some_cool_name";

  const pdfDoc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename="${invoiceName}"`);

  //here we start a writing stream
  pdfDoc.pipe(fs.createWriteStream(invoicePath));
  pdfDoc.pipe(res);

  //here we are writing to the document
  pdfDoc.text("Hello World");
  //here we close the stream and the response will be sent
  pdfDoc.end();
};
```

## Section 21 - Adding pagination

Using mongoose we can do pagination like this:

```javascript
Product.find()
  .countDocuments()
  .then((numProducts) => {
    totalItems = numProducts;

    return Product.find()
      .skip((page - 1) * ITEMS_PER_PAGE) //here we are going to skip some items
      .limit(ITEMS_PER_PAGE); //here we limit the number of items that will be fetched
  });
```

## Section 22 - Understanding async requests
