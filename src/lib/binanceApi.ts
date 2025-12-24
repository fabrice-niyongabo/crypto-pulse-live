/**
 * Binance API utilities
 * Handles fetching initial coin data from REST API
 */

import type {
  BinanceTicker,
  BinanceExchangeInfo,
  CoinData,
} from '@/types/crypto';

const BINANCE_REST_API = 'https://api.binance.com/api/v3';

// Cache for exchange info (doesn't update frequently)
let exchangeInfoCache: BinanceExchangeInfo | null = null;
let exchangeInfoCacheTime: number = 0;
const EXCHANGE_INFO_CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Fetches exchange info from Binance API
 * Caches the result since it doesn't update frequently
 */
async function fetchExchangeInfo(): Promise<BinanceExchangeInfo> {
  const now = Date.now();
  
  // Return cached data if it's still valid
  if (
    exchangeInfoCache &&
    now - exchangeInfoCacheTime < EXCHANGE_INFO_CACHE_DURATION
  ) {
    return exchangeInfoCache;
  }

  try {
    const response = await fetch(`${BINANCE_REST_API}/exchangeInfo`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: BinanceExchangeInfo = await response.json();
    
    // Update cache
    exchangeInfoCache = data;
    exchangeInfoCacheTime = now;
    
    return data;
  } catch (error) {
    console.error('Failed to fetch exchange info:', error);
    // If we have cached data, return it even if expired
    if (exchangeInfoCache) {
      return exchangeInfoCache;
    }
    throw error;
  }
}

/**
 * Fetches 24hr ticker data for all trading pairs
 * Filters to USDT pairs only with TRADING status and sorts by top gainers
 */
export async function fetchTopGainers(): Promise<CoinData[]> {
  try {
    // First, fetch exchange info to get active trading symbols
    const exchangeInfo = await fetchExchangeInfo();
    
    // Create a Set of active USDT trading symbols for quick lookup
    const activeTradingSymbols = new Set<string>();
    exchangeInfo.symbols.forEach((symbolInfo) => {
      if (
        symbolInfo.status === 'TRADING' &&
        symbolInfo.quoteAsset === 'USDT'
      ) {
        activeTradingSymbols.add(symbolInfo.symbol);
      }
    });

    // Fetch 24hr ticker data
    const response = await fetch(`${BINANCE_REST_API}/ticker/24hr`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: BinanceTicker[] = await response.json();
    
    // Filter only USDT trading pairs that are actively trading
    const usdtPairs = data.filter(
      (ticker) =>
        ticker.symbol.endsWith('USDT') &&
        activeTradingSymbols.has(ticker.symbol)
    );
    
    // Map to our CoinData format
    const coins: CoinData[] = usdtPairs.map((ticker) => ({
      symbol: ticker.symbol,
      // Extract base asset by removing 'USDT' suffix
      baseAsset: ticker.symbol.replace('USDT', ''),
      lastPrice: parseFloat(ticker.lastPrice),
      priceChangePercent: parseFloat(ticker.priceChangePercent),
      volume: parseFloat(ticker.quoteVolume),
      highPrice: parseFloat(ticker.highPrice),
      lowPrice: parseFloat(ticker.lowPrice),
    }));
    
    // Sort by price change percent (top gainers first)
    coins.sort((a, b) => b.priceChangePercent - a.priceChangePercent);
    
    return coins;
  } catch (error) {
    console.error('Failed to fetch Binance data:', error);
    throw error;
  }
}

/**
 * Format price with appropriate decimal places
 * Higher prices get fewer decimals, lower prices get more
 */
export function formatPrice(price: number): string {
  if (price >= 1000) return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (price >= 1) return price.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 });
  if (price >= 0.01) return price.toLocaleString(undefined, { minimumFractionDigits: 6, maximumFractionDigits: 6 });
  return price.toLocaleString(undefined, { minimumFractionDigits: 8, maximumFractionDigits: 8 });
}

/**
 * Format volume to human-readable format (K, M, B)
 */
export function formatVolume(volume: number): string {
  if (volume >= 1_000_000_000) return `${(volume / 1_000_000_000).toFixed(2)}B`;
  if (volume >= 1_000_000) return `${(volume / 1_000_000).toFixed(2)}M`;
  if (volume >= 1_000) return `${(volume / 1_000).toFixed(2)}K`;
  return volume.toFixed(2);
}

/**
 * Format percentage change with sign
 */
export function formatPercent(percent: number): string {
  const sign = percent >= 0 ? '+' : '';
  return `${sign}${percent.toFixed(2)}%`;
}
