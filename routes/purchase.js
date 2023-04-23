const express = require('express');
const purchaseRoutes = require('../controllers/purchase');
const authenticateRoutes = require('../middlewares/auth');
const route = express.Router();

route.get('/purchasemembership', authenticateRoutes.authenticate, purchaseRoutes.purchasepremium);
route.post('/updatetransactionstatus', authenticateRoutes.authenticate, purchaseRoutes.updateTransactionStatus);

module.exports = route;