var nodemailer = require("nodemailer");

module.exports = function(email_address, subject, content) {
  var smtpTransporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      type: "OAuth2",
      user: "davidlin006811@gmail.com",
      clientId:
        "755175043144-2d0k6os5gqiargohl9c6i5th3m38dplu.apps.googleusercontent.com",
      clientSecret: "kAGDuO-sG1lblAEZLXK6aZHF",
      refreshToken: "1/AVIv9pXT27jWXw1JCsUe16U0oUPoSIMM9R_J1sA0dlQ"
    }
  });

  var mailOptions = {
    from: "Iron Rats Custom<davidlin006811@gmail.com>",
    to: email_address,
    subject: subject,
    html: content
  };
  return new Promise((resolve, reject) => {
    smtpTransporter.sendMail(mailOptions, (err, success) => {
      if (err) reject(Error(err));
      if (success) {
        resolve("send mail successfully");
      }
    });
  });
};
