const mongoose = require('mongoose');

const TradeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  cryptoId: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  type: { type: String, required: true }, // 'buy' or 'sell'
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Trade', TradeSchema);