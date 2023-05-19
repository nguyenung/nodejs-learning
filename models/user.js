'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.hasMany(models.Product, { foreignKey: 'userId' })
            User.hasOne(models.Cart, { foreignKey: 'userId' })
        }
    }
    User.init({
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'User',
    });
    return User;
};
