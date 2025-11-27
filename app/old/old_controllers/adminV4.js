const Product = require("../models/product");

//here we are exporting a function that will handle the request to get the add product page
exports.getAddProduct = (req, res, next) => {
    res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editing: false,
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;

    //if we want to get the user object, we need to access the dataValues object, it will have the object we are looking for
    console.log("Created product is associated to: ", req.user.dataValues);

    //this createProduct function is created automatically after we create a relationship between the user and the products
    req.user.createProduct({
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: description
    }).then((result) => {
        console.log("created a product!");
        res.redirect("products");
    })
        .catch((err) => {
            console.log(err.red);
        });
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    console.log("Is edit mode: ", editMode);

    if (!editMode) {
        return res.redirect("/");
    }

    const prodId = req.params.productId;

    //we can access the users products like this, we can also get the product by filtering by the prodId
    req.user
        .getProducts({where: {id: prodId}})
        .then((products) => {
            const product = products[0];

            if (!product) return res.redirect("/");

            res.render("admin/edit-product", {
                pageTitle: "Edit Product",
                path: "/admin/edit-product",
                editing: editMode,
                product: product,
            });
        })
        .catch((err) => console.log(err.red));
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;
    const updatedPrice = req.body.price;

    Product.findByPk(prodId)
        .then((product) => {
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.imageUrl = updatedImageUrl;
            product.description = updatedDesc;

            //this is another method provided by sequelize
            return product.save();
        })
        .then((result) => {
            console.log("updated a product!");
            res.redirect("/admin/products");
        })
        .catch(err => console.log(err.red));
};

exports.getProducts = (req, res, next) => {
    req.user
        .getProducts()
        .then((products) => {
            res.render("admin/products", {
                prods: products,
                pageTitle: "Admin Products",
                path: "/admin/products",
            });
        })
        .catch((err) => console.log(err.red));
};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;

    Product.findByPk(prodId)
        .then((product) => {
            return product.destroy();
        })
        .then((result) => {
            console.log("deleted a product!");
            res.redirect("/admin/products");
        })
        .catch((err) => console.log(err.red));
    res.redirect("/admin/products");
};
