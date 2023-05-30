const nodemailer = require('nodemailer')
const pug = require('pug')
const path = require('path')

const dotenv = require('dotenv')
dotenv.config()
const environment = process.env.NODE_ENV || 'local'
dotenv.config({ path: `.env.${environment}` })

const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: process.env.SENDGRID_PORT,
    auth: {
        user: process.env.SENDGRID_USER,
        pass: process.env.SENDGRID_API_KEY
    }
})

const sendEmail = async (toEmail, subject, template, context, callback) => {
    console.log(transporter)
    try {
        const templatePath = path.join(__dirname, '..', 'views', 'emails', template);

        const rendered = pug.renderFile(templatePath, context)
        const result = await transporter.sendMail({
            from: process.env.SENDGRID_SENDER_EMAIL, // verified sender email
            to: toEmail, // recipient email
            subject: subject, // Subject line
            html: rendered // html body
        })
        console.log(result)
        callback()
    } catch (error) {
        console.error('Error sending email:', error)
    }
}

module.exports = sendEmail