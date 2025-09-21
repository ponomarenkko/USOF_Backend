import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

export default function sendEmail(subject, text, to) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if (err)
            console.log(err)    //TODO: log this
        else
            console.log('Email sent: ' + mailOptions.to)
    })
}

export function sendVerifyLink(url, to) {
    const subject = `Verify your email`
    const text = `To verify your email, click on this link:\n${url}`

    sendEmail(subject, text, to)
}

export function sendPswResetLink(url, to) {
    const subject = `Password reset`
    const text = `To reset your password, click on this link:\n${url}`

    sendEmail(subject, text, to)
}

export function sendDeletionLink(url, to) {
    const subject = `Account deletion`
    const text = `To delete your account, click on this link:\n${url}`

    sendEmail(subject, text, to)
}
