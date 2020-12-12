const Product = require("../models/product");
const formidable = require('formidable');
const _ = require("lodash");
const fs = require("fs");

exports.getProductById = (req, res, next, id) => {
    Product.findById(id).populate("category").exec((err, product) => {
        if (err) {
            return res.status(400).json({
                error: "Product Not Found !!"
            });
        }
        req.product = product;
        next();
    });
}

exports.createProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                error: "Error at Img"
            })
        }
        // destrure fields 
        const {
            name,
            price,
            description,
            category,
            stock
        } = fields;
        if (
            !name ||
            !description ||
            !price ||
            !category ||
            !stock
        ) {
            return res.status(400).json({
                error: "Please include all fields"
            })

        }
        //Todo restriction on field
        let product = new Product(fields)
        // handel file here
        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    error: "File Size too Big"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }
        //save to DB
        product.save((err, product) => {
            if (err) {
                res.status(400).json({
                    error: "Saving Records is failed"
                })
            }
            res.json(product);
        })
    })
}

exports.getProduct = (req, res) => {
    req.product.photo = undefined;
    return res.json(req.product)
}

//middle wear
exports.photo = (req, res, next) => {
    if (req.product.photo.data) {
        res.set("Content-Type", req.product.photo.contentType)
        return res.send(req.product.photo.data);
    }
    next();
}

exports.removeProduct = (req, res) => {
    let product = req.product;
    product.remove((err, delproduct) => {
        if (err) {
            return res.status(400).json({
                error: `Failed to delete product ${product.name}`
            })
        }
        res.json({
            message: `Sucessfully deleted product ${product.name}`
        })
    })
}

exports.updateProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                error: "Error at Img"
            })
        }
        //updation code
        let product = req.product;
        product = _.extend(product, fields)

        // handel file here
        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    error: "File Size too Big"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }
        //save to DB
        product.save((err, product) => {
            if (err) {
                res.status(400).json({
                    error: "Updation of Product is failed"
                })
            }
            res.json(product);
        })
    })
}
//product listing
exports.getAllProducts = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    Product.find()
        .select("-photo")
        .populate("category")
        .sort([
            [sortBy, "asc"]
        ])
        .limit(limit)
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    error: "No product Found"
                })
            }
            res.json(products)
        })
}

exports.getAllUniqueCategories = (req, res) => {
    Product.distinct("category", {}, (err, category) => {
        if (err) {
            return res.json({
                error: "No category found"
            })
        }
        res.json(category)
    })
}

exports.updateStock = (req, res, next) => {
    let myOperations = req.body.order.products.map(prod => {
        return {
            updateOne: {
                filter: {
                    _id: prod._id
                },
                update: {
                    $inc: {
                        stock: -prod.count,
                        sold: +prod.count
                    }
                }
            }
        }
    })
    Product.bulkWrite(myOperations, {}, (err, products) => {
        if (err) {
            return res.status(400).json({
                error: "Bulk Operation failed"
            })
        }
        next();
    })
}