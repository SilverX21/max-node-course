const express = require("express");
const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");
const { check, body } = require("express-validator");

const router = express.Router();

//here we add the isAuth middleware to protect the route before calling the controller
router.get("/add-product", isAuth, adminController.getAddProduct);

//don't forget this starts with /admin because of how we set it up in app.js
router.get("/products", isAuth, adminController.getProducts);

router.post(
  "/add-product",
  [
    body("title")
      .isString()
      .notEmpty()
      .withMessage("The title cannot be empty")
      .isLength({ min: 3 })
      .withMessage("The title must have more than 2 characters")
      .trim(),
    body("price").isFloat().withMessage("The price must be a number"),
    body("description")
      .notEmpty()
      .withMessage("The description cannot be empty")
      .isLength({ min: 5, max: 400 })
      .withMessage("The description must have more than 2 characters")
      .trim(),
  ],
  isAuth,
  adminController.postAddProduct
);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.post(
  "/edit-product",
  [
    body("title")
      .isString()
      .isLength({ min: 3 })
      .withMessage("The title must have more than 2 characters")
      .trim(),
    body("price").isFloat().withMessage("The price must be a number"),
    body("description")
      .notEmpty()
      .withMessage("The description cannot be empty")
      .isLength({ min: 5, max: 400 })
      .withMessage("The description must have more than 2 characters")
      .trim(),
  ],
  isAuth,
  adminController.postEditProduct
);

router.delete("/product/:productId", isAuth, adminController.deleteProduct);

module.exports = router;
