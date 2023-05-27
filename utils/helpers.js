const path = require('path')

const rootPath = () => {
    return path.dirname(process.mainModule.filename)
}

const isValidJSON = (str) => {
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
}

const errorHandle = (error) => {
    console.log(`Error: `, error)
}

exports.rootPath = rootPath
exports.isValidJSON = isValidJSON
exports.errorHandle = errorHandle
