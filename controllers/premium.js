const User = require('../models/user');
const Expense = require('../models/expense');
const sequelize = require('../utils/database');
module.exports.getLeaderboard = async (req, res, next) => {
    try {
        let leaderBoardOfAllUsers = await User.findAll({
            attributes: ['name', [sequelize.fn('sum', sequelize.col('expenses.amount')), 'totalExpense']],
            include: [
                {
                    model: Expense,
                    attributes: []
                }
            ],
            group: ['id'],
            order: [['totalExpense', 'DESC']]
        });
        res.status(200).json(leaderBoardOfAllUsers);
    } catch (error) {
        res.status(403).json({ message: 'Something went wrong', error: error });
    }
}