const Expense = require('../models/expense');
const DownloadList = require('../models/downloadList');
const sequelize = require('../utils/database');
const UserServices = require('../services/userservices');
const S3Services = require('../services/S3Services');
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
        let data = await UserServices.getExpenses(req);
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


exports.downloadExpenses = async (req, res, next) => {
    try {
        if (!req.user.ispremiumuser) {
            return res.status(401).json({ message: 'User is not a premium User' })
        }
        const expenses = await UserServices.getExpenses(req, {
            attributes: ['amount', 'description', 'category']
        });
        const expenseStringify = JSON.stringify(expenses);
        const userId = req.user.id;
        const filename = `Expense${userId}/${new Date()}.txt`;
        const fileUrl = await S3Services.uploadToS3(expenseStringify, filename);
        let newDate = new Date();
        await req.user.createDownloadList({ url: fileUrl, date: newDate });
        res.status(201).json({ fileUrl: fileUrl });
    } catch (error) {
        res.status(500).json({ message: 'Downloading is not working' });
    }
}

exports.listOfDownloads = async (req, res, next) => {
    try {
        if (!req.user.ispremiumuser) {
            return res.status(401).json({ message: 'User is not a premium User' })
        }
        let listOfDownloadsInfo = await DownloadList.findAll({
            attributes: ['date', 'url'],
        });
        res.status(201).json(listOfDownloadsInfo);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}