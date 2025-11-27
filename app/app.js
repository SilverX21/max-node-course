const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const colors = require("colors");

// const adminRoutes = require("./routes/admin");
// const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/error");
const mongoConnect = require("./util/database")

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  // User.findByPk(1)
  //   .then((user) => {
  //     //for every request, we are setting the user here
  //     req.user = user;
  //
  //     next();
  //   })
  //   .catch((err) => console.log(err.red));
});

//here we change to use the admin routes for any route that starts with /admin
// app.use("/admin", adminRoutes);
// app.use(shopRoutes);

app.use(errorController.get404);

//here we connect to mongodb
mongoConnect((client) => {
    console.log(client);

    app.listen(3000, () => {
        console.log("Server started on port 3000".blue);
    })
});