const express = require("express");
const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

//here we add the isAuth middleware to protect the route before calling the controller
router.get("/add-product", isAuth, adminController.getAddProduct);

//don't forget this starts with /admin because of how we set it up in app.js
router.get("/products", isAuth, adminController.getProducts);

router.post("/add-product", isAuth, adminController.postAddProduct);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.post("/edit-product", isAuth, adminController.postEditProduct);

router.post("/delete-product", isAuth, adminController.postDeleteProduct);

module.exports = router;
