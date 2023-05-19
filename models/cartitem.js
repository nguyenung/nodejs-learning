'use strict';
const {
	Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class CartItem extends Model {
		static associate(models) {
			CartItem.belongsTo(models.Cart, {foreignKey: 'cartId'})
			CartItem.belongsTo(models.Product, { foreignKey: 'productId' })
		}
	}
	CartItem.init({
		productId: DataTypes.INTEGER,
		cartId: DataTypes.INTEGER,
		quantity: DataTypes.INTEGER
	}, {
		sequelize,
		modelName: 'CartItem',
	});
	return CartItem;
};