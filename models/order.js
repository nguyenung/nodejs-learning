const mongoose = require('mongoose')

const Schema = mongoose.Schema

const OrderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    items: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: {
            type: Number,
            default: 1
        }
    }],
    totalPrice: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('Order', OrderSchema)

/* const getDb = require('./../utils/database').getDb

class Order {
    constructor(userId, items, totalPrice, id) {
        this.userId = userId
        this.items = items
        this.totalPrice = totalPrice
        this._id = id
    }

    async save() {
        const db = getDb()
        await db.collection('orders')
        .insertOne(this)
    }
}

module.exports = Order
 */