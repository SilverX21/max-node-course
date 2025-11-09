const express = require("express");
const adminController = require("../controllers/admin");

const router = express.Router();

//here we pass the reference to the function imported from the controller, that's why we don't add the parentheses
router.get("/add-product", adminController.getAddProduct);

//dont't forget this starts with /admin because of how we set it up in app.js
router.get("/products", adminController.getProducts);

router.post("/add-product", adminController.postAddProduct);

router.get("/edit-product/:productId", adminController.getEditProduct);

module.exports = router;
