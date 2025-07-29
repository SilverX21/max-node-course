//here we import the express module
const express = require("express");

//here we create an instance of express
//this instance will be used to create the server and handle requests
const app = express();

//here we are adding a middleware to a specific route
//this middleware will be executed only for requests to the "/add-product" route
//the code will run from top to bottom, we want to add the most specific routes first becasause express will match the first route that fits the request
app.use("/add-product", (req, res, next) => {
  console.log("In another middleware!");

  res.send('<h1>The "Add Product" Page!</h1>');
});

app.use("/", (req, res, next) => {
  console.log("In another middleware!");

  res.send("<h1>Hello from Express!</h1>");
});

app.listen(3000);
