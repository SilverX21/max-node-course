const express = require("express");

const shopController = require("../controllers/shop");

const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

// New route for product details. The ":productId" part is a route parameter
//one thing we must be careful is that if we had a route like /products/details, it would match this route as well, so we must define this route after any more specific routes
router.get("/products/:productId", shopController.getProduct);

router.get("/cart", shopController.getCart);

router.post("/cart", shopController.postCart);

router.get("/orders", shopController.getOrders);
router.get("/checkout", shopController.getCheckout);

module.exports = router;
