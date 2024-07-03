import React from 'react';
import styled from 'styled-components';

const BubbleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${({ color }) => color || '#ffffff'};
  border-radius: 50%;
  width: 100px;
  height: 100px;
  margin: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

const CoinIcon = styled.img`
  width: 50px;
  height: 50px;
`;

const CoinName = styled.div`
  font-size: 14px;
  font-weight: bold;
  margin-top: 10px;
`;

const Bubble = ({ coin, onClick }) => {
  return (
    <BubbleContainer color={coin.color} onClick={() => onClick(coin.id)}>
      <CoinIcon src={coin.image} alt={coin.name} />
      <CoinName>{coin.name}</CoinName>
    </BubbleContainer>
  );
};

export default Bubble;
