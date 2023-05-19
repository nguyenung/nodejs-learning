const dotenv = require('dotenv');

dotenv.config()
const environment = process.env.NODE_ENV || 'local'

dotenv.config({ path: `.env.${environment}` })

module.exports = {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "mysql",
    dialectOptions: {
        "socketPath": "/tmp/mysql.sock"
    },
    logging: false
}
