import nodemailer from "nodemailer";

// Nodemailer transporter using Brevo SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // set to true if you use port 465
  auth: {
    user: process.env.SMTP_USER, // your Brevo login (email)
    pass: process.env.SMTP_PASS, // your Brevo SMTP key
  },
});

export default transporter;