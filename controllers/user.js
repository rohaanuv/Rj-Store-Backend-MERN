const User = require("../models/user");
const Order = require("../models/order");
//const Product = require("../models/product");
exports.getUserById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "No User Found"
            })
        }
        req.profile = user
        next();
    });
};

exports.getUser = (req, res) => {
    req.profile.role = undefined
    req.profile.salt = undefined
    req.profile.encry_password = undefined
    req.profile.createdAt = undefined
    req.profile.updatedAt = undefined
    return res.json(req.profile)
};
//Analysis
exports.getAllUsers = (req, res, next) => {
    User.find().exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "No Users Found"
            })
        }
        user.role = undefined
        user.salt = undefined
        user.encry_password = undefined
        user.createdAt = undefined
        user.updatedAt = undefined
        res.json(user);
    });
};

exports.updateUser = (req, res) => {
    User.findByIdAndUpdate({
            _id: req.profile._id
        }, {
            $set: req.body
        }, {
            new: true,
            useFindAndModify: false
        },
        (err, user) => {
            if (err) {
                return res.status(400).json({
                    error: "You are not Autherized to Update the info"
                })
            }
            user.role = undefined
            user.salt = undefined
            user.encry_password = undefined
            user.createdAt = undefined
            user.updatedAt = undefined
            res.json(user)
        }
    )
}

exports.userPurchaseList = (req, res) => {
    Order.find({
            user: req.profile._id
        }).populate("user", "_id first_name")
        .exec((err, order) => {
            if (err) {
                res.status(400).json({
                    error: "No order"
                })
            }
            return res.json(order);
        })
}

exports.pushOrderInPurchaseList = (req, res, next) => {
    let purchases = []
    req.body.order.products.forEach(product => {
        purchases.push({
            _id: product._id,
            name: product.name,
            description: product.description,
            category: product.category,
            quantity: product.quantity,
            amount: req.body.order.amount,
            transction_id: req.body.order.transction_id
        })
    })
    //store in db
    User.findOneAndUpdate({
            _id: req.profile._id
        }, {
            $push: {
                purchases: purchases
            }

        }, {
            new: true
        },
        (err, purchases) => {
            if (err) {
                return res.status(400).json({
                    error: "Unable to save Purchase list"
                })
            }
            next();
        }
    )
}