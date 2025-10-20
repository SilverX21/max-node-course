const express = require("express");
// const path = require("path");
// const rootDir = require("../util/path");

const adminData = require("./admin");

const router = express.Router();

router.get("/", (req, res, next) => {
  // console.log("shop.js", adminData.products);
  // res.sendFile(path.join(rootDir, "views", "shop.html"));

  const products = adminData.products;

  //this will use the default view engine set in app.js, in this case we are using pug
  //it already knows to look in the views folder because we set it in app.js
  //given we are using pug, we do not need to provide the full file name, just the name without extension
  //we are passing an object with the products array to the template
  //in handleabars, we cannot directly check for length, so we create a new variable hasProducts
  res.render("shop", {
    prods: products,
    pageTitle: "Shop",
    path: "/",
    hasProducts: products.length > 0,
    activeShop: true,
    productCSS: true,
  });
});

module.exports = router;
