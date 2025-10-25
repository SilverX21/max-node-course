const express = require("express");
const bodyParser = require("body-parser");

const app = express();

// This middleware is used to parse incoming request bodies
//this won't parse everything, but it will parse the body of a POST request like in froms
app.use(bodyParser.urlencoded({ extended: false }));

//This request will handle POST requests to the /add-product path
app.use("/add-product", (req, res, next) => {
  res.send(
    '<form action="/product" method="POST"><input type="text" name="title"><button type="submit">Add Productnd</button></form>'
  );
});

//This request will handle POST requests to the /product path
app.post("/product", (req, res, next) => {
  //the redirect will send the user to a given path
  console.log(req.body);
  res.redirect("/");
});

app.use("/", (req, res, next) => {
  res.send("<h1>Hello from Express!</h1>");
});

app.listen(3000);
