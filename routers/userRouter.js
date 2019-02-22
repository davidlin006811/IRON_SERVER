const express = require("express");
const router = express.Router();
const User = require("../models/user");
const comparePassword = require("../functions/hash").comparePassword;
const hashPassword = require("../functions/hash").hashPassword;
const admin = require("../config/admin");
const jwtToken = require("../functions/jwtToken");
const sendSMS = require("../functions/mail");
/*admin login */
router.post("/login", (req, res) => {
  var email = req.body.email;
  var password = req.body.password;

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
/* admin change password */
router.post("/changePassword", (req, res) => {
  let email = req.body.email;
  let oldPassword = req.body.oldPassword;
  let newPassword = req.body.newPassword;
  if (email !== admin.email) {
    res.status(401).json({ code: 1, message: "password failed to change" });
  } else {
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
});
/*admin frogot password */
router.post("/forgotPassword", (req, res) => {});
module.exports = router;
