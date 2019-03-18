const jwt = require("jsonwebtoken");
const admin = require("../config/admin");
const tokenSecret = "IRONRATS2019";

module.exports = isLoggedin = function(req, res, next) {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  if (token) {
    jwt.verify(token, tokenSecret, function(err, decoded) {
      if (err) {
        res.json({ success: false, message: "failed to authenticate token." });
        return false;
      } else if (admin.email == decoded.email) {
        return next();
      } else {
        res.json({ success: false, message: "failed to authenticate token." });
        return false;
      }
    });
  }
};

/*Jason Web Token Authentication */
