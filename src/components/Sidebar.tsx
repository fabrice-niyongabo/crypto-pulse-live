/**
 * Main sidebar component
 * Contains header, search, coin list, and pagination
 */

import { useEffect } from 'react';
import { useCryptoStore } from '@/store/useCryptoStore';
import { useBinanceWebSocket } from '@/hooks/useBinanceWebSocket';
import { fetchTopGainers } from '@/lib/binanceApi';
import { SearchBar } from './SearchBar';
import { CoinList } from './CoinList';
import { Paginator } from './Paginator';
import { ConnectionStatus } from './ConnectionStatus';
import { TrendingUp, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Sidebar() {
  const { setCoins, setLoading, setError, isLoading } = useCryptoStore();
  const { reconnect } = useBinanceWebSocket();

  /**
   * Fetch initial coin data on component mount
   */
  useEffect(() => {
    async function loadCoins() {
      setLoading(true);
      setError(null);
      
      try {
        const coins = await fetchTopGainers();
        setCoins(coins);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Failed to load coins'
        );
      }
    }

    loadCoins();
  }, [setCoins, setLoading, setError]);

  /**
   * Refresh data and reconnect WebSocket
   */
  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const coins = await fetchTopGainers();
      setCoins(coins);
      reconnect();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to refresh'
      );
    }
  };

  return (
    <div className="flex flex-col h-full bg-sidebar border-r border-border/50">
      {/* Header */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Top Gainers
              </h1>
              <p className="text-xs text-muted-foreground">
                USDT Pairs • 24h Change
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            disabled={isLoading}
            className="text-muted-foreground hover:text-foreground"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
            />
          </Button>
        </div>

        {/* Connection status */}
        <div className="flex items-center justify-between mb-4">
          <ConnectionStatus />
        </div>

        {/* Search bar */}
        <SearchBar />
      </div>

      {/* Coin list - scrollable */}
      <div className="flex-1 overflow-y-auto p-4">
        <CoinList />
      </div>

      {/* Pagination - fixed at bottom */}
      <div className="p-4 border-t border-border/50">
        <Paginator />
      </div>
    </div>
  );
}
