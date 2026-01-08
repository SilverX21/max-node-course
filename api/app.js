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
  swaggerUi.setup(swaggerDocument, { explorer: true })
);

//This is the CORS policy
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); //here we allow any front end to make a request to our API
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE" //there are the methods types that can access make requests to our API
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); //this enables content and auth headers in the requests
  next();
});

app.get("/swagger.json", (req, res) => res.json(swaggerDocument));

app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);

//global error handling
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`.bgBlue);
});

mongoose
  .connect(process.env.MONGO_DB_CONNECTION_STRING)
  .then((result) => {
    console.log("Connected to MongoDb instance".bgMagenta);
  })
  .catch((err) => console.log(err));
