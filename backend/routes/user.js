const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Chat = require("../models/Chat");

// Assuming you have a Chat model defined to store chat history

router.get("/:userID", async function (req, res) {
    const userID = req.params.userID;

    try {
        // Find the user by ID
        const user = await User.findById(userID);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Retrieve chat history for the user
        const chatHistory = await Chat.find({ participants: userID });

        return res.json(chatHistory);
    } catch (error) {
        console.error("Error fetching chat history:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;