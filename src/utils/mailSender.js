import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER, 
    pass: process.env.MAIL_PASS, 
  },
})

export default async function mailSender(to, subject, html) {
  const mailOptions = {
    from: process.env.MAIL_USER,
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
