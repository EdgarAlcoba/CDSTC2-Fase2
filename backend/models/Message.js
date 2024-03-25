const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Message = new Schema({
    type: {
        type: String,
        required: true,
    },

    message: {
        type: String
    }
});

Message.pre('save', async function (next) {
    const message = this;
    if (!message.isModified('message')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(message.message, salt);
        message.message = hashedPassword;
        next();
    } catch (error) {
        return next(error);
    }
});

module.exports = mongoose.model('Message', Message);