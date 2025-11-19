const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // build a tranporter

  var transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "f32d7ea6474ed0",
      pass: "d0d216e8e6a5ea",
    },
  });

  // email Options
  const mailOption = {
    from: "Fatemeh <example01@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // send the email
  await transporter.sendMail(mailOption);
};

module.exports = sendEmail;
