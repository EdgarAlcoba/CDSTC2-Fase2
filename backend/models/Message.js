const mongoose = require("mongoose");
const crypto = require('crypto');
const Schema = mongoose.Schema;

let Message = new Schema({
    type: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true
    }
});

// Función para cifrar un mensaje con AES
function encryptMessage(message, key) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(message, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
}

// Función para descifrar un mensaje con AES
function decryptMessage(encryptedMessage, key) {
    const [ivHex, encryptedHex] = encryptedMessage.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
}

Message.pre('save', function (next) {
    const message = this;
    if (!message.isModified('message')) return next();

    try {
        const encryptedMessage = encryptMessage(message.message, process.env.SECRET_KEY);
        message.message = encryptedMessage;
        next();
    } catch (error) {
        return next(error);
    }
});

Message.methods.decrypt = function() {
    return decryptMessage(this.message, process.env.SECRET_KEY);
};

module.exports = mongoose.model('Message', Message);
