const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require("../models/User");

router.get("/", async function (req, res) {
    const userID = req.userData.id;
    try {
        User.findById(userID)
            .populate()
            .then((user) => {
                res.send(user.conversations);
            })
            .catch((error) => {
                console.error("User specified in the JWT token (" + userID + + "not found: " + error)
                res.status(500).send();
            });
    } catch (error) {
        console.error("Error fetching chat history:", error);
        return res.status(500).send();
    }
});

router.post("/:userID", async function (req, res) {
    
});

router.get("/:userID/:conversationID", async function (req, res) {
    
});

router.put("/:userID/:conversationID", async function (req, res) {
    
});

module.exports = router;