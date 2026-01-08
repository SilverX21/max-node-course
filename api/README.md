# Node API

In this folder we will have the part of the course that references to the API.

1. Let's start to set it up by running the command `npm init -y`
2. Then let's install these packages:

- `npm install --save express`
- `npm install --save-dev nodemon`
- `npm install --save body-parser`
- `npm install --save express-validator`
- `npm install --save mongoose`
- `npm install --save multer`
- `npm install --save bcryptjs`

3. Let's add swagger so we can have a UI to check our endpoints: `npm install express swagger-ui-express swagger-jsdoc`

4. Let's also install the package `npm install --save uuid` to generate Guids

## Swagger Documentation

5. For documentation, we can use these packages: `npm install swagger-autogen swagger-ui-express`
   Swagger Autogen has a documentation here: [Swagger Autogen Documentation](https://swagger-autogen.github.io/docs/)

With this, we can generate swagger documentation automatically like this:

Create a file named "swagger-generate.js" anywhere you want and then let's add this:

```javascript
const path = require("path");
const swaggerAutogen = require("swagger-autogen")();

const outputFile = path.join(__dirname, "swagger-output.json");
const endpointsFiles = [path.join(__dirname, "app.js")];

const doc = {
  info: {
    version: "1.0.0",
    title: "REST API",
    description: "Max Node.js course API section",
  },
  host: "localhost:8080",
  basePath: "/",
  schemes: ["http"],
};

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log("Successfully generated swagger output");
});
```

After this, let's run the command: `node .\swagger-generate.js` (you need to run this inside your file directory).
This will create a file named "swagger-output.json", where you will have a json with the documentation generated

Then, let's import swagger-ui-express in our app.js file:

```javascript
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-generate");

//add this before your endpoints registry
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
```

_**TIP**_: If you find having trouble with multiple hosts pointing to the same port, use this:

```bash
netstat -ano | findstr :8080
taskkill /PID <pid> /F
```

## JWT Tokens

6. For authentication, we will use JWT tokens.
   For that, let's start by installing the package: `npm install --save jsonwebtoken`

Then, we cann implement it like this:

```javascript
const jwt = require("jsonwebtoken");

//here we generate a JWT Token
//in the object we cann add the data we want (don't store passwords), for example: eail, userId, name, etc
//the second parameter is a secret we will use for generate the token (must be a secret)
//then the third is an object that we can pass the duration of the token, in this case we will put 1 hour
const token = jwt.sign(
  {
    email: loadedUser.email,
    userId: loadedUser._id.toString(),
  },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);
```

Now that we can now create JWT tokens, we need to read them so we can have access to the current user data and filter data.
For that, we can create a middleware like this:

```javascript
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.get("Authorization").split(" ")[1];
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    error.statusCode = 500;
    throw error;
  }

  if (!decodedToken) {
    const error = new Error("Not authenticated");
    error.statusCode = 401;
    throw error;
  }

  //here we pass the user Id to the request, so we can have access to the userId
  req.userId = decodedToken.userId;
  next();
};
```

This middleware will read our token, for that to happen, we need to user our secret key we create earlier so we can decode it and have
access to the data.

Then we just need to use this in our routes:

```javascript
//first we import
const isAuth = require("../middleware/is-auth");

//then we use it like this, before our validation and our controller


```
