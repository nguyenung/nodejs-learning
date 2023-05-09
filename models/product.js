const helpers = require('./../utils/helpers');
const fs = require('fs');
const path = require('path');

const productFilePath = path.join(
    helpers.rootPath(),
    '.data',
    'products.json'
)

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
    constructor(title, imageUrl, description, price) {
        this.title = title
        this.imageUrl = imageUrl
        this.description = description
        this.price = price
    }

    save() {
        this.id = Date.now().toString()
        getProductsFromFile(products => {
            products.push(this)
            fs.writeFile(productFilePath, JSON.stringify(products), (err) => {
                if(err) {
                    console.log(err)
                }
            })
        })
    }

    static findById(productId, cb) {
        getProductsFromFile(products => {
            const product = products.find(p => p.id === productId)
            cb(product)
        })
    }

    static fetchAll(callback) {
        getProductsFromFile(callback)
    }
}