const Sequelize = require('sequelize');

const sequelize = new Sequelize('expense', 'root', 'Anurag@9839', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;