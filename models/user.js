const mongoose = require('mongoose')
const Order = require('./order');

const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: true
    },
    cart: {
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
    }
})

userSchema.methods.addToCart = async function (product) {
    if (!this.cart) {
        this.cart = { items: [], totalPrice: 0 }
    }
    const existingPrdIndex = this.cart.items.findIndex(p => p.productId.equals(product._id))
    let updatedCart = this.cart
    if (existingPrdIndex === -1) {
        updatedCart.items.push({ productId: product._id, quantity: 1 })
    } else {
        updatedCart.items[existingPrdIndex].quantity += 1
    }
    updatedCart.totalPrice = updatedCart.totalPrice + product.price
    this.cart = updatedCart
    await this.save()
}

userSchema.methods.removeFromCart = async function (product) {
    if (!this.cart) {
        this.cart = { items: [], totalPrice: 0 }
    }

    const updatedCart = this.cart
    const existingPrdIndex = this.cart.items.findIndex(p => p.productId.equals(product._id))
    const existingPrd = this.cart.items.find(p => p.productId.equals(product._id))

    if (existingPrdIndex != -1) {
        updatedCart.totalPrice -= product.price * existingPrd.quantity
        updatedCart.items.splice(existingPrdIndex, 1)
    }
    this.cart = updatedCart
    await this.save()
}

userSchema.methods.getOrders = async function () {
    try {
        const orders = await Order.find({ userId: this._id }).populate('items.productId');
        return orders;
    } catch (error) {
        console.error('Error retrieving user orders:', error);
        throw error;
    }
}

userSchema.methods.createOrder = async function () {
    const newOrder = new Order({
        userId: this,
        items: this.cart.items,
        totalPrice: this.cart.totalPrice
    })
    await newOrder.save()
    this.cart = { items: [], totalPrice: 0 }
    await this.save()
}

module.exports = mongoose.model('User', userSchema)

/* const getDb = require('./../utils/database').getDb
const mongodb = require('mongodb')
const Order = require('./order');

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

    async getOrders() {
        const db = getDb()
        const orders = await db.collection('orders')
        .find({ userId: this._id })
        .toArray()
        
        let returnOrders = []
        let productIds = []

        if (orders.length > 0) {
            orders.forEach(order => {
                if (order.items.length > 0) {
                    order.items.forEach(item => {
                        productIds.push(item.productId)
                    })
                }
            })
            
            const allOrderProducts = await db.collection('products')
                .find({_id: {$in: productIds}})
                .toArray()
                .then().catch(err => console.log(err))
            
            orders.forEach(order => {
                returnOrders.push({
                    _id: order._id,
                    items: order.items.map(item => {
                        const product = allOrderProducts.find(p => p._id.equals(item.productId))
                        if (product) {
                            return {
                                product: product,
                                quantity: item.quantity
                            }
                        }
                    }),
                    totalPrice: order.totalPrice
                })
            })
        }
        return returnOrders
    }

    async createOrder() {
        const db = getDb()
        const cart = this.cart
        if (cart.items && cart.items.length > 0) {
            const newOrderId = new ObjectId()
            const order = new Order(this._id, cart.items, cart.totalPrice, newOrderId)
            await order.save()
            const newCart = {items: [], totalPrice: 0}
            await db.collection('users').updateOne(
                {_id: this._id},
                {$set: {cart: newCart}}
            )
        }
    }
}

module.exports = User */