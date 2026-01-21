require("dotenv").config();
const express = require("express");
const path = require("path");
const { globalErrorHandler } = require("./middleware/error");
const colors = require("colors");
const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require(path.join(__dirname, "swagger-output.json"));
const mongoose = require("mongoose");
const upload = require("../api/middleware/file");
const { graphqlHTTP } = require("express-graphql");
const graphqlSchema = require("./graphql/schema");
const graphqlResolver = require("./graphql/resolvers");
const { formatError } = require("graphql");
const auth = require("./middleware/auth");
const fs = require("fs");

const app = express();

const PORT = process.env.PORT || 8080;

//here we will receive the data as "application/json"
app.use(bodyParser.json());
//here we use multer to extract a single file from the request
app.use(upload.single("image"));

//here we will staticly serve the images folder
app.use("/images", express.static(path.join(__dirname, "images")));

//swagger documentation
// swagger documentation (robust)
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, { explorer: true }),
);

//This is the CORS policy
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); //here we allow any front end to make a request to our API
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE", //there are the methods types that can access make requests to our API
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); //this enables content and auth headers in the requests

  if (req.method === "OPTIONS") {
    return res.sendStatus(200); //we send a 200 response to the preflight request
  }

  next();
});

app.get("/swagger.json", (req, res) => res.json(swaggerDocument));

// app.use("/feed", feedRoutes);
// app.use("/auth", authRoutes);

//Here we add the auth middleware
app.use(auth); //this will check for the auth token in each request

//here we will handle the addition of images
app.put("/post-image", auth, (req, res, next) => {
  if (!req.isAuth) {
    throw new Error("Not authenticated!");
  }

  if (!req.file) {
    return res.status(200).json({ message: "No file provided!" });
  }

  if (req.body.oldPath) {
    clearImage(req.body.oldPath);
  }

  return res
    .status(201)
    .json({ message: "File stored.", filePath: req.file.path });
});

//here we use the graphql endpoint
app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema, //here we import the schema we define for our GraphQL API
    rootValue: graphqlResolver, //here we import the resolvers that contain the functions to handle the queries and mutations
    graphiql: true, //this enables the graphiql interface
    customFormatErrorFn(err) {
      //in this function we can format the errors before sending them to the client
      if (!err.originalError) {
        return err;
      }

      const data = err.originalError.data;
      const message = err.message || "An error occurred.";
      const code = err.originalError.code || 500;

      return { message: message, status: code, data: data };
    },
  }),
);

//global error handling
app.use(globalErrorHandler);

mongoose
  .connect(process.env.MONGO_DB_CONNECTION_STRING)
  .then((result) => {
    console.log("Connected to MongoDb instance".bgMagenta);

    const server = app.listen(PORT, () => {
      console.log(`API listening on port ${PORT}`.bgBlue);
    });
  })
  .catch((err) => console.log(err));

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
