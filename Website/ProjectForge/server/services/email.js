const nodemailer = require('nodemailer');

let transporter;

async function createTransporter() {
    if (transporter) return transporter;

    const account = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: account.user,
            pass: account.pass,
        },
    });
    return transporter;
}

async function sendPasswordResetEmail(to, resetUrl) {
    const transporter = await createTransporter();
    const info = await transporter.sendMail({
        from: '"ProjectForge" <noreply@projectforge.com>',
        to,
        subject: 'Password Reset Request',
        text: `You requested a password reset. Click the link below to reset your password:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.`,
        html: `<p>You requested a password reset. Click the link below to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>If you did not request this, please ignore this email.</p>`,
    });
    console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
}

module.exports = {
    sendPasswordResetEmail,
};