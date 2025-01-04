const nodemailer = require("nodemailer");
const ejs = require("ejs");
const fs = require("fs");

async function sendEmail(email, id, name, subject, url) {
  var transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: "587",
    tls: {
      ciphers: "SSLv3",
      rejectUnauthorized: false,
    },
    auth: {
      user: "",
      pass: "",
    },
  });
  var mailOptions = {
    from: "youremail@gmail.com",
    to: email,
    subject: "Sending Email using Node.js",
    html: `<!DOCTYPE html>
    <html lang="en">
        <head>
            <title></title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link href="css/style.css" rel="stylesheet">
        </head>
        <body>
            <h3>welcome mr  ${name}  in my application </h3>
            <p>we import on your privacy</p>
            <p>${subject}</p>
            ${id
        ? `<a href='http://localhost:5000/${url}/${id}'>active account</a>`
        : ""
      }
            
            
        </body>
    </html>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

module.exports = {
  sendEmail,
};
