const Expense = require('../models/expense');
const sequelize = require('../utils/database');
exports.postExpenseData = async (req, res, next) => {
    let t = await sequelize.transaction();
    try {
        const amount = req.body.amount;
        const description = req.body.description;
        const category = req.body.category;

        if (!amount || !description || !category) {
            return res.status(500).json({ message: 'Missing some data' });
        }
        let data = await req.user.createExpense({ amount: amount, description: description, category: category }, { transaction: t });
        let totalExpense = Number(req.user.totalExpense) + Number(amount);
        await req.user.update({ totalExpense: totalExpense }, { transaction: t });
        await t.commit();
        return res.status(201).json(data);
    } catch (error) {
        await t.rollback();
        return res.status(500).json({ message: error });
    }
};

exports.getExpenseData = async (req, res, next) => {
    try {
        let data = await req.user.getExpenses();
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

exports.deleteExpenseData = async (req, res, next) => {
    let t = await sequelize.transaction();
    try {
        const prodId = req.params.id;
        let data = await Expense.findAll({ where: { id: prodId, userId: req.user.id } }, { transaction: t });
        let updateExpense;
        let newExpense = Number(req.user.totalExpense) - Number(data[0].amount);
        if (newExpense > 0) {
            updateExpense = newExpense;
        } else {
            updateExpense = 0;
        }
        await req.user.update({ totalExpense: updateExpense }, { transaction: t });
        await data[0].destroy({ transaction: t });
        await t.commit();
        res.status(201).json(prodId);
    } catch (error) {
        await t.rollback();
        res.status(500).json({ message: error });
    }
};