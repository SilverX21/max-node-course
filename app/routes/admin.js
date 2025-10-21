const express = require("express");
const productsController = require("../controllers/products");

const router = express.Router();

//here we pass the reference to the function imported from the controller, that's why we don't add the parentheses
router.get("/add-product", productsController.getAddProduct);

router.post("/add-product", productsController.postAddProduct);

module.exports = router;
