'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Cart extends Model {
        static associate(models) {
            Cart.belongsTo(models.User, { foreignKey: 'userId' })
            Cart.belongsToMany(models.Product, { through: models.CartItem })
        }
    }
    Cart.init({
        totalPrice: DataTypes.FLOAT,
        userId: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Cart',
    });
    return Cart;
};