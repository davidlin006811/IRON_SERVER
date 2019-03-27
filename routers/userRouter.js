const express = require("express");
const router = express.Router();
const User = require("../models/user");
const comparePassword = require("../functions/hash").comparePassword;
const hashPassword = require("../functions/hash").hashPassword;
const admin = require("../config/admin");
const jwtToken = require("../functions/jwtToken");
const MailNode = require("../functions/mail");
const generateToken = require("../functions/rendomToken");
/*admin login */
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (email !== admin.email) {
    res.status(401).json({ message: "Login failed" });
  } else {
    User.findOne({ email: email }, (err, user) => {
      comparePassword(password, user.password).then(isMatch => {
        if (isMatch) {
          //return JWT token
          jwtToken.generateJWT().then(token => {
            res
              .status(200)
              .json({ code: 0, message: "login successful", token: token });
          });
        } else {
          res.status(200).json({
            code: 1,
            message: "login failed, incorrect username or password"
          });
        }
      });
    });
  }
});
/* admin reset password */
router.post("/resetPassword", (req, res) => {
  const email = req.body.email;
  const newPassword = req.body.password;
  if (email !== admin.email) {
    res.status(401).json({ code: 1, message: "password failed to change" });
  } else {
    User.findOne({ email: email }).then(user => {
      hashPassword(newPassword).then(newHashPassword => {
        user.password = newHashPassword;
        user.save().then(result => {
          res
            .status(200)
            .json({ code: 0, message: "change password successfully" });
        });
      });
    });
  }
});
/*admin frogot password */
router.post("/forgotPassword", (req, res) => {
  const smsNumber = req.body.smsNumber;
  if (smsNumber !== admin.SMSNumber) {
    res.status(401).json({ code: 1, message: "cellphone number not match" });
  } else {
    const token = generateToken(6);
    const subject = "Verification Code";
    const content = `Reset password code: ${token}`;

    MailNode(admin.SMSNumber, subject, content, function() {
      res.status(200).json({ code: 0, token: token });
    });
  }
});

/* admin change password */
router.post("/changePassword", (req, res) => {
  const email = req.body.email;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  if (email !== admin.email) {
    res.status(401).json({ code: 1, message: "password failed to change" });
  } else {
    {
      User.findOne({ email: email }).then(user => {
        comparePassword(oldPassword, user.password).then(isMatch => {
          if (isMatch) {
            hashPassword(newPassword).then(newHashPassword => {
              user.password = newHashPassword;
              user.save().then(result => {
                res
                  .status(200)
                  .json({ code: 0, message: "change password successfully" });
              });
            });
          } else {
            res
              .status(200)
              .json({ code: 1, message: "password failed to change" });
          }
        });
      });
    }
  }
});
module.exports = router;
