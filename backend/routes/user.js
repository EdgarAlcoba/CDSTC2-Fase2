const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require("../models/User");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const {json} = require("express");

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
                return res.status(500).send();
            });
    } catch (error) {
        console.error("Error fetching user conversations:", error);
        return res.status(500).send();
    }
});

router.post("/", async function (req, res) {
    const userID = req.userData.id;
    const conversationName = req.body.conversationName;
    let user;

    try {
        user = await User.findById(userID).populate()
    } catch (error) {
        console.error("User specified in the JWT token (" + userID + + "not found: " + error)
        return res.status(500).send();
    }

    try {
        if (!conversationName) {
            return res.status(400).json({
                error: "Conversation name not found"
            });
        }

        const conversation = new Conversation({
            title: conversationName,
            messages: []
        });

        await conversation.save();

        user.conversations.push(conversation._id);
        await user.save()
    } catch (error) {
        console.error("Error creating user conversation", error);
        return res.status(500).send();
    }

    try {
        res.send(user.conversations);
    } catch (error) {
        console.error("Error fetching user conversations", error);
        return res.status(500).send();
    }
});

router.get("/:conversationID", async function (req, res) {
    const userID = req.userData.id;
    const conversationId = req.params.conversationID;
    let user;

    try {
        user = await User.findById(userID).populate()
    } catch (error) {
        console.error("User specified in the JWT token (" + userID + + "not found: " + error)
        return res.status(500).send();
    }

    for (const conversation of user.conversations) {
        if (conversation.toString() === conversationId) {
            let conversationObject = await Conversation.findById(conversationId).populate()
            let messagesArray = []
            for (const message of conversationObject.messages) {
                const messageObject = await Message.findById(message).populate()
                messagesArray.push({
                    type: messageObject.type,
                    message: messageObject.message
                });
            }
            if (messagesArray.length === 0) return res.status(200).json([]);
            return res.status(200).json(messagesArray)
        }
    }

    return res.status(400).json({
        error: "The conversation ID was not found"
    })
});

router.put("/:conversationID", async function (req, res) {
    const userID = req.userData.id;
    const messageType = req.body.type;
    const msg = req.body.message;
    const conversationId = req.params.conversationID;
    let user;

    try {
        user = await User.findById(userID).populate()
    } catch (error) {
        console.error("User specified in the JWT token (" + userID + + "not found: " + error)
        return res.status(500).send();
    }

    for (const conversation of user.conversations) {
        if (conversation.toString() === conversationId) {
            let conversationObject = await Conversation.findById(conversationId).populate()

            if (!messageType) {
                return res.status(400).json({
                    error: "Message type not found"
                });
            }

            if (!msg) {
                return res.status(400).json({
                    error: "Message not found"
                });
            }

            const message = new Message({
                type: messageType,
                message: msg
            });
            await message.save();

            conversationObject.messages.push(message._id)
            await conversationObject.save()

            return res.status(200).send()
        }
    }
    return res.status(400).json({
        error: "The conversation ID was not found"
    })
});

module.exports = router;