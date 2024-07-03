
// routes/tradeRoutes.js
const express = require('express');
const router = express.Router();
const Trade = require('../models/Trade');
const User = require('../models/User');

// Place Trade
router.post('/trade', async (req, res) => {
  const { userId, cryptoId, quantity, price, type } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const cost = quantity * price;
    if (type === 'buy' && user.virtualBalance < cost) {
      return res.status(400).json({ msg: 'Insufficient funds' });
    }

    const trade = new Trade({ user: userId, cryptoId, quantity, price, type });
    await trade.save();

    user.trades.push(trade);
    if (type === 'buy') user.virtualBalance -= cost;
    if (type === 'sell') user.virtualBalance += cost;
    await user.save();

    res.json(trade);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;