require('dotenv').config();

const { connect } = require('mongoose');
const connectDB = require('./db/connect')
const Product = require('./models/Product')

const productsJSON = require('./products.json')

const start = async() => {
    try{
        await connectDB(process.env.MONGO_URI)
        await Product.deleteMany()
        await Product.create(productsJSON)
        console.log('SUCCESS!')
        process.exit(0)
    } catch(error) {
        console.log(error)
        process.exit(1)
    }
}
start()