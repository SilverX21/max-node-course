const Product = require("../models/product");
const Order = require("../models/order");
const colors = require("colors");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      console.log(products);
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;

  //mongoose will pick up the string Id and convert it automatically
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items;
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user,
        },
        products: products,
      });
      return order.save();
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;

  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return next(new Error("No order found"));
      }

      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error("Unauthorized"));
      }

      const invoiceName = `invoice-${orderId}.pdf`;
      const invoicePath = path.join("data", "invoices", invoiceName);

      const pdfDoc = new PDFDocument();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `inline; filename="${invoiceName}"`);

      //here we start a writing stream
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);

      //here we are writing to the document
      pdfDoc.fontSize(26).text("Invoice", {
        underline: true,
      });

      pdfDoc.text("------------------------------------");

      let totalPrice = 0;
      order.products.forEach((prod) => {
        totalPrice += +prod.quantity * prod.product.price;

        pdfDoc
          .fontSize(14)
          .text(
            prod.product.title +
              " - " +
              prod.quantity +
              " x " +
              "€" +
              prod.product.price
          );
      });

      pdfDoc.text("------------------------------------");
      pdfDoc.fontSize(20).text(`Total price: ${totalPrice}€`);

      //here we close the stream and the response will be sent
      pdfDoc.end();

      //this here will read the data into the memory and that might not be a good practice, because we can overflow the memory of the server
      // fs.readFile(invoicePath, (err, data) => {
      //     if (err)
      //         return next(err);
      //
      //     //we can set these headers so the browser can handle the best way with the file we are providing
      //     res.setHeader("Content-Type", "application/pdf");
      //     //this header will say to the browser that it will be opened in the browser with the name that we are providing
      //     res.setHeader("Content-Disposition", `inline; filename="${invoiceName}"`);
      //     res.send(data);
      // });

      //we must stream the data, this way it's better for the memory and the server
      //const file = fs.createReadStream(invoicePath);
      //res.setHeader("Content-Type", "application/pdf");
      //res.setHeader("Content-Disposition", `inline; filename="${invoiceName}"`);

      //here we are piping the stream into the response, this way we can send in the response as a stream
      //basically, it will send it step by step, because the stream will be read by chunks
      //file.pipe(res);
    })
    .catch((err) => {
      next(err);
    });
};
