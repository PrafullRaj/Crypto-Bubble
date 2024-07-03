import React, { useEffect, useRef } from 'react';

const TradingViewWidget = ({ symbol }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (window.TradingView && containerRef.current) {
      new window.TradingView.widget({
        symbol: symbol,
        interval: '1',
        container_id: containerRef.current.id,
        timezone: 'Etc/UTC',
        theme: 'light',
        style: '1',
        locale: 'en',
        range: '2H',
        hide_side_toolbar: false,
        allow_symbol_change: true,
        details: true,
        hotlist: true,
        calendar: true,
        autosize: true,
      });
    }
  }, [symbol]);

  return <div id={`tradingview_${symbol}`} ref={containerRef} style={{ height: '500px', width: '100%' }} />;
};

export default TradingViewWidget;
