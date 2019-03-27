module.exports = function(digit_number) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < digit_number; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
};
