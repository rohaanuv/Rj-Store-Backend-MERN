const express = require("express");
const router = express.Router();
const {
    getUserById
} = require("../controllers/user");
//params
router.param("userId", getUserById);
const {
    isSignedIn,
    isAuthenticated
} = require("../controllers/auth");

const {
    getToken,
    processPayment
} = require("../controllers/braintreepayment");
router.get("/payment/gettoken/:userId", isSignedIn, isAuthenticated, getToken);

router.post(
    "/payment/braintree/:userId",
    isSignedIn,
    isAuthenticated,
    processPayment
);

module.exports = router;