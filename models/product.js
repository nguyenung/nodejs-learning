const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        static associate(models) {
            Product.belongsTo(models.User, { foreignKey: 'userId' })
            Product.belongsToMany(models.Cart, { through: models.CartItem })
            Product.belongsToMany(models.Order, { through: models.OrderItem })
        }
    }
    Product.init({
        title: DataTypes.STRING,
        description: DataTypes.STRING,
        price: DataTypes.DOUBLE,
        imageUrl: DataTypes.STRING,
        userId: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'Product',
    });
    return Product;
};