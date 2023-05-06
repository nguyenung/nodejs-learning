const helpers = require('./../utils/helpers');
const fs = require('fs');
const path = require('path');

const productFilePath = path.join(
    helpers.rootPath(),
    'data',
    'products.json'
)

const getProductsFromFile = (callback) => {
    fs.readFile(productFilePath, (error, fileContent) => {
        if (!error) {
            return callback(JSON.parse(fileContent))
        } else {
            return callback([])
        }
    })
}

module.exports = class Product {
    constructor(t) {
        this.title = t
    }

    save() {
        getProductsFromFile(products => {
            products.push(this)
            fs.writeFile(productFilePath, JSON.stringify(products), (err) => {
                if(err) {
                    console.log(err)
                }
            })
        })
    }

    static fetchAll(callback) {
        getProductsFromFile(callback)
    }
}