const helpers = require('./../utils/helpers');
const fs = require('fs');
const path = require('path');
const Cart = require('./cart');

/**
 * The absolute file path for the products data file.
 *
 * @constant {string}
 */
const productFilePath = path.join(
    helpers.rootPath(),
    '.data',
    'products.json'
)

/**
 * Read products from a file and invoke a callback with the parsed data.
 *
 * @param {function} callback - The callback function to invoke with the parsed data.
 * @returns {void}
 */
const getProductsFromFile = (callback) => {
    fs.readFile(productFilePath, (error, fileContent) => {
        if (!error) {
            if (helpers.isValidJSON(fileContent)) {
                return callback(JSON.parse(fileContent))
            } else {
                return callback([])
            }
        } else {
            return callback([])
        }
    })
}

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
        getProductsFromFile(products => {
            if (this.id) {
                const existingProductIndex = products.findIndex(product => product.id === this.id)
                const updatedProducts = [...products]
                updatedProducts[existingProductIndex] = this

                fs.writeFile(productFilePath, JSON.stringify(updatedProducts), (err) => {
                    if(err) {
                        console.log(err)
                    }
                })
            } else {
                this.id = Date.now().toString()
                products.push(this)
                
                fs.writeFile(productFilePath, JSON.stringify(products), (err) => {
                    if(err) {
                        console.log(err)
                    }
                })
            }
        })
    }

    /**
     * Find a product by ID.
     *
     * @param {string} productId - The ID of the product to find.
     * @param {function} cb - The callback function to invoke with the found product.
     * @returns {void}
     */
    static findById(productId, cb) {
        getProductsFromFile(products => {
            const product = products.find(p => p.id === productId)
            cb(product)
        })
    }

    /**
     * Fetch all product from data file.
     *
     * @param {function} cb - The callback function to invoke with the found products.
     * @returns {void}
     */
    static fetchAll(callback) {
        getProductsFromFile(callback)
    }
    
    /**
     * Delete a product by ID.
     *
     * @param {string} productId - The ID of the product to delete.
     * @returns {void}
     */
    static delete(productId) {
        getProductsFromFile(products => {
            const productToDelete = products.find(product => product.id === productId)
            const updatedProducts = products.filter(
                product => product.id !== productId
            )

            fs.writeFile(productFilePath, JSON.stringify(updatedProducts), (err) => {
                if (err) {
                    console.log('err write file when delete: ', err)
                } else {
                    //Delete in cart
                    Cart.deleteProduct(productId, productToDelete.price)
                }
            })
        })
    }
}