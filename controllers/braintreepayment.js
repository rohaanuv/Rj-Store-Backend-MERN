const braintree = require('braintree');


let gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: 'x9z6ywdjjfmwztfq',
    publicKey: 's9gsg746dp3nkzm3',
    privateKey: '3db4f7acec3b3811a8a2484f6b456844',
});

exports.getToken = (req, res) => {
    gateway.clientToken.generate({}, function (err, response) {
        if (err) {
            res.status(500).json(err);
        } else {
            res.send(response);
        }
    });
};

exports.processPayment = (req, res) => {
    let nonceFromTheClient = req.body.paymentMethodNonce;

    let amountFromTheClient = req.body.amount;
    gateway.transaction.sale({
            amount: amountFromTheClient,
            paymentMethodNonce: nonceFromTheClient,

            options: {
                submitForSettlement: true,
            },
        },
        function (err, result) {
            if (err) {
                res.status(500).json(error);
            } else {
                res.json(result);
            }
        }
    );
};