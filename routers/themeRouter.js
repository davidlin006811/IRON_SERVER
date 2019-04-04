const express = require("express");
const router = express.Router();
const isLoggedIn = require("../functions/isLoggedin");
const fs = require("fs");
const sanitizeHtml = require("sanitize-html"); // HTML sanitizer
router.get("/all", (req, res) => {
  const rawdata = fs.readFileSync("theme.json");
  const theme = JSON.parse(rawdata);
  res.status(200).json(theme);
});

//post a new theme
router.post("/", isLoggedIn, (req, res) => {
  const data = sanitizeHtml(req.body, {
    allowedTags: [],
    allowedAttributes: {}
  });
  io.sockets.emit("new theme", req.body);
  const rawdata = fs.readFileSync("theme.json");
  const theme = JSON.parse(rawdata);
  theme.presets.push(data);
  fs.writeFileSync("theme.json", JSON.stringify(theme));
  res.status(200).json({ code: 0, message: "save theme successfully" });
});

router.patch("/", isLoggedIn, (req, res) => {
  const index = sanitizeHtml(req.body.selectedPresetIndex, {
    allowedTags: [],
    allowedAttributes: {}
  });
  io.sockets.emit("select theme", index);
  const rawdata = fs.readFileSync("theme.json");
  const theme = JSON.parse(rawdata);
  theme.selectedPresetIndex = index;
  fs.writeFileSync("theme.json", JSON.stringify(theme));
  res.status(200).json({ code: 0, message: "select theme successfully" });
});
module.exports = router;
