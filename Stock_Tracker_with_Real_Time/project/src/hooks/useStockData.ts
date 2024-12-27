import { useState, useEffect } from 'react';
import { StockData, StockHistory } from '../types/stock';
import { fetchStockData, fetchStockHistory } from '../services/stockService';

export const useStockData = (symbol: string) => {
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [history, setHistory] = useState<StockHistory[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [data, historyData] = await Promise.all([
          fetchStockData(symbol),
          fetchStockHistory(symbol)
        ]);
        
        if (isMounted) {
          setStockData(data);
          setHistory(historyData);
          setError(null);
        }
      } catch (err) {
        console.error('Failed to fetch stock data:', err);
        if (isMounted) {
          setError('Unable to fetch stock data. Please try again later.');
        }
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Update every minute

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [symbol]);

  return { stockData, history, error };
};