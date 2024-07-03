import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LineController
} from 'chart.js';
import '../components/cryptoDetail';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LineController
);

const CryptoDetail = () => {
  const { id } = useParams();
  const [cryptoData, setCryptoData] = useState([]);
  const [cryptoInfo, setCryptoInfo] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const response = await axios.get(`/api/coins/${id}/market_chart`, {
          params: {
            vs_currency: 'usd',
            days: '7',
          },
        });
        setCryptoData(response.data.prices);
      } catch (error) {
        console.error('Error fetching crypto data:', error);
      }
    };

    const fetchCryptoInfo = async () => {
      try {
        const response = await axios.get(`/api/coins/${id}`);
        setCryptoInfo(response.data);
      } catch (error) {
        console.error('Error fetching crypto info:', error);
      }
    };

    fetchCryptoData();
    fetchCryptoInfo();
  }, [id]);

  const chartData = {
    labels: cryptoData.map(data => new Date(data[0]).toLocaleDateString()),
    datasets: [
      {
        label: `${cryptoInfo ? cryptoInfo.name : 'Crypto'} Price (USD)`,
        data: cryptoData.map(data => data[1]),
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.6)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = document.getElementById('myChart').getContext('2d');
    chartRef.current = new ChartJS(ctx, {
      type: 'line',
      data: chartData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: `${cryptoInfo ? cryptoInfo.name : 'Crypto'} Price Chart`,
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [chartData, cryptoInfo]);

  return (
    <div className="crypto-detail">
      <h1>{cryptoInfo ? cryptoInfo.name : 'Loading...'}</h1>
      <canvas id="myChart"></canvas>
    </div>
  );
};

export default CryptoDetail;
