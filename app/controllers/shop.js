const Product = require("../models/product");
const colors = require("colors");

exports.getProducts = (req, res, next) => {
    Product.findAll()
        .then((products) => {
            res.render("shop/product-list", {
                prods: products,
                pageTitle: "All Products",
                path: "/products",
            });
        })
        .catch((err) => console.log(err.red));
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId; //we get the productId from the route parameters
    console.log("got the product: " + prodId);

    //we can also use the where condition to filter the results and to get our product
    // .findAll({ where: { id: prodId } }).then(products => {
    //   res.render("shop/product-detail", {
    //     product: products[0],
    //     pageTitle: products[0].title,
    //     path: "/products",
    //   });
    // }).catch(err => console.log(err));

    Product.findByPk(prodId)
        .then((product) => {
            res.render("shop/product-detail", {
                product: product,
                pageTitle: product.title,
                path: "/products",
            });
        })
        .catch((err) => console.log(err.red));
};

exports.getIndex = (req, res, next) => {
    Product.findAll()
        .then((products) => {
            res.render("shop/index", {
                prods: products,
                pageTitle: "Shop",
                path: "/",
            });
        })
        .catch((err) => console.log(err.red));
};

exports.getCart = (req, res, next) => {
    req.user
        .getCart()
        .then(cart => {
            console.log("got the cart: " + cart);
            return cart.getProducts()
                .then(products => {
                    res.render("shop/cart", {
                        path: "/cart",
                        pageTitle: "Your Cart",
                        products: products
                    })
                })
                .catch((err) => console.log(err));
        }).catch(err => console.log(err.red));
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    let fetchedCart;
    let newQuantity = 1;

    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({where: {id: prodId}})
        })
        .then(products => {
            let product;
            if (products.length > 0) {
                product = products[0];
            }

            if (product) {
                //here we get the old quantity (cartItem is added by sequelize)
                const oldQuantity = product.cartItem.quantity;
                newQuantity = oldQuantity + 1;
                return product;
            }

            return Product.findByPk(prodId);
        })
        .then(product => {
            //here we want to specify the quantity, because that field is not in both of the tables
            //for that we use the through (that is specified in the app.js) and pass down the quantity
            return fetchedCart.addProduct(product, {through: {quantity: newQuantity}});
        })
        .then(() => res.redirect("/cart"))
        .catch((err) => console.log(err.red));
};

exports.postDeleteCartProduct = (req, res, next) => {
    const prodId = req.body.productId;

    req.user.getCart()
        .then(cart => {
            return cart.getProducts({where: {id: prodId}})
        })
        .then(products => {
            const product = products[0];

            //here we get the cart item and remove it from the cart (we don't delete the item, we only remove it from the cart)
            return product.cartItem.destroy();
        })
        .then(() => res.redirect("/cart"))
        .catch(err => console.log(err.red));
};

exports.postOrder = (req, res, next) => {
    let fetchedCart;
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            return req.user.createOrder()
                .then(order => {
                    //for the quantity, we need to figure out how to get the quantity for each product
                    return order.addProducts(products.map(product => {
                        //here we can get the quantity from the cartItem
                        product.orderItem = {quantity: product.cartItem.quantity};
                        return product;
                    }));
                })
                .catch(err => console.log(err.red));
        })
        .then((result) => {
            return fetchedCart.setProducts(null);
        })
        .then(result => {
            res.redirect("/orders");
        })
        .catch(err => console.log(err.red));
};


exports.getOrders = (req, res, next) => {
    //here we need to include in the query the products associated to the user
    //this is eager loading
    req.user.getOrders({include: ["products"]})
        .then(orders => {
            res.render("shop/orders", {
                path: "/orders",
                pageTitle: "Your Orders",
                orders: orders
            });
        })
        .catch(err => console.log(err.red));
};