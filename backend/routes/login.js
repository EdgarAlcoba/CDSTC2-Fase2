const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require("../models/User");

router.post("/", async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  const loggedUser = await User.findOne({ username: username });

  try {
    const loggedUser = await User.findOne({ username: username });

    if (!loggedUser) {
      return res.status(400).send("User not found");
    }

    const passwordMatch = await bcrypt.compare(password, loggedUser.password);

    if (!passwordMatch) {
      return res.status(400).send("Incorrect password");
    }

    return res.json(loggedUser._id);
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = router;