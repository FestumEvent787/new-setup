const nodemailer = require("nodemailer");

const sendGoogleApiMail = async (toEmail, subject, body) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SEND_EMAIL_ID,
      pass: process.env.SEND_EMAIL_PASSWORD,
    },
  });

  const mailConfigurations = {
    from: process.env.SEND_EMAIL_ID,
    to: toEmail,
    subject: subject,
    html: body,
  };
  let sendEmail = transporter.sendMail(
    mailConfigurations,
    function (error, info) {
      if (error) throw Error(error);
      console.log("Email Sent Successfully");
      return info;
    }
  );
  return sendEmail;
};

module.exports = sendGoogleApiMail;
