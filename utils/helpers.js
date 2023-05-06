const path = require('path')

const rootPath = () => {
    return path.dirname(process.mainModule.filename)
}

exports.rootPath = rootPath