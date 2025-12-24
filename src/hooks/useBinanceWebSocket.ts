/**
 * Custom hook for Binance WebSocket connection
 * Handles real-time price updates, reconnection logic, and cleanup
 */

import { useEffect, useRef, useCallback } from 'react';
import { useCryptoStore } from '@/store/useCryptoStore';
import type { WebSocketTicker } from '@/types/crypto';

// Binance WebSocket endpoint for all tickers stream
const WS_URL = 'wss://stream.binance.com:9443/ws/!ticker@arr';

// Reconnection settings
const RECONNECT_DELAY = 3000; // 3 seconds
const MAX_RECONNECT_ATTEMPTS = 5;

export function useBinanceWebSocket() {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const { updateCoin, setConnected, coins } = useCryptoStore();

  /**
   * Create a set of tracked symbols for quick lookup
   * Only process updates for coins we're displaying
   */
  const trackedSymbols = useRef<Set<string>>(new Set());
  
  useEffect(() => {
    trackedSymbols.current = new Set(coins.map((c) => c.symbol));
  }, [coins]);

  /**
   * Handle incoming WebSocket messages
   * Updates coin data in store if symbol is tracked
   */
  const handleMessage = useCallback(
    (event: MessageEvent) => {
      try {
        const tickers: WebSocketTicker[] = JSON.parse(event.data);
        
        // Process each ticker update
        tickers.forEach((ticker) => {
          // Only process USDT pairs that we're tracking
          if (
            ticker.s.endsWith('USDT') &&
            trackedSymbols.current.has(ticker.s)
          ) {
            updateCoin(ticker.s, {
              lastPrice: parseFloat(ticker.c),
              priceChangePercent: parseFloat(ticker.P),
            });
          }
        });
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    },
    [updateCoin]
  );

  /**
   * Establish WebSocket connection
   * Sets up event handlers for open, close, error, and message events
   */
  const connect = useCallback(() => {
    // Clean up existing connection
    if (wsRef.current) {
      wsRef.current.close();
    }

    console.log('Connecting to Binance WebSocket...');
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log('WebSocket connected');
      setConnected(true);
      reconnectAttempts.current = 0;
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setConnected(false);
      
      // Attempt reconnection if not at max attempts
      if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttempts.current += 1;
        console.log(
          `Reconnecting... Attempt ${reconnectAttempts.current}/${MAX_RECONNECT_ATTEMPTS}`
        );
        reconnectTimeoutRef.current = setTimeout(connect, RECONNECT_DELAY);
      } else {
        console.error('Max reconnection attempts reached');
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onmessage = handleMessage;

    wsRef.current = ws;
  }, [handleMessage, setConnected]);

  /**
   * Initialize WebSocket connection on mount
   * Clean up on unmount
   */
  useEffect(() => {
    connect();

    return () => {
      // Clear any pending reconnection
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      // Close WebSocket connection
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  /**
   * Manual reconnect function
   * Resets attempt counter and initiates new connection
   */
  const reconnect = useCallback(() => {
    reconnectAttempts.current = 0;
    connect();
  }, [connect]);

  return { reconnect };
}
