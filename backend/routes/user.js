const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require("../models/User");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

router.get("/:userID", async function (req, res) {
    const userID = req.params.userID;

    try {
        User.findById(userID).populate('conversations')
            .then((user) => {
                res.send(user.conversations);
            })
            .catch((error) => {
                res.status(400).send("User not found");
            });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post("/:userID", async function (req, res) {
    const userID = req.params.userID;
    const conversationName = req.body.conversationName;
    let user;

    if (!conversationName) {
        return res.status(400).json({
            error: "Conversation name not found"
        });
    }

    try {
        user = await User.findById(userID)
    } catch (error) {
        return res.status(400).send("User not found");
    }

    try {
        const conversation = new Conversation({
            title: conversationName,
            messages: []
        });
        await conversation.save();
        user.conversations.push(conversation._id);
        await user.save();
        res.sendStatus(200);
    } catch (error) {
        return res.status(500).send("Error creating new conversation")
    }
});

router.get("/:userID/:conversationID", async function (req, res) {
    const userID = req.params.userID;
    const conversationId = req.params.conversationID;
    let user;

    try {
        user = await User.findById(userID);
    } catch (error) {
        return res.status(400).send("User not found");
    }

    if (user.conversations.some(id => id.equals(conversationId))) {
        Conversation.findById(conversationId).populate('messages')
            .then((conversation) => {
                const decryptedMessages = conversation.messages.map(message => ({
                    type: message.type,
                    message: message.decrypt()
                }));

                res.send(decryptedMessages);
            })
            .catch((error) => {
                res.status(400).send("Conversation not found");
            });
    } else {
        res.status(400).send("ConversationID not valid");
    }
});

router.put("/:userID/:conversationID", async function (req, res) {
    const userID = req.params.userID;
    const conversationID = req.params.conversationID;
    const messageType = req.body.type;
    const messageContent = req.body.message;

    if (!messageType) {
        return res.status(400).send("Message type not found");
    }

    if (!messageContent) {
        return res.status(400).send("Message not found");
    }

    let user;

    try {
        user = await User.findById(userID);
    } catch (error) {
        return res.status(400).send("User not found");
    }

    let conversation;

    if (user.conversations.some(id => id.equals(conversationID))) {
        try {
            conversation = await Conversation.findById(conversationID);
        } catch (error) {
            return res.status(500).send("Conversation not found");
        }
    } else {
        res.status(400).send("ConversationID not valid");
    }

    try {
        const message = new Message({
            type: messageType,
            message: messageContent
        });
        await message.save();
        conversation.messages.push(message._id);
        await conversation.save();

        return res.sendStatus(200);

    } catch (error) {
        console.log(error);
        return res.status(400).send("Error creating new message");
    }
});

router.get("/:userID/:conversationID/messageAI", async function (req, res) {
    const userID = req.params.userID;
    const conversationID = req.params.conversationID;
    const messageContent = req.body.message;

    if (!messageContent) {
        return res.status(400).send("Message not found");
    }

    let user;

    try {
        user = await User.findById(userID);
    } catch (error) {
        return res.status(400).send("User not found");
    }

    let conversation;

    if (user.conversations.some(id => id.equals(conversationID))) {
        try {
            conversation = await Conversation.findById(conversationID);
        } catch (error) {
            return res.status(500).send("Conversation not found");
        }
    } else {
        res.status(400).send("ConversationID not valid");
    }

    //TODO hacer llamada a la api del modelo

    const aiMessage = "";

    try {
        const message = new Message({
            type: "DocGPT",
            message: aiMessage
        });
        await message.save();
        conversation.messages.push(message._id);
        await conversation.save();

        return res.sendStatus(200);

    } catch (error) {
        console.log(error);
        return res.status(400).send("Error creating response");
    }
});

module.exports = router;