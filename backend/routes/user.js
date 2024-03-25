const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require("../models/User");

router.get("/:userID", async function (req, res) {
    const userID = req.params.userID;
    try {
        User.findById(userID)
            .populate()
            .then((user) => {
              res.send(user.conversations);
            })
            .catch((error) => {
              res.status(400).send("Usuario no encontrado");
            });

    } catch (error) {
        console.error("Error fetching chat history:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post("/:userID", async function (req, res) {
    
});

router.get("/:userID/:conversationID", async function (req, res) {
    
});

router.put("/:userID/:conversationID", async function (req, res) {
    
});

module.exports = router;