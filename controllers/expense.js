const Expense = require('../models/expense');

exports.postExpenseData = async (req, res, next) => {
    try {
        const amount = req.body.amount;
        const description = req.body.description;
        const category = req.body.category;

        if (!amount || !description || !category) {
            res.status(500).json({ message: 'Missing some data' });
        }
        let data = await Expense.create({ amount: amount, description: description, category: category });
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

exports.getExpenseData = async (req, res, next) => {
    try {
        let data = await Expense.findAll();
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

exports.deleteExpenseData = async (req, res, next) => {
    try {
        const prodId = req.params.id;
        await Expense.destroy({ where: { id: prodId } });
        res.status(201).json(prodId);
    } catch (error) {
        res.status(500).json({ message: error });
    }
};