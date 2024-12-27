import axios from 'axios';
import { API_KEY, API_BASE_URL } from '../config/api';
import { StockData, StockHistory } from '../types/stock';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CacheItem {
  data: any;
  timestamp: number;
}

const cache: { [key: string]: CacheItem } = {};

const isValidCache = (key: string): boolean => {
  const item = cache[key];
  return item && Date.now() - item.timestamp < CACHE_DURATION;
};

// Demo data for when API limits are reached
const generateDemoData = (symbol: string): StockData => ({
  symbol,
  price: 150 + Math.random() * 50,
  change: -2 + Math.random() * 4,
  changePercent: -1 + Math.random() * 2,
  lastUpdated: new Date().toISOString()
});

const generateDemoHistory = (basePrice: number): StockHistory[] => {
  const now = Date.now();
  return Array.from({ length: 20 }, (_, i) => ({
    timestamp: new Date(now - (i * 300000)).toISOString(), // 5-minute intervals
    price: basePrice + (Math.random() * 10 - 5)
  })).reverse();
};

export const fetchStockData = async (symbol: string): Promise<StockData> => {
  const cacheKey = `quote-${symbol}`;
  
  if (isValidCache(cacheKey)) {
    return cache[cacheKey].data;
  }

  try {
    const response = await axios.get(API_BASE_URL, {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol,
        apikey: API_KEY
      }
    });

    const quote = response.data['Global Quote'];
    if (!quote || Object.keys(quote).length === 0) {
      // If using demo key or API limit reached, use demo data
      const demoData = generateDemoData(symbol);
      cache[cacheKey] = {
        data: demoData,
        timestamp: Date.now()
      };
      return demoData;
    }

    const stockData: StockData = {
      symbol: quote['01. symbol'],
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
      lastUpdated: new Date().toISOString()
    };

    cache[cacheKey] = {
      data: stockData,
      timestamp: Date.now()
    };

    localStorage.setItem(cacheKey, JSON.stringify({
      data: stockData,
      timestamp: Date.now()
    }));

    return stockData;
  } catch (error) {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsedCache = JSON.parse(cached);
      return parsedCache.data;
    }
    // Fallback to demo data if everything fails
    return generateDemoData(symbol);
  }
};

export const fetchStockHistory = async (symbol: string): Promise<StockHistory[]> => {
  const cacheKey = `history-${symbol}`;

  if (isValidCache(cacheKey)) {
    return cache[cacheKey].data;
  }

  try {
    const response = await axios.get(API_BASE_URL, {
      params: {
        function: 'TIME_SERIES_INTRADAY',
        symbol,
        interval: '5min',
        apikey: API_KEY
      }
    });

    const timeSeries = response.data['Time Series (5min)'];
    if (!timeSeries || Object.keys(timeSeries).length === 0) {
      // If using demo key or API limit reached, use demo data
      const demoData = generateDemoHistory(150);
      cache[cacheKey] = {
        data: demoData,
        timestamp: Date.now()
      };
      return demoData;
    }

    const history: StockHistory[] = Object.entries(timeSeries)
      .map(([timestamp, values]: [string, any]) => ({
        timestamp,
        price: parseFloat(values['4. close'])
      }))
      .slice(0, 50)
      .reverse();

    cache[cacheKey] = {
      data: history,
      timestamp: Date.now()
    };

    localStorage.setItem(cacheKey, JSON.stringify({
      data: history,
      timestamp: Date.now()
    }));

    return history;
  } catch (error) {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsedCache = JSON.parse(cached);
      return parsedCache.data;
    }
    // Fallback to demo data if everything fails
    return generateDemoHistory(150);
  }
};