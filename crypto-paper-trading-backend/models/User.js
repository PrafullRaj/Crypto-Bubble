// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  virtualBalance: { type: Number, default: 10000 },
  trades: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trade' }],
});

module.exports = mongoose.model('User', UserSchema);
