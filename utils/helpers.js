const path = require('path')

const rootPath = () => {
    return path.dirname(process.mainModule.filename)
}

const isValidJSON = (str) => {
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        console.log(e)
        return false;
    }
}

exports.rootPath = rootPath
exports.isValidJSON = isValidJSON