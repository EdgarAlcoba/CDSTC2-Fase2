const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Conversation = require("../models/Conversation"); // Import Conversation model

router.post("/", async function (req, res) {
  const { username, password } = req.body;

  try {
    let user = await User.findOne({ username });

    if (user) {
      return res.status(400).send({ error: "User already exists" });
    }

    // Create the user
    user = new User({ username, password });
    await user.save();

    // Create a random conversation
    const conversation = new Conversation({
      title: "Random Conversation",
      messages: [] // You can add messages here if needed
    });

    // Save the conversation
    await conversation.save();

    // Associate the conversation with the user
    user.conversations.push(conversation._id);

    console.log(user)
    await user.save();

    return res.status(200).send();
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).send();
  }
});

module.exports = router;
