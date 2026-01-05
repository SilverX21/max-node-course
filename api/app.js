require("dotenv").config();
const express = require("express");
const colors = require("colors");
const feedRoutes = require("./routes/feed");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const app = express();

//here we will receive the data as "application/json"
app.use(bodyParser.json());

const swaggerOptions = {
  swaggerDefinition: {
    myapi: "1.0",
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
  },
  apis: ["./routes/*.js"], // files containing annotations as above
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

app.listen(8080, () => {
  console.log("API listening on port 8080".bgBlue);
});
