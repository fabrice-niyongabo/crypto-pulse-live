/**
 * Type definitions for Binance API responses and application state
 */

// Raw ticker data from Binance REST API /api/v3/ticker/24hr
export interface BinanceTicker {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
}

// Processed coin data for UI display
export interface CoinData {
  symbol: string;
  baseAsset: string;
  lastPrice: number;
  priceChangePercent: number;
  volume: number;
  highPrice: number;
  lowPrice: number;
}

// WebSocket ticker update from Binance stream
export interface WebSocketTicker {
  e: string;      // Event type
  E: number;      // Event time
  s: string;      // Symbol
  p: string;      // Price change
  P: string;      // Price change percent
  w: string;      // Weighted average price
  c: string;      // Last price
  Q: string;      // Last quantity
  o: string;      // Open price
  h: string;      // High price
  l: string;      // Low price
  v: string;      // Total traded base asset volume
  q: string;      // Total traded quote asset volume
}
