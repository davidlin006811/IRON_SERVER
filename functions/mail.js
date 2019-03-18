var nodemailer = require("nodemailer");

module.exports = function(email_address, subject, content, callback) {
  var smtpTransporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true, // use SSL
    auth: {
      user: "ironratcustoms@zoho.com",
      pass: "RmMUyEHtjz2HBV:"
    }
  });

  var mailOptions = {
    from: "Sixian Lin <ironratcustoms@zoho.com>",
    to: email_address,
    subject: subject,
    text: content
  };

  smtpTransporter.sendMail(mailOptions, function(err, success) {
    if (err) console.log(err);
    if (success) {
      if (callback) callback();
    }
  });
};
