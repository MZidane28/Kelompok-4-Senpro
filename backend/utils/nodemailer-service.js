// Import the Nodemailer library
const nodemailer = require('nodemailer');
require("dotenv").config();
const {emailActivation,passwordReset} = require("./emailPayload")

const transporter = nodemailer.createTransport({
    host: 'smtp.azurecomm.net',
    port: 587,
    secure: false, // use SSL,
    auth: {
        user: process.env.SMTP_EMAIL_USER,
        pass: process.env.SMTP_EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false,
        minVersion: "TLSv1.3"
    }
});
transporter.verify((error, success) => {
    if (error) {
        console.log("Transporter", error);
    } else {
        console.log("Ready to send email", success);
    }
});


const send_password_reset = (email, token) => {
    const resetMailOptions = {
        from: `Empati <donotreply@empati.biz.id>`,
        to: email,
        subject: `Password Reset Link`,
        html: passwordReset(token, email)
    };
    // Send the email
    transporter.sendMail(resetMailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
const send_activation_email = (email, token) => {
    const activationMailOptions = {
        from: `Empati <donotreply@empati.biz.id>`,
        to: email,
        subject: "Activation Email",
        html: emailActivation(token)
    };
    // Send the email
    transporter.sendMail(activationMailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = {
    send_password_reset,
    send_activation_email
}