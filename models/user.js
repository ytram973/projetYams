const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  // email: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  pastriesWon: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true, default: 0 }
    }
  ]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
