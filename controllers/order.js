const {
    Order,
    ProductCart
} = require("../models/order");

exports.getOrderById = (req, res, nest, id) => {
    Order.findById(id)
        .populate("products.product", "name price")
        .exec((err, order) => {
            if (err) {
                return res.status(400).json({
                    error: "No Oder Found In DB"
                })
            }
            req.order = order;
            next();
        })
}

exports.createOrder = (req, res) => {
    req.body.order.user = req.profile
    const order = new Order(req.body.order)
    order.save((err, order) => {
        if (err) {
            return res.status(400).json({
                error: "Faild to place order"
            })
        }
        res.json(order);
    })
}

exports.getAllOrders = (req, res) => {
    Order.find()
        .populate("user", "_id name email")
        .exec((err, order) => {
            if (err) {
                return res.status(400).json({
                    error: "No Orders Found"
                })
            }
            res.json(order);
        })
}

exports.updateStatus = (req, res) => {
    Order.update({
            _id: req.body.orderId
        }, {
            $set: {
                status: req.body.status
            }
        },
        (err, order) => {
            if (err) {
                return res.status(400).json({
                    error: "Can not Update Order Status"
                })
            }
            res.json(order);
        }
    )
}
//@Todo verify
exports.getOrderStatus = (req, res) => {
    res.json(Order.schema.path("status").enumValues);
}