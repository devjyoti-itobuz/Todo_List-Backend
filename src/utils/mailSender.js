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
  console.log(transporter.sendMail(mailOptions))
  return await transporter.sendMail(mailOptions)
}
