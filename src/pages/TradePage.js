import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../TradePage.css';

const TradePage = () => {
  const [userId, setUserId] = useState('');
  const [user, setUser] = useState(null);
  const [cryptoId, setCryptoId] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [type, setType] = useState('buy');
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    // Fetch user data and trades on component mount
    const fetchUserData = async () => {
      try {
        const userId = 'USER_ID_HERE'; // Replace with the actual user ID
        const userResponse = await axios.get(`http://localhost:5000/api/users/${userId}`);
        setUser(userResponse.data);
        setTrades(userResponse.data.trades);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserData();
  }, []);

  const handleTrade = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/trades/trade', { userId, cryptoId, quantity, price, type });
      setTrades([...trades, res.data]);
      setUser({ ...user, virtualBalance: type === 'buy' ? user.virtualBalance - quantity * price : user.virtualBalance + quantity * price });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="trade-page">
      <h1>Trade</h1>
      {user && (
        <div className="user-info">
          <h2>Welcome, {user.username}</h2>
          <p>Balance: ${user.virtualBalance.toFixed(2)}</p>
        </div>
      )}
      <form onSubmit={handleTrade} className="trade-form">
        <input
          type="text"
          value={cryptoId}
          onChange={(e) => setCryptoId(e.target.value)}
          placeholder="Crypto ID"
          required
        />
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Quantity"
          required
        />
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          required
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
        </select>
        <button type="submit">Execute Trade</button>
      </form>
      <div className="trades-history">
        <h2>Trade History</h2>
        <ul>
          {trades.map((trade) => (
            <li key={trade._id}>
              {trade.date}: {trade.type.toUpperCase()} {trade.quantity} {trade.cryptoId} at ${trade.price}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TradePage;
