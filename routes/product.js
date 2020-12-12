const express = require('express');
const router = express.Router();
const {
    isSignedIn,
    isAuthenticated,
    isAdmin
} = require('../controllers/auth');
const {
    getUserById
} = require('../controllers/user');
const {
    getProductById,
    createProduct,
    getProduct,
    photo,
    removeProduct,
    updateProduct,
    getAllProducts,
    getAllUniqueCategories
} = require('../controllers/product');
const {
    check
} = require('express-validator');

///all of params
router.param("userId", getUserById);
router.param("productId", getProductById);

//all of actual routes
//create
router.post(
    "/product/create/:userId", [
        check("name").isLength({
            min: 4
        }).withMessage("Please mention the product name"),
        check("description").isLength({
            min: 10
        }).withMessage("Please mention the product description"),
        check("price").isInt().withMessage("Please mention the product price"),
        check("category").isLength({
            min: 4
        }).withMessage("Please mention the product category"),
        check("stock").isInt().withMessage("Please mention the product stock")
    ],
    isSignedIn,
    isAuthenticated,
    isAdmin,
    createProduct
);
//read routes
router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", photo);
//delete route
router.delete("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, removeProduct);

//update route
router.put("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, updateProduct);

//listing route
router.get("/products", getAllProducts);

router.get("/products/categories", getAllUniqueCategories)
module.exports = router;