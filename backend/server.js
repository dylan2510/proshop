/*
const express = require('express');
const dotenv = require('dotenv');
const products = require("./data/products");
*/

// USING ES MODULES
import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import {notFound, errorHandler} from './middleware/errorMiddleware.js';
import connectDB from './config/db.js';

// dotenv   
dotenv.config(); 

// connect to database
connectDB();

const app = express();

// accept JSON in request body
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// @Routes   Get: /
// make sure to get rid of this when in prod
/*
app.get("/", (req,res) => {
    res.send("API is running.....");
});
*/

// @Routes  Products
import productRoutes from './routes/productRoutes.js';
app.use('/api/products',productRoutes);

// @Routes Users
import userRoutes from './routes/userRoutes.js';
app.use('/api/users',userRoutes);

// @Routes Order
import orderRoutes from './routes/orderRoutes.js'
app.use('/api/orders',orderRoutes);

// @Routes Upload
import uploadRoutes from './routes/uploadRoutes.js'
app.use('/api/upload',uploadRoutes);
// make the upload folder static. __dirname is current folder.
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// serve /frontend/build as frontend static files for production
if (process.env.NODE_ENV === 'production') {

    app.use(express.static(path.join(__dirname, '/frontend/build')));

    // any other routes not defined in routes
    app.get('*', (req, res) => {
        // serve the index.html in build folder
        res.sendFile(path.resolve(__dirname,'frontend','build','index.html'));
    });

} else {
    app.get("/", (req,res) => {
        res.send("API is running.....");
    });
}

// @Routes Paypal Client Id
app.get('/api/config/paypal',(req,res) => {
    res.send(process.env.PAYPAL_CLIENT_ID);
});

// @Middleare   Error Handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on ${process.env.NODE_ENV} port ${PORT}`);
});