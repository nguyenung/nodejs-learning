const errorHandler = (next, message = 'Error occurred!', statusCode = 500) => {
    const error = new Error(message)
    error.statusCode = statusCode
    next(error)
}

module.exports = errorHandler