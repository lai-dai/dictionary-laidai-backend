import nodemailer from 'nodemailer'

export const sendEmail = async (options: {
  email: string
  subject: string
  message: string
}) => {
  // 1) Create a transporter
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  } as any)

  // 2) Define the email options
  const mailOptions = {
    from: 'Lai Dai <hello@laidai.xyz>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  }

  // 3) Actually send the email
  await transport.sendMail(mailOptions)
}
