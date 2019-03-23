const JWT = require("jsonwebtoken");
const admin = require("../config/admin");
/*Generate JSON Web Token */
module.exports.generateJWT = () => {
  return new Promise((resolve, reject) => {
    var token = JWT.sign({ email: admin.email }, admin.tokenSecret);
    resolve(token);
  });
};
/*Decode JSON Web Token */
module.exports.verifyToken = token => {
  // console.log("token: ", token);
  //console.log("admin tokenSecret: ", admin.tokenSecret);
  return new Promise((resolve, reject) => {
    JWT.verify(token, admin.tokenSecret, {}, (err, decode) => {
      if (err) {
        reject(Error(err));
      } else {
        var isVerified = false;
        if (decode.email == admin.email) {
          isVerified = true;
        }
        resolve(isVerified);
      }
    });
  });
};
