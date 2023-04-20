const express = require('express');
const expenseRoutes = require('../controllers/expense');
const route = express.Router();

route.post('/add-expense', expenseRoutes.postExpenseData);
route.get('/get-expense', expenseRoutes.getExpenseData);
route.delete('/delete-expense/:id', expenseRoutes.deleteExpenseData);
module.exports = route;