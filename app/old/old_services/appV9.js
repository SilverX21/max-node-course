const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/error");
//here we import the database connection to make sure it is initialized
const db = require("./util/database");

const app = express();

//we can test the database connection like this
//execute is safer than query to avoid sql injections
//promises have 2 methods: then and catch
db.execute("SELECT * FROM products")
  .then((result) => {
    //the first element is the result set, the second is the metadata
    console.log(result[0], result[1]);
  })
  .catch((err) => {
    console.log(err);
  });

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

//here we change to use the admin routes for any route that starts with /admin
app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
