const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const userModel = require('./models/user');
const expenseModel = require('./models/expense');
const orderModel = require('./models/order');
const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase');
const sequelize = require('./utils/database');
const app = express();

app.use(cors());
app.use(bodyParser.json({ extended: false }));
app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseRoutes);
userModel.hasMany(expenseModel);
expenseModel.belongsTo(userModel);
userModel.hasMany(orderModel);
orderModel.belongsTo(userModel);
sequelize.sync()
    .then((result) => {
        app.listen(3000);
    })
    .catch(err => console.log(err));
