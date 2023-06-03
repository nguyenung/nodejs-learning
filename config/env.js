const dotenv = require('dotenv')

const loadEnvironmentVariables = () => {
    dotenv.config()
    const environment = process.env.NODE_ENV || 'local'
    dotenv.config({ path: `.env.${environment}` })
};

module.exports = {
    loadEnvironmentVariables,
}
