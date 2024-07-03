import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const CoinDetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f0f4f8;
  min-height: 100vh;
`;

const CoinHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const CoinIcon = styled.img`
  width: 50px;
  height: 50px;
  margin-right: 10px;
`;

const CoinName = styled.h1`
  font-size: 24px;
  font-weight: bold;
`;

const ChartContainer = styled.div`
  width: 100%;
  height: 400px;
  margin-top: 20px;
`;

const CoinDetail = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState(null);

  useEffect(() => {
    const fetchCoin = async () => {
      try {
        const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}`);
        setCoin(response.data);
      } catch (error) {
        console.error('Error fetching coin data:', error);
      }
    };

    fetchCoin();
  }, [id]);

  useEffect(() => {
    if (coin) {
      new window.TradingView.widget({
        symbol: `${coin.symbol.toUpperCase()}USD`,
        interval: '1',
        container_id: 'chart',
        library_path: '/charting_library/',
        locale: 'en',
        width: 800,
        height: 400,
        theme: 'light',
        range: '2H',
        style: '1',
        timezone: 'Etc/UTC',
        toolbar_bg: '#f1f3f6',
        withdateranges: true,
        hide_side_toolbar: false,
        allow_symbol_change: true,
        save_image: false,
        details: true,
        hotlist: true,
        calendar: true,
        studies: [
          'MACD@tv-basicstudies',
          'StochasticRSI@tv-basicstudies',
          'TripleEMA@tv-basicstudies',
        ],
      });
    }
  }, [coin]);

  if (!coin) {
    return <div>Loading...</div>;
  }

  return (
    <CoinDetailContainer>
      <CoinHeader>
        <CoinIcon src={coin.image.large} alt={coin.name} />
        <CoinName>{coin.name}</CoinName>
      </CoinHeader>
      <ChartContainer id="chart" />
    </CoinDetailContainer>
  );
};

export default CoinDetail;
