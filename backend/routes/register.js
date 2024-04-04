const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/", async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  const loggedUser = await User.findOne({ username: username });

  if (!loggedUser) {
    const wait = await User.create({ username: username, password: password });
    if (!wait) {
      return res.status(400).send("User could not be registered, try again later please");
    } else {
      return res.sendStatus(200);
    }
  } else {
    return res.status(400).send("User already exists");
  }

});

module.exports = router;