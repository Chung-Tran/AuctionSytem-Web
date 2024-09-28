const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const ejs = require('ejs'); // Template engine

const { EmailType } = require("../common/constant")

/**
 * Creates a Nodemailer transporter.
 * 
 * @returns {nodemailer.Transporter} The Nodemailer transporter object.
 */
const createTransporter = () => {
    return nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_NAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });
}

/**
 * Renders an email template with the given content.
 * 
 * @param {string} templateName - The name of the template file (e.g., 'otp', 'password_reset').
 * @param {object} content - The content to include in the template.
 * @returns {Promise<string>} The rendered HTML string.
 */
const renderTemplate = async (templatePath, content) => {
    return new Promise((resolve, reject) => {
        ejs.renderFile(templatePath, content, (err, html) => {
            if (err) {
                reject(err);
            } else {
                resolve(html);
            }
        });
    });
}

/**
 * Sends an email with the specified type and content.
 * 
 * @param {string} to - The recipient's email address.
 * @param {string} type - The type of email to send (e.g., 'otp', 'password_reset', 'account_activation').
 * @param {object} content - The content to include in the email.
 * @returns {Promise} A promise that resolves when the email is sent.
 * @throws {Error} Throws an error if the email fails to send.
 */
async function sendEmail(to, type, content) {
    const transporter = createTransporter();

    const subjects = {
        [EmailType.RESET_PASSWORD_OTP]: 'Your OTP Code'
    };

    const templatePaths = {
        [EmailType.RESET_PASSWORD_OTP]: path.join(__dirname, '..', 'email-templates', `${EmailType.RESET_PASSWORD_OTP}.html`)
    };

    const subject = subjects[type];
    const templatePath = templatePaths[type];

    if (!subject || !templatePath) {
        throw new Error('Unknown email type');
    }

    const htmlContent = await renderTemplate(templatePath, content);

    const mailOptions = {
        from: "Auction_System",
        to: to,
        subject: subject,
        html: htmlContent
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        return false;
    }
}

module.exports = {
    sendEmail
};
