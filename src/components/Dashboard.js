import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styled, { createGlobalStyle, ThemeProvider, keyframes } from 'styled-components';
import { Tooltip } from 'react-tooltip';
import * as d3 from 'd3';
import dayModeImg from '../assets/day-mode.png';
import nightModeImg from '../assets/night-mode.png';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;
  }
`;

const lightTheme = {
  body: '#FFFFFF',
  text: '#000000',
  tableBackground: 'rgba(0, 0, 0, 0.8)',
  tableColor: 'white',
  tableRowBackground: 'rgba(255, 255, 255, 0.1)',
  tableRowBackgroundEven: 'rgba(0, 0, 0, 0.1)',
};

const darkTheme = {
  body: '#000000',
  text: '#FFFFFF',
  tableBackground: 'rgba(255, 255, 255, 0.1)',
  tableColor: 'white',
  tableRowBackground: 'rgba(0, 0, 0, 0.8)',
  tableRowBackgroundEven: 'rgba(255, 255, 255, 0.1)',
};

const NavBar = styled.nav`
  width: 100%;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme }) => theme.body};
`;

const NavTitle = styled.h1`
  margin: 0;
`;

const BubbleFrame = styled.div`
  width: 100%;
  height: 80vh;
  border: 2px solid ${({ theme }) => theme.text};
  position: relative;
  overflow: hidden;
`;

const BubbleContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const floatAnimation = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0); }
`;

const Bubble = styled.div`
  border-radius: 50%;
  background-color: ${({ color }) => color};
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  cursor: pointer;
  transition: transform 0.3s ease-in-out;
  animation: ${floatAnimation} 4s ease-in-out infinite;

  &:hover {
    transform: scale(1.2);
  }
`;

const CoinIcon = styled.img`
  width: 50%;
  height: 50%;
`;

const SearchBar = styled.input`
  width: 50%;
  padding: 10px;
  margin: 20px auto;
  display: block;
  border: 2px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  margin-top: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: ${({ theme }) => theme.tableBackground};
  color: ${({ theme }) => theme.tableColor};
  font-family: 'Arial', sans-serif;
  text-align: center;
`;

const TableHeader = styled.th`
  padding: 10px;
  border-bottom: 1px solid #ccc;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: ${({ theme }) => theme.tableRowBackgroundEven};
  }
`;

const TableCell = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ccc;
  background-color: ${({ theme }) => theme.tableRowBackground};
`;

const ModeButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;

const Dashboard = () => {
  const [coins, setCoins] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState('light');
  const bubbleContainerRef = useRef(null);

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
        const initialCoins = response.data.map((coin) => ({
          ...coin,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          radius: 20 + Math.random() * 30, // random radius between 20 and 50
        }));
        setCoins(initialCoins);
      } catch (error) {
        console.error('Error fetching coin data:', error);
      }
    };

    fetchCoins();
  }, []);

  useEffect(() => {
    if (coins.length > 0) {
      const width = bubbleContainerRef.current.clientWidth;
      const height = bubbleContainerRef.current.clientHeight;

      const simulation = d3.forceSimulation(coins)
        .force('charge', d3.forceManyBody().strength(5))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius((d) => d.radius + 2))
        .on('tick', () => {
          d3.selectAll('.bubble')
            .data(coins)
            .style('left', (d) => `${d.x}px`)
            .style('top', (d) => `${d.y}px`);
        });

      return () => {
        simulation.stop();
      };
    }
  }, [coins]);

  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <GlobalStyle />
      <NavBar>
        <NavTitle>crypto-bubbles</NavTitle>
        <SearchBar
          type="text"
          placeholder="Search for a coin..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <ModeButton onClick={toggleTheme}>
          <img src={theme === 'light' ? nightModeImg : dayModeImg} alt="Toggle Theme" width="32" height="32" />
        </ModeButton>
      </NavBar>

      <BubbleFrame>
        <BubbleContainer ref={bubbleContainerRef}>
          {filteredCoins.map((coin) => (
            <Link to={`/coin/${coin.id}`} key={coin.id}>
              <Bubble
                className="bubble"
                color={getRandomColor()}
                style={{ width: coin.radius * 2, height: coin.radius * 2 }}
                data-tooltip-id={coin.id}
              >
                <CoinIcon src={coin.image} alt={coin.name} />
              </Bubble>
              <Tooltip id={coin.id}>
                <div>
                  <strong>{coin.name}</strong>
                  <p>Price: ${coin.current_price}</p>
                  <p>Market Cap: ${coin.market_cap}</p>
                </div>
              </Tooltip>
            </Link>
          ))}
        </BubbleContainer>
      </BubbleFrame>

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <TableHeader>Rank</TableHeader>
              <TableHeader>Name</TableHeader>
              <TableHeader>Price</TableHeader>
              <TableHeader>M Cap</TableHeader>
              <TableHeader>24H Vol</TableHeader>
              <TableHeader>Hour</TableHeader>
              <TableHeader>Day</TableHeader>
              <TableHeader>Week</TableHeader>
              <TableHeader>Month</TableHeader>
              <TableHeader>Year</TableHeader>
            </tr>
          </thead>
          <tbody>
            {filteredCoins.map((coin) => (
              <TableRow key={coin.id}>
                <TableCell>{coin.market_cap_rank}</TableCell>
                <TableCell>
                  <img src={coin.image} alt={coin.name} width="20" height="20" /> {coin.name}
                </TableCell>
                <TableCell>${coin.current_price}</TableCell>
                <TableCell>${coin.market_cap}</TableCell>
                <TableCell>${coin.total_volume}</TableCell>
                <TableCell>{coin.price_change_percentage_1h_in_currency}%</TableCell>
                <TableCell>{coin.price_change_percentage_24h}%</TableCell>
                <TableCell>{coin.price_change_percentage_7d}%</TableCell>
                <TableCell>{coin.price_change_percentage_30d}%</TableCell>
                <TableCell>{coin.price_change_percentage_1y}%</TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </ThemeProvider>
  );
};

const getRandomColor = () => {
  const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF'];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default Dashboard;
