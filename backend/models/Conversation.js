const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Conversation = new Schema({
    title: {
        type: String,
        required: true
    },

    messages: [{
        type: Schema.Types.ObjectId,
        ref: 'Message'
    }]
});

module.exports = mongoose.model('Conversation', Conversation);