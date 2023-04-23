const Razorpay = require('razorpay');
const Order = require('../models/order');
exports.purchasepremium = async (req, res, next) => {
    try {
        let rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
        const amount = 500;
        rzp.orders.create({ amount: amount, currency: "INR" }, async (err, order) => {
            if (err) {
                throw new Error(err);
            }
            await req.user.createOrder({ orderid: order.id, status: 'PENDING' })
            return res.status(201).json({ order, key_id: rzp.key_id });
        })
    } catch (error) {
        res.status(403).json({ message: 'Something went wrong', error: error });
    }
}
exports.updateTransactionStatus = async (req, res, next) => {
    try {
        const { order_id, payment_id, } = req.body;
        const order = await Order.findOne({ where: { orderid: order_id } });
        const promise1 = order.update({ paymentid: payment_id, status: 'SUCCESSFULL' });
        const promise2 = req.user.update({ ispremiumuser: true });
        await Promise.all([promise1, promise2]);
        return res.status(202).json({ success: true, message: 'Transcation Successfull' })
    } catch (error) {
        res.status(403).json({ message: 'Something went wrong', error: error });
    }
}