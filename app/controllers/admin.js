const PRoduct = require("../models/product");

//here we are exporting a function that will handle the request to get the add product page
exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    formCSS: true,
    productCSS: true,
    activeAddProduct: true,
  });
};

exports.postAddProduct = (req, res, next) => {
  //here we use the Product model to create a new product and save it
  const product = new Product(req.body.title);
  product.save();

  res.redirect("/");
};
