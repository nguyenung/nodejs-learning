const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

const dotenv = require('dotenv');

dotenv.config()
const environment = process.env.NODE_ENV || 'local'

dotenv.config({ path: `.env.${environment}` })

let _db

const mongoConnect = callback => {
    MongoClient.connect(process.env.DB_MONGODB_CREDENTIAL)
    .then(result => {
        console.log('Connected to mongodb cloud.')
        _db = result.db()
        callback()
    })
    .catch(err => console.log(err))
}

const getDb = () => {
    if (_db) {
        return _db
    }
    throw 'No database found'
}

exports.mongoConnect = mongoConnect
exports.getDb = getDb
