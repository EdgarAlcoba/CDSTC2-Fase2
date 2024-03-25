const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require("../models/User");
const jwt = require('jsonwebtoken');


router.post("/", async function (req, res) {
  const { username, password } = req.body;

  if (!username) {
    res.status(400).json({
      error: "Username not found"
    });
  }

  if (!password) {
    res.status(400).json({
      error: "Password not found"
    });
  }

  try {
    const loggedUser = await User.findOne({ username: username });

    if (!loggedUser) {
      return res.status(400).send("User not found");
    }

    const passwordMatch = await bcrypt.compare(password, loggedUser.password);

    if (!passwordMatch) {
      return res.status(400).send("Incorrect password");
    }

    const token = jwt.sign({
      id: loggedUser._id.toString(),
      username: loggedUser.username
    }, process.env.JWT_SECRET)

    console.log(token)
    return res.status(200).json({
      "token": token
    })
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = router;