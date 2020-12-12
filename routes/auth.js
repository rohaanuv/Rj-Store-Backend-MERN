const express = require('express');
const router = express.Router()
const {
    signup,
    signin,
    signout,
    isSignedIn
} = require("../controllers/auth");
const {
    check
} = require('express-validator');

router.post("/signup", [
    check("first_name").isLength({
        min: 3
    }).withMessage("First name should be atleast 3 charectors"),
    check("last_name").isLength({
        min: 3
    }).withMessage("Last name should be atleast 3 charectors"),
    check("email").isEmail().withMessage("A valid Email is require"),
    check("password").isLength({
        min: 8
    }).withMessage("Password should be atleast 8 charectors")
], signup)

router.post("/signin", [
    check("email").isEmail().withMessage("A valid Email is require"),
    check("password").isLength({
        min: 6
    }).withMessage("Password is required")
], signin)

router.get("/signout", signout);


module.exports = router;