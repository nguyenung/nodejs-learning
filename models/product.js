const helpers = require('./../utils/helpers');
const fs = require('fs');
const path = require('path');
const Cart = require('./cart');
const db = require('./../utils/database')

/**
 * The table name
 *
 * @constant {string}
 */
const tableName = 'products'

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id
        this.title = title
        this.imageUrl = imageUrl
        this.description = description
        this.price = price
    }

    /**
     * Save the product data.
     *
     * @returns {void}
     */
    save() {
        const { title, description, imageUrl, price } = this
        const values = [title, description, imageUrl, price]
        let query
        if (this.id) {
            const existingProduct = Product.findById(this.id)
            if (!existingProduct) {
                throw new Error("Product not found.")
            }
            values.push(this.id)
            query = `UPDATE ${tableName} SET title = ?, description = ?, imageUrl = ?, price = ? WHERE id = ?`
        } else {
            query = `INSERT INTO ${tableName} (title, description, imageUrl, price) VALUES (?, ?, ?, ?)`
        }
        return db.query(query, values)
    }

    /**
     * Find a product by ID.
     *
     * @param {string} productId - The ID of the product to find.
     * @param {function} cb - The callback function to invoke with the found product.
     * @returns {void}
     */
    static findById(productId) {
        const query = `SELECT * FROM ${tableName} WHERE id = ?`
        const params = [productId]
        return db.query(query, params)
    }

    /**
     * Fetch all product from database
     *
     * @returns {void}
     */
    static fetchAll() {
        return db.query('SELECT * FROM products')
    }
    
    /**
     * Delete a product by ID.
     *
     * @param {string} productId - The ID of the product to delete.
     * @returns {void}
     */
    static delete(productId) {
        const query = `DELETE FROM ${tableName} WHERE id = ?`
        const params = [productId]
        return db.query(query, params)
    }
}