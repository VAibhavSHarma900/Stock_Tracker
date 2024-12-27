export interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
}

export interface StockHistory {
  timestamp: string;
  price: number;
}