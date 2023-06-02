const Product = require('./../models/product')
const errorHandler = require('./../utils/error-handler')
const fs = require('fs')
const path = require('path')
const getPaginatedResults = require('../utils/paginator')

exports.getProducts = async (req, res, next) => {
    const paginationData = await getPaginatedResults(req, res, Product, { userId: req.user.id })

    res.render('admin/products', {
        path: '/admin/products',
        pageTitle: 'Admin - All product',
        isLoggedIn: req.session.isLoggedIn,
        paginationData
    })
}

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        path: '/admin/add-product',
        pageTitle: 'Add product',
        isLoggedIn: req.session.isLoggedIn,
    })
}

exports.postAddProduct = async (req, res, next) => {
    const { title, description, price } = req.body
    const userId = req.user
    const initData = {
        title,
        description,
        price,
        userId
    }
    const image = req.file
    if (image) {
        const imageName = path.basename(image.path)
        fs.rename(image.path, `public/uploads/${imageName}`, (err) => {
            if (err) {
                console.error('Error moving file:', err)
            } else {
                console.log('File moved successfully')
            }
        })
        initData.imageUrl = image.path.replace(/^.tmp/, 'uploads')
    }
    const product = new Product(initData)
    await product.save()
    res.redirect('/')
}

exports.getEditProduct = async (req, res, next) => {
    const productId = req.params.productId
    try {
        const product = await Product.findOne({
            _id: productId,
            userId: req.user._id
        })
        if (!product) {
            throw new Error('Product not found.')
        }
        res.render('admin/edit-product', {
            path: '/admin/edit-product',
            pageTitle: 'Edit product',
            editMode: true,
            product: product,
            isLoggedIn: req.session.isLoggedIn,
        })
    } catch (err) {
        errorHandler(next, err.message)
    }
}

exports.doEditProduct = async (req, res, next) => {
    const productId = req.body.productId
    try {
        const { title, description, price } = req.body
        const updatedFields = {
            title,
            description,
            price
        }
        const image = req.file
        const product = await Product.findById(productId)
        let currentImagePath = product.imageUrl
        let needDeleteCurrentImage = false
        if (image) {
            currentImagePath = path.join('public', currentImagePath)

            const imageName = path.basename(image.path)
            fs.rename(image.path, `public/uploads/${imageName}`, (err) => {
                if (err) {
                    console.error('Error moving file:', err)
                } else {
                    console.log('File moved successfully')
                }
            })

            updatedFields.imageUrl = image.path.replace(/^.tmp/, 'uploads')
            needDeleteCurrentImage = true
        }

        await Product.findByIdAndUpdate(productId, updatedFields)
        needDeleteCurrentImage && fs.unlink(currentImagePath, (err) => {
            if (err) {
                console.error('Error deleting file:', err)
            } else {
                console.log('File deleted successfully.')
            }
        })
        res.redirect('/admin/products')
    } catch (err) {
        console.log(err)
        errorHandler(next, err.message)
    }
}

exports.doDeleteProduct = async (req, res, next) => {
    const productId = req.body.productId
    try {
        const product = await Product.findById(productId)
        const currentImagePath = path.join('public', product.imageUrl)
        await Product.findByIdAndRemove(productId)
        fs.unlink(currentImagePath, (err) => {
            if (err) {
                console.error('Error deleting file:', err)
            } else {
                console.log('File deleted successfully.')
            }
        })
        res.redirect('/admin/products')
    } catch (err) {
        errorHandler(next, err.message)
    }
}
