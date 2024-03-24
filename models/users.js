const sequelize = require('../lib/sequelize');
const { DataTypes, Model } = require('sequelize');

class User extends Model {}

User.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    address: {
        type: DataTypes.JSON
    },
    additional_info: {
        type: DataTypes.JSON
    }
},{ 
    sequelize, 
    modelName: 'User' 
});

User.sync();

module.exports = { User };