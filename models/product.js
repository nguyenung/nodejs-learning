const helpers = require('./../utils/helpers');
const fs = require('fs');
const path = require('path');

module.exports = class Product {
    constructor(t) {
        this.title = t
    }

    save() {
        const p = path.join(
            helpers.rootPath(),
            'data',
            'products.json'
        )
        fs.readFile(p, (error, fileContent) => {
            let products = []
            if (!error) {
                products = JSON.parse(fileContent)
            }
            products.push(this)
            fs.writeFile(p, JSON.stringify(products), (err) => {
                if(error) {
                    console.log(error)
                }
            })
        })
    }

    static fetchAll(callback) {
        const p = path.join(
            helpers.rootPath(),
            'data',
            'products.json'
        )
        fs.readFile(p, (error, fileContent) => {
            if (!error) {
                return callback(JSON.parse(fileContent))
            }
            return callback([])
        })
    }
}