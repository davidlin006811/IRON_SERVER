const express = require("express");
const router = express.Router();
const isLoggedIn = require("../functions/isLoggedin");
const fs = require("fs");

router.get("/all", isLoggedIn, (req, res) => {
  const rawdata = fs.readFileSync("theme.json");
  const theme = JSON.parse(rawdata);
  res.status(200).json(theme);
});

//post a new theme
router.post("/", isLoggedIn, (req, res) => {
  const data = req.body;
  io.sockets.emit("new theme", req.body);
  const rawdata = fs.readFileSync("theme.json");
  const theme = JSON.parse(rawdata);
  theme.presets.push(data);
  fs.writeFileSync("theme.json", JSON.stringify(theme));
  res.status(200).json({ code: 0, message: "save theme successfully" });
});

router.patch("/", isLoggedIn, (req, res) => {
  io.sockets.emit("select theme", req.body.selectedPresetIndex);
  const rawdata = fs.readFileSync("theme.json");
  const theme = JSON.parse(rawdata);
  theme.selectedPresetIndex = req.body.selectedPresetIndex;
  fs.writeFileSync("theme.json", JSON.stringify(theme));
  res.status(200).json({ code: 0, message: "select theme successfully" });
});
module.exports = router;
