const { getDb } = require('./../utils/database')
const helpers = require('./../utils/helpers');

class Product {
    constructor(title, description, imageUrl, price) {
        this.title = title
        this.description = description
        this.imageUrl = imageUrl
        this.price = price
    }

    save() {
        const db = getDb()
        return db.collection('products').insertOne(this)
            .then((result) => {
                console.log(result)
            }).catch(err => helpers.handleError(err))
    }

    static fetchAll() {
        const db = getDb()
        return db.collection('products')
        .find()
        .toArray()
        .then((products) => {
            return products
        })
        .catch(err => helpers.handleError(err))
    }
}

module.exports = Product
