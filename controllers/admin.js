const Product = require('./../models/product');

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('admin/products', {
            path: "/admin/products",
            products: products,
            pageTitle: "Admin - All product"
        })
    })
}

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        path: "/admin/add-product",
        pageTitle: "Add product"
    })
}

exports.postAddProduct = (req, res, next) => {
    const product = new Product(
        null,
        req.body.title,
        req.body.imageUrl,
        req.body.description,
        req.body.price,
    )
    product.save()
    res.redirect('/')
}

exports.getEditProduct = (req, res, next) => {
    const productId = req.params.productId
    Product.findById(productId, (product) => {
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
}

exports.doEditProduct = (req, res, next) => {
    const productId = req.body.productId
    Product.findById(productId, product => {
        if ( !product ) {
            throw new Error("Product not found.");
        }
        const updatedProduct = new Product(
            productId,
            req.body.title,
            req.body.imageUrl,
            req.body.description,
            req.body.price,
        )
        
        updatedProduct.save()
        res.redirect('/admin/products')
    })
}

exports.doDeleteProduct = (req, res, next) => {
    const productId = req.body.productId
    Product.findById(productId, product => {
        if (!product) {
            throw new Error(`Product not found: ${productId}`)
        }
        Product.delete(productId)
        res.redirect('/admin/products')
    })
}
