const express = require("express");
const path = require("path");
const rootDir = require("../util/path");

//router will handle requests to /admin/add-product and /admin/product
//and will be mounted in app.js
const router = express.Router();

router.get("/add-product", (req, res, next) => {
  console.log("the value of __dirname inside the admin.js: ", __dirname);
  res.sendFile(path.join(rootDir, "views", "add-product.html"));
});

router.post("/add-product", (req, res, next) => {
  console.log(req.body);
  res.redirect("/");
});

module.exports = router;
