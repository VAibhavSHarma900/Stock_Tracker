import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { StockData } from '../types/stock';

interface StockCardProps {
  stock: StockData;
}

export const StockCard: React.FC<StockCardProps> = ({ stock }) => {
  const isPositive = stock.change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">{stock.symbol}</h3>
          <p className="text-sm text-gray-500">
            Last updated: {new Date(stock.lastUpdated).toLocaleTimeString()}
          </p>
        </div>
        {isPositive ? (
          <TrendingUp className="w-6 h-6 text-green-500" />
        ) : (
          <TrendingDown className="w-6 h-6 text-red-500" />
        )}
      </div>
      
      <div className="mt-4">
        <div className="text-3xl font-bold text-gray-900">
          ${stock.price.toFixed(2)}
        </div>
        <div className={`flex items-center mt-2 ${
          isPositive ? 'text-green-500' : 'text-red-500'
        }`}>
          <span className="text-lg font-semibold">
            {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
          </span>
        </div>
      </div>
    </motion.div>
  );
};