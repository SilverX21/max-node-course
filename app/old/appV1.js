//here we import the express module
const express = require("express");

//here we create an instance of express
//this instance will be used to create the server and handle requests
const app = express();

//use is used to add some middleware to the express app
app.use((req, res, next) => {
  console.log("In the middleware!");
  next(); //this will call the next middleware in the stack
});

app.use((req, res, next) => {
  console.log("In another middleware!");

  //this will send a response to the client
  //as you can see, here we don't use the next() function because the res.send() will end the request-response cycle
  res.send("<h1>Hello from Express!</h1>");
});

app.listen(3000);
