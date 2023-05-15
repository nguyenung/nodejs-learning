const Product = require('./../models/product')
const helpers = require('./../utils/helpers')

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
    .then(([rows, fields]) => {
        res.render('admin/products', {
            path: "/admin/products",
            products: rows,
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
    const newProduct = await Product.create({
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
    Product.findById(productId)
    .then(([rows]) => {
        const product = rows.length > 0 ? rows[0] : null;
        if (!product) {
            return res.redirect('/')
        }
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

const saveProduct = (productId, updateData) => {
    const updatedProduct = new Product(
        productId,
        updateData.title,
        updateData.imageUrl,
        updateData.description,
        updateData.price,
    )
    return updatedProduct.save()
}

exports.doEditProduct = (req, res, next) => {
    const productId = req.body.productId

    Product.findById(productId)
    .then(([rows]) => {
        const product = rows.length > 0 ? rows[0] : null;
        if (!product) {
            throw new Error('Product not found.');
        }
        return saveProduct(productId, req.body)
    })
    .then(() => {
        res.redirect('/admin/products')
    })
    .catch(err => {
        helpers.errorHandle(err)
    })
}

exports.doDeleteProduct = (req, res, next) => {
    const productId = req.body.productId
    Product.findById(productId)
    .then(([rows]) => {
        const product = rows.length > 0 ? rows[0] : null;
        if (!product) {
            throw new Error(`Product not found: ${productId}`)
        }
        return Product.delete(product.id)
    })
    .then(() => {
        res.redirect('/admin/products')
    })
    .catch(err => {
        helpers.errorHandle(err)
    })
}
