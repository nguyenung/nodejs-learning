const { getDb } = require('./../utils/database')
const { ObjectId } = require('mongodb')
const helpers = require('./../utils/helpers')

class Product {
    constructor(title, description, imageUrl, price, userId) {
        this.title = title
        this.description = description
        this.imageUrl = imageUrl
        this.price = parseFloat(price)
        this.userId = userId
    }

    async save() {
        const db = getDb()
        try {
            return await db.collection('products').insertOne(this)
        } catch (error) {
            helpers.errorHandle(error)
        }
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

    static findById(id) {
        const db = getDb()
        const objectId = new ObjectId(id)
        return db.collection('products')
            .findOne({ _id: objectId })
            .then((product) => {
                return product
            })
            .catch(err => helpers.handleError(err))
    }

    static updateProductById(id, updatedFields) {
        const db = getDb()
        const objectId = new ObjectId(id)
        return db.collection('products')
            .updateOne({ _id: objectId }, { $set: updatedFields })
            .then((result) => {
                return result
            })
            .catch(err => helpers.handleError(err))
    }

    static async deleteProductById(id) {
        const db = getDb()
        const collection = db.collection('products')
        const objectId = new ObjectId(id)
        try {
            const result = await collection.deleteOne({_id: objectId})
            console.log(`${result.deletedCount} document(s) deleted.`);
        } catch (err) {
            console.log(err)
        }
    }
}

module.exports = Product
