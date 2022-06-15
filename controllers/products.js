const { query } = require('express')
const Product = require('../models/Product')

const getAllProducts = async (request, response) => {
    const { featured, company, name, sort } = request.query
    const queryObject = {}

    if(featured) {
        queryObject.featured = featured === 'true' ? true : false
    }

    if(company) {
        queryObject.company = company
    }

    if(name) {
        queryObject.name = name // checks for exact name
        queryObject.name = { $regex: name, $options: 'i'} // checks all occurrances of name(query) in name of the products
    }

    let result = Product.find(queryObject)

    if(sort) {
        const sortList = sort.split(',').join(' ')
        result = result.sort(sortList)
    } else {
        result = result.sort('createdAt')
    }
    // console.log(queryObject)
    const products = await result
    response.status(200).json({ msg: products, nbHits: products.length })
}

const getAllProductsStatic = async (request, response) => {
    // throw new Error('testing async errors')
    const products = await Product.find({}).sort('-name')
    response.status(200).json({ msg: products, nbHits: products.length })
}

module.exports = {
    getAllProducts,
    getAllProductsStatic
}