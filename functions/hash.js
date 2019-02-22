const bcrypt = require("bcryptjs");
module.exports.hashPassword = password => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, function(err, salt) {
      if (err) {
        reject(Error(err));
      }

      bcrypt.hash(password, salt, function(err, hash) {
        if (err) {
          reject(Error(error));
        } else {
          resolve(hash);
        }
      });
    });
  });
};

module.exports.comparePassword = (candidatePassword, hash) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
      if (err) {
        reject(Error(err));
      } else {
        resolve(isMatch);
      }
    });
  });
};
