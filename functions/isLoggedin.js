const jwtToken = require("./jwtToken");
module.exports = function(req, res, next) {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  if (token) {
    jwtToken
      .verifyToken(token)
      .then(isVerified => {
        if (isVerified) {
          return next();
        } else {
          res
            .status(401)
            .json({ code: 1, message: "user is not authenticated" });
        }
      })
      .catch(error => {
        res
          .status(500)
          .json({ code: 1, message: "some error happened unexpected" });
        return false;
      });
  } else {
    res.status(401).json({ code: 1, message: "user is not authenticated" });
    return false;
  }
};
