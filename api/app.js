require("dotenv").config();
const express = require("express");
const path = require("path");
const colors = require("colors");
const feedRoutes = require("./routes/feed");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const mongoose = require("mongoose");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + "-" + file.originalname);
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
    cb(null, true);
  }
};

//here we will receive the data as "application/json"
app.use(bodyParser.json());
//here we use multer to extract a single file from the request
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

//here we will staticly serve the images folder
app.use("/images", express.static(path.join(__dirname, "images")));

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "Max Node.js Course - API V1",
    },
    servers: [
      {
        url: "http://localhost:8080",
      },
    ],
    components: {
      schemas: {
        Post: {
          type: "object",
          properties: {
            id: { type: "string", example: "2026-01-06T12:34:56.789Z" },
            title: { type: "string", example: "First Post" },
            content: { type: "string", example: "This is the first post!" },
          },
          required: ["title", "content"],
        },
      },
    },
  },
  apis: ["./controllers/*.js", "./routes/*.js", "./app.js"], // files containing annotations
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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

app.use("/feed", feedRoutes);

app.use((error, req, res, next) => {
  console.log(error);

  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

mongoose
  .connect(process.env.MONGO_DB_CONNECTION_STRING)
  .then((result) => {
    console.log("Connected to MongoDb instance".bgMagenta);
    app.listen(8080, () => {
      console.log("API listening on port 8080".bgBlue);
    });
  })
  .catch((err) => console.log(err));
