const express = require('express')
const app = express()
const port = process.env.PORT || 3000
require('dotenv').config()
require('express-async-errors')

const connectDB = require('./db/connect')

const productsRouter = require('./routes/products')

const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

app.use(express.json())

app.get('/', (request, response) => {
    response.send('<h1>STORE API</h1><a href="/api/v1/products">Show Products</a>')
})

app.use('/api/v1/products', productsRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log(`listening to port ${port}...`)
        })
    } catch (error) {
        console.log(error)
    }
}

start()
