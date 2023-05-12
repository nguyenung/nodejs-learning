const helpers = require('./../utils/helpers')
const path = require('path');
const fs = require('fs');

const cartFilePath = path.join(
    helpers.rootPath(),
    '.data',
    'cart.json'
)

module.exports = class Cart {
    static addProduct(productId, productPrice) {
        //fetch current list product
        fs.readFile(cartFilePath, (err, fileContent) => {
            let cart = {products: [], totalPrice: 0}
            if(!err) {
                if (helpers.isValidJSON(fileContent)) {
                    cart = JSON.parse(fileContent)
                    console.log(cart.products[0])
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
                    cart.totalPrice += productPrice
                    console.log(cart)
                }
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
};
