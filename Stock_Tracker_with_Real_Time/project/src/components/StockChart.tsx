import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { StockHistory } from '../types/stock';

interface StockChartProps {
  data: StockHistory[];
  symbol: string;
}

export const StockChart: React.FC<StockChartProps> = ({ data, symbol }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">{symbol} Price History</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis 
              dataKey="timestamp"
              tickFormatter={(time) => new Date(time).toLocaleTimeString()}
            />
            <YAxis />
            <Tooltip
              labelFormatter={(label) => new Date(label).toLocaleString()}
              formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Price']}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#6366f1"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};