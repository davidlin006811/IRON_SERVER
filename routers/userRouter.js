const express = require("express");
const router = express.Router();
const User = require("../models/user");
const comparePassword = require("../functions/hash").comparePassword;
const hashPassword = require("../functions/hash").hashPassword;
const admin = require("../config/admin");
const jwtToken = require("../functions/jwtToken");
const MailNode = require("../functions/mail");
const generateToken = require("../functions/rendomToken");
const isLoggedIn = require("../functions/isLoggedin");
const sanitizeHtml = require("sanitize-html"); // HTML sanitizer
/*admin login */
router.post("/login", (req, res) => {
  const email = sanitizeHtml(req.body.email, {
    allowedTags: [],
    allowedAttributes: {}
  });
  const password = sanitizeHtml(req.body.password, {
    allowedTags: [],
    allowedAttributes: {}
  });

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
  const resetToken = sanitizeHtml(req.body.token, {
    allowedTags: [],
    allowedAttributes: {}
  });
  const newPassword = sanitizeHtml(req.body.password, {
    allowedTags: [],
    allowedAttributes: {}
  });

  User.findOne({ resetToken: resetToken })
    .then(user => {
      if (!user) {
        res
          .status(200)
          .json({ code: 1, message: "User nof found or token is unavilable" });
      } else {
        hashPassword(newPassword).then(newHashPassword => {
          user.password = newHashPassword;
          user.token = null;
          user.save().then(result => {
            res
              .status(200)
              .json({ code: 0, message: "change password successfully" });
          });
        });
      }
    })
    .catch(error => {
      console.log(error);
    });
});
/*admin frogot password */
router.post("/forgotPassword", (req, res) => {
  const smsNumber = sanitizeHtml(req.body.smsNumber, {
    allowedTags: [],
    allowedAttributes: {}
  });
  if (smsNumber !== admin.phone) {
    res
      .status(200)
      .json({ code: 1, message: "cellphone number does not match" });
  } else {
    const token = generateToken(6);
    const subject = "Verification Code";
    const content = `Reset password code: ${token}`;

    User.findOne({ email: admin.email })
      .then(user => {
        user.resetToken = token;
        user.save().then(result => {
          MailNode(admin.SMSNumber, subject, content, function() {
            res.status(200).json({ code: 0, token: token });
          });
        });
      })
      .catch(err => {
        console.log(err);
      });
  }
});

/* admin change password */
router.post("/changePassword", isLoggedIn, (req, res) => {
  const email = sanitizeHtml(req.body.email, {
    allowedTags: [],
    allowedAttributes: {}
  });
  const oldPassword = sanitizeHtml(req.body.oldPassword, {
    allowedTags: [],
    allowedAttributes: {}
  });
  const newPassword = sanitizeHtml(req.body.newPassword, {
    allowedTags: [],
    allowedAttributes: {}
  });
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
