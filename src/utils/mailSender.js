import nodemailer from 'nodemailer'
import config from '../config/constants.js'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.MAIL_USER,
    pass: config.MAIL_PASS,
  },
})

export default async function mailSender(to, subject, html) {

  const mailOptions = {
    from: config.MAIL_USER,
    to,
    subject,
    html,
  }
  try {
    const info = await transporter.sendMail(mailOptions)
    console.log(`Email sent to ${to}: ${info.messageId}`)
    return info

  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}
