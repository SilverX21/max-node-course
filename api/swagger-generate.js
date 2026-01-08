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

//this will generate a swagger documentation json file to the outputFile that you've defined
