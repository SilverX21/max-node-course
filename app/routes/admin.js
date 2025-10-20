const express = require("express");
// const path = require("path");
// const rootDir = require("../util/path");

//router will handle requests to /admin/add-product and /admin/product
//and will be mounted in app.js
const router = express.Router();

//this array will hold the products added via the form
const products = [];

router.get("/add-product", (req, res, next) => {
  // console.log("the value of __dirname inside the admin.js: ", __dirname);
  // res.sendFile(path.join(rootDir, "views", "add-product.html"));

  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    formCSS: true,
    productCSS: true,
    activeAddProduct: true,
  });
});

router.post("/add-product", (req, res, next) => {
  products.push({ title: req.body.title });

  res.redirect("/");
});

exports.routes = router;
exports.products = products;
