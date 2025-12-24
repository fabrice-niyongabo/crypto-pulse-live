/**
 * Zustand store for cryptocurrency state management
 * Handles coins data, pagination, search, and loading states
 */

import { create } from "zustand";
import type { CoinData } from "@/types/crypto";

interface CryptoState {
  // Coin data
  coins: CoinData[];
  filteredCoins: CoinData[];

  // Pagination
  currentPage: number;
  coinsPerPage: number;

  // Search
  searchQuery: string;

  // Loading and error states
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;

  // Highlighted coin for player navigation
  highlightedCoin: string | null;

  // Actions
  setCoins: (coins: CoinData[]) => void;
  updateCoin: (symbol: string, updates: Partial<CoinData>) => void;
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setConnected: (connected: boolean) => void;
  setHighlightedCoin: (symbol: string | null) => void;
}

export const useCryptoStore = create<CryptoState>((set, get) => ({
  // Initial state
  coins: [],
  filteredCoins: [],
  currentPage: 1,
  coinsPerPage: 10,
  searchQuery: "",
  isLoading: true,
  error: null,
  isConnected: false,
  highlightedCoin: null,

  // Set initial coins list and apply filtering
  setCoins: (coins) => {
    const { searchQuery } = get();
    const filtered = filterCoins(coins, searchQuery);
    set({ coins, filteredCoins: filtered, isLoading: false });
  },

  // Update a single coin's data (for WebSocket updates)
  updateCoin: (symbol, updates) => {
    const { coins, searchQuery } = get();
    const updatedCoins = coins.map((coin) =>
      coin.symbol === symbol ? { ...coin, ...updates } : coin
    );
    // Re-sort by price change percent to maintain top gainers order
    updatedCoins.sort((a, b) => b.priceChangePercent - a.priceChangePercent);
    const filtered = filterCoins(updatedCoins, searchQuery);
    set({ coins: updatedCoins, filteredCoins: filtered });
  },

  // Search functionality
  setSearchQuery: (query) => {
    const { coins } = get();
    const filtered = filterCoins(coins, query);
    set({ searchQuery: query, filteredCoins: filtered, currentPage: 1 });
  },

  // Pagination controls
  setCurrentPage: (page) => set({ currentPage: page }),

  nextPage: () => {
    const { currentPage, filteredCoins, coinsPerPage } = get();
    const totalPages = Math.ceil(filteredCoins.length / coinsPerPage);
    if (currentPage < totalPages) {
      set({ currentPage: currentPage + 1 });
    }
  },

  prevPage: () => {
    const { currentPage } = get();
    if (currentPage > 1) {
      set({ currentPage: currentPage - 1 });
    }
  },

  // Loading and connection states
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setConnected: (connected) => set({ isConnected: connected }),
  setHighlightedCoin: (symbol) => set({ highlightedCoin: symbol }),
}));

/**
 * Helper function to filter coins by search query
 * Matches against symbol and base asset
 */
function filterCoins(coins: CoinData[], query: string): CoinData[] {
  if (!query.trim()) return coins;
  const lowerQuery = query.toLowerCase();
  return coins.filter(
    (coin) =>
      coin.symbol.toLowerCase().includes(lowerQuery) ||
      coin.baseAsset.toLowerCase().includes(lowerQuery)
  );
}
