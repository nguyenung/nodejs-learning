'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        static associate(models) {
            Order.belongsTo(models.User, { foreignKey: 'userId' })
            Order.belongsToMany(models.Product, { through: models.OrderItem })
        }
    }
    Order.init({
        userId: DataTypes.INTEGER,
        totalPrice: DataTypes.FLOAT
    }, {
        sequelize,
        modelName: 'Order',
    });
    return Order;
};