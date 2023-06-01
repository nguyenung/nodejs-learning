const Product = require('./../models/product')
const helpers = require('./../utils/helpers')

exports.getProducts = (req, res, next) => {
    Product.find({userId: req.user.id})
    // .select('title price -_id')
    // .populate('userId')
    .then(products => {
        res.render('admin/products', {
            path: "/admin/products",
            products: products,
            pageTitle: "Admin - All product",
            isLoggedIn: req.session.isLoggedIn,
        })
    })
    .catch(err => {
        errorHandler(next, err.message)
    })
}

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        path: "/admin/add-product",
        pageTitle: "Add product",
        isLoggedIn: req.session.isLoggedIn,
    })
}

exports.postAddProduct = async (req, res, next) => {
    const { title, description, price } = req.body
    const image = req.file
    console.log(image)
    const userId = req.user
    // const product = new Product({
    //     title,
    //     description,
    //     imageUrl,
    //     price,
    //     userId
    // })
    // await product.save()
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
    } catch(err) {
        errorHandler(next, err.message)
    }
}

exports.doEditProduct = async (req, res, next) => {
    const productId = req.body.productId
    try {
        const {title, description, imageUrl, price} = req.body
        const updatedFields = {
            title,
            imageUrl,
            description,
            price
        }
        const updatedProduct = await Product.findByIdAndUpdate(productId, updatedFields)
        res.redirect('/admin/products')
    } catch(err) {
        errorHandler(next, err.message)
    }
}

exports.doDeleteProduct = async (req, res, next) => {
    const productId = req.body.productId
    try {
        await Product.findByIdAndRemove(productId)
        res.redirect('/admin/products')
    } catch (err) {
        errorHandler(next, err.message)
    }
}
