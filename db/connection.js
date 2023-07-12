const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('thoughts', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = sequelize