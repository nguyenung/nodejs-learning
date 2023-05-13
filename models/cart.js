const helpers = require('./../utils/helpers')
const path = require('path');
const fs = require('fs');

/**
 * The absolute file path for cart data file
 * @constant {string}
 */
const cartFilePath = path.join(
    helpers.rootPath(),
    '.data',
    'cart.json'
)

module.exports = class Cart {
    /**
     * Add a product to the cart.
     *
     * @param {string} productId - The ID of the product to add.
     * @param {number} productPrice - The price of the product to add.
     * @returns {void}
     */
    static addProduct(productId, productPrice) {
        //fetch current list product
        fs.readFile(cartFilePath, (err, fileContent) => {
            let cart = {products: [], totalPrice: 0}
            if(!err) {
                if (helpers.isValidJSON(fileContent)) {
                    cart = JSON.parse(fileContent)
                }
                //analyze productId
                const existingProductIndex = cart.products.findIndex(product => productId === product.id)
                const existingProduct = cart.products[existingProductIndex]
                let updatedProduct
                if(existingProduct) {
                    //Update quantity
                    updatedProduct = {...existingProduct}
                    updatedProduct.quantity += 1
                    cart.products = [...cart.products]
                    cart.products[existingProductIndex] = updatedProduct
                } else {
                    //Add new with quantity = 1
                    updatedProduct = {id: productId, quantity: 1}
                    cart.products = [...cart.products, updatedProduct]
                }
                cart.totalPrice += +productPrice
            } else {
                console.log('Error when read file: ',err)
            }
            fs.writeFile(cartFilePath, JSON.stringify(cart), (err) => {
                if (err) {
                    console.log('Error when write file: ',err)
                }
            })
        })
    }

    /**
     * Remove a product from the cart.
     *
     * @param {string} productId - The ID of the product to remove.
     * @param {number} productPrice - The price of the product to remove.
     * @returns {void}
     */
    static deleteProduct(productId, price) {
        fs.readFile(cartFilePath, (err, fileContent) => {
            if (!err) {
                if (helpers.isValidJSON(fileContent)) {
                    const cart = JSON.parse(fileContent)
                    const updatedCard = {...cart}
                    const existingProduct = updatedCard.products.find(product => product.id === productId)

                    updatedCard.totalPrice -= existingProduct.quantity * price
                    updatedCard.products = updatedCard.products.filter(
                        product => product.id != productId
                    )

                    fs.writeFile(cartFilePath, JSON.stringify(updatedCard), (err) => {
                        if (err) {
                            console.log('Error when write file: ',err)
                        }
                    })
                }
                
            }
        })
    }

    /**
     * Fetch cart data from data file.
     *
     * @param {function} cb - The callback function to invoke with the cart data.
     * @returns {void}
     */
    static fetchCartData(cb) {
        fs.readFile(cartFilePath, (err, fileContent) => {
            let cart = {products: [], totalPrice: 0}
            if (!err) {
                if (helpers.isValidJSON(fileContent)) {
                    cart = JSON.parse(fileContent)
                }
                cb(cart)
            } else {
                cb([])
            }
        })
    }
};
