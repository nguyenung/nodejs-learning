const getDb = require('./../utils/database').getDb
const mongodb = require('mongodb')

const ObjectId = mongodb.ObjectId

class User {
    constructor(name, email, password, id, cart) {
        this.name = name
        this.email = email
        this.password = password
        this._id = id
        this.cart = cart
    }

    async save() {
        const db = getDb()
        return await db.collection('users').insertOne(this)
    }

    static async findById(id) {
        const db = getDb()
        return await db.collection('users').findOne({ _id: new ObjectId(id) })
    }

    addToCart(product) {
        if(!this.cart) {
            this.cart = {items: [], totalPrice: 0}
        }
        const existingPrdIndex = this.cart.items.findIndex(p => p.productId.equals(product._id))
        const existingPrd = this.cart.items.find(p => p.productId.equals(product._id))
        let updatedCart = this.cart
        if (existingPrdIndex === -1) {
            updatedCart.items.push({productId: product._id, quantity: 1})
        } else {
            const updatedPrd = {
              ...existingPrd,
                quantity: existingPrd.quantity + 1
            }
            updatedCart.items[existingPrdIndex] = updatedPrd
        }
        updatedCart.totalPrice = updatedCart.totalPrice + product.price
        const db = getDb()
        db.collection('users').updateOne(
            {_id: this._id},
            {$set: {cart: updatedCart}}
        )
    }

    async getCart() {
        if(!this.cart) {
            this.cart = {items: [], totalPrice: 0}
        }
        const cartItems = this.cart.items
        const productIds = cartItems.map(p => p.productId)

        const db = getDb()
        const cartProducts = await db.collection('products')
        .find({_id: {$in: productIds}})
        .toArray()
        .then().catch(err => console.log(err))

        const items = cartItems.map(item => {
            return {
                product: cartProducts.find(p => p._id.equals(item.productId)),
                quantity: item.quantity
            }
        })
        return {
            items: items,
            totalPrice: this.cart.totalPrice
        }
    }

    async removeFromCart(product) {
        if(!this.cart) {
            this.cart = {items: [], totalPrice: 0}
        }
        const cart = this.cart
        const existingPrdIndex = this.cart.items.findIndex(p => p.productId.equals(product._id))
        const existingPrd = this.cart.items.find(p => p.productId.equals(product._id))
        if (existingPrdIndex != -1) {
            cart.totalPrice -= product.price * existingPrd.quantity
            cart.items.splice(existingPrdIndex, 1)
        }
        const db = getDb()
        await db.collection('users').updateOne(
            {_id: this._id},
            {$set: {cart: cart}}
        )
    }
}

module.exports = User