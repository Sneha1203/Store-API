const errorHandler = async(err, request, response, next) => {
    console.log(err)
    return response.status(500).json({ mag: 'Something went wrong, try again later....'})
}

module.exports = errorHandler