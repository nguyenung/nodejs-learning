const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Product.belongsTo(models.User, {foreignKey: 'userId'})
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