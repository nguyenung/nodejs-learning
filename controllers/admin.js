const { Product } = require('./../models');
const helpers = require('./../utils/helpers')

exports.getProducts = (req, res, next) => {
    Product.findAll({
        order: [['id', 'desc']]
    })
    .then(products => {
        res.render('admin/products', {
            path: "/admin/products",
            products: products,
            pageTitle: "Admin - All product"
        })
    })
    .catch(err => {
        helpers.errorHandle(err)
    })
}

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        path: "/admin/add-product",
        pageTitle: "Add product"
    })
}

exports.postAddProduct = async (req, res, next) => {
    await Product.create({
        title: req.body.title,
        imageUrl: req.body.imageUrl,
        description: req.body.description,
        price: req.body.price,
    })
        .then(result => {console.log(result.toJSON())})
        .catch(err => {console.log(err)})
    
    res.redirect('/')
}

exports.getEditProduct = (req, res, next) => {
    const productId = req.params.productId
    Product.findByPk(productId)
    .then(product => {
        res.render('admin/edit-product', {
            path: "/admin/edit-product",
            pageTitle: "Edit product",
            editMode: true,
            product: product,
        })
    })
    .catch(err => {
        helpers.errorHandle(err)
    })
}

exports.doEditProduct = async (req, res, next) => {
    const productId = req.body.productId
    try {
        const product = await Product.findByPk(productId)
        if (product) {
            await product.update(
                {
                    title: req.body.title,
                    imageUrl: req.body.imageUrl,
                    description: req.body.description,
                    price: req.body.price,
                }
            )
        } else {
            throw new Error('Record not found')
        }
        res.redirect('/admin/products')
    } catch(err) {
        console.error('Error updating record:', error);
    }
}

exports.doDeleteProduct = async (req, res, next) => {
    const productId = req.body.productId
    const product = await Product.findByPk(productId)
    if (product) {
        await product.destroy()
    } else {
        throw new Error('Record not found')
    }
    res.redirect('/admin/products')
}
