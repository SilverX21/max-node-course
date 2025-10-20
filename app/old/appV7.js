const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
//here we import express-handlebars
const expressHbs = require("express-handlebars");

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const app = express();

//here we set up handlebars as our template engine
app.engine(
  "hbs",
  expressHbs.engine({
    extname: ".hbs",
    layoutsDir: "views/layouts/",
    defaultLayout: "main-layout",
  })
);

//here we set the view engine to handlebars
//the name in the second argument must match the first argument in app.engine
app.set("view engine", "hbs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminData.routes);
app.use(shopRoutes);

//The way we send data to template doesn't change, so if we do something for pug, we can do it for handlebars too
app.use((req, res, next) => {
  res.status(404).render("404", { pageTitle: "Page Not Found" });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
