const mongoose = require('mongoose')

const Schema = mongoose.Schema

const PasswordReset = new Schema({
    email: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        required: true,
        default: Date.now
    }
},
{collection: 'password_resets'}
)

module.exports = mongoose.model('PasswordReset', PasswordReset)