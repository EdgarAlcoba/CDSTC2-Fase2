const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Conversation = new Schema({
    type:{
        type: String,
        required: true,
    },

    message:{
        type: String
    }
});

//TODO encriptar mensajes antes de guardarlos

module.exports = mongoose.model('Conversation', Conversation);