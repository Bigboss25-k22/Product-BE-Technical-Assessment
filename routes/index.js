const express = require('express');
const productRouter = require("./productRoutes");
const categoryRoutes = require('./categoryRoutes');
const orderRoutes = require('./oderController');
const paymentRoutes = require('./paymentRoutes');

function route(app) {

    app.use("/api/products", productRouter);
    app.use('/api/categories', categoryRoutes);
    app.use('/api/orders', orderRoutes);
    app.use('/api/payments', paymentRoutes);
}

module.exports = route;
