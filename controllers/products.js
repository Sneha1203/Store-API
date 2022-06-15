const { query } = require('express')
const Product = require('../models/Product')

const getAllProducts = async (request, response) => {
    const { featured, company, name, sort, fields, numericFilters } = request.query
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

    if(numericFilters) {
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte'
        }

        const regEx = /\b(<|>|<=|>=|=)\b/g
        let filters = numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-`)

        const options = ['price', 'rating']
        filters = filters.split(',').forEach((item) => {
            const [field, operator, value] = item.split('-')
            if(options.includes(field)) {
                queryObject[field] = { [operator]: Number(value) }
            }
        })
    }

    let result = Product.find(queryObject)

    if(sort) {
        const sortList = sort.split(',').join(' ')
        result = result.sort(sortList)
    } else {
        result = result.sort('createdAt')
    }

    if(fields) {
        const fieldsList = fields.split(',').join(' ')
        result = result.select(fieldsList)
    }

    const page = Number(request.query.page) || 1
    const limit = Number(request.query.limit) || 10
    const skip = (page - 1) * limit
    
    result = result.skip(skip).limit(limit)

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