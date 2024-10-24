import nodemailer from "nodemailer";

const { EMAIL_SMTP, EMAIL_USER, EMAIL_PASS } = process.env;

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: EMAIL_SMTP, // Replace with your SMTP server
  port: 587, // Usually 587 for TLS
  secure: false, // Set to true if using port 465
  auth: {
    user: EMAIL_USER, // Your email address
    pass: EMAIL_PASS, // Your email password or app password
  },
});

// Email options
const defaultMailOptions: nodemailer.SendMailOptions = {
  from: "noreply@conceptant.com", // Sender address
  to: "aaron@codestuff.dev", // List of recipients
  subject: "Hello from Node.js", // Subject line
  text: "This is a test email sent from a Node.js application!", // Plain text body
  // html: '<b>This is a test email sent from a Node.js application!</b>' // HTML body (optional)
};

export function sendEmail(
  mailOptions: nodemailer.SendMailOptions = defaultMailOptions
) {
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log("Error occurred: " + error.message);
    }
    console.log("Email sent: " + info.response);
  });
}

module.exports = { sendEmail };
