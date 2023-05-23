const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  // email: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// userSchema.statics.register = async function(username, email, password) {
//   try {
//     const existingUser = await this.findOne({ $or: [{ username }, { email }] });
//     if (existingUser) {
//       throw new Error('Username or email already exists');
//     }

//     const newUser = new this({ username, email, password });
//     await newUser.save();
//     return newUser;
//   } catch (error) {
//     throw error;
//   }
// };

const User = mongoose.model('User', userSchema);

module.exports = User;