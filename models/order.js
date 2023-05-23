const getDb = require('./../utils/database').getDb

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
