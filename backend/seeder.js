import mongoose from 'mongoose';
import dotenv from 'dotenv';
import users from './data/user.js';
import products from './data/products.js';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Order from './models/orderModel.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importData = async() => {
    try {
        // Clear the database
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        // Seed Users, get created admin user id
        const createdUsers = await User.insertMany(users);
        const adminUser = await createdUsers[0]._id;

        // add admin user to all product
        const sampleProducts = products.map(product => {
            return {...product, user: adminUser }
        });

        // seed Products
        await Product.insertMany(sampleProducts);

        console.log(`Data imported !!`);

        // exit from process
        process.exit();
    }
    catch (error) {
        console.log(`${error}`);
        // exit from process
        process.exit(1);
    }
};


const destroyData = async() => {
    try {
        // Clear the database
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        console.log(`Data deleted !!`);

        // exit from process
        process.exit();
    }
    catch (error) {
        console.log(`${error}`);
        // exit from process
        process.exit(1);
    }
};


// cmd: node backend/seeder -d
// note that command must be call from the location where .env file is
// d is passed in as process.argv[2]

if (process.argv[2] === "-d") {
    destroyData();
}
else {
    importData();
}