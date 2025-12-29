const express = require("express");

const authController = require("../controllers/auth");
const {check, body} = require("express-validator");
const User = require("../models/user");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post("/login", [
    body("email")
        .isEmail().withMessage("Please enter a valid email"),
    body("password", "Please enter a password with only numbers and text and at least 5 characters")
        .isLength({min: 5}).isAlphanumeric(),
], authController.postLogin);

router.post(
    "/signup",
    [
        check("email")
            .isEmail()
            .withMessage("Please enter a valid email")
            .custom((value, {req}) => {
                // if (value === "test@test.com") {
                //     throw new Error("This email address is forbiden");
                // }
                //
                // return true;
                return User.findOne({email: value})
                    .then(userDoc => {
                        if (userDoc) {
                            return Promise.reject("E-mail exists already, please pick a different one")
                        }
                    });
            }),
        //if a message can be applied to every validation, we can pass it in the second argument like this
        body("password", "Please enter a password with only numbers and text and at least 5 characters").isLength({min: 5})
            .isAlphanumeric(),
        //we can check if the password and confirmPassword match like this below
        body("confirmPassword").custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error("Passwords have to match");
            }
            return true;
        })
    ],
    authController.postSignup
);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
