const bcrypt = require('bcryptjs');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let User = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  password: {
    type: String,
    required: true
  },

  conversations: [{
    type: Schema.Types.ObjectId,
    ref: 'Conversation'
  }],
});

User.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});

module.exports = mongoose.model('User', User);