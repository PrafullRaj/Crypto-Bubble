import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const CoinListContainer = styled.div`
  padding: 20px;
  background-color: #e0f7fa;
  min-height: 100vh;
`;

const SearchContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
`;

const SearchInput = styled.input`
  padding: 10px;
  width: 300px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const CoinItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 10px;
  background-color: #ffffff;
  border-radius: 8px;
`;

const CoinIcon = styled.img`
  width: 32px;
  height: 32px;
  margin-right: 10px;
`;

const CoinName = styled.span`
  font-size: 18px;
  font-weight: bold;
`;

const ViewButton = styled(Link)`
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 5px;

  &:hover {
    background-color: #0056b3;
  }
`;

const CoinList = () => {
  const [coins, setCoins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 100,
            page: 1,
            sparkline: false,
          },
        });
        setCoins(response.data);
      } catch (error) {
        console.error('Error fetching coins:', error);
      }
    };

    fetchCoins();
  }, []);

  const filteredCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <CoinListContainer>
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Search for a coin..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </SearchContainer>
      {filteredCoins.map(coin => (
        <CoinItem key={coin.id}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CoinIcon src={coin.image} alt={coin.name} />
            <CoinName>{coin.name}</CoinName>
          </div>
          <ViewButton to={`/coin/${coin.id}`}>View Chart</ViewButton>
        </CoinItem>
      ))}
    </CoinListContainer>
  );
};

export default CoinList;
