/**
 * Cryptocurrency Navigation Player
 * Music player-style interface for cycling through coins
 */

import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCryptoStore } from "@/store/useCryptoStore";
import { formatPrice, formatVolume } from "@/lib/binanceApi";
import type { CoinData } from "@/types/crypto";

export function CryptoPlayer() {
  const {
    filteredCoins,
    setHighlightedCoin,
    highlightedCoin,
    setCurrentPage,
    coinsPerPage,
  } = useCryptoStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Use all filtered coins for navigation (entire list, not just first page)
  const playerCoins = useMemo(() => {
    return filteredCoins;
  }, [filteredCoins]);

  // Set initial highlighted coin when coins are loaded
  useEffect(() => {
    if (playerCoins.length > 0 && !highlightedCoin) {
      setHighlightedCoin(playerCoins[0].symbol);
      setCurrentIndex(0);
    }
  }, [playerCoins, highlightedCoin, setHighlightedCoin]);

  // Update current index when highlighted coin changes externally
  useEffect(() => {
    if (highlightedCoin) {
      const index = playerCoins.findIndex(
        (coin) => coin.symbol === highlightedCoin
      );
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, [highlightedCoin, playerCoins]);

  // Navigate to the page containing the highlighted coin
  const navigateToCoinPage = (coinSymbol: string) => {
    const coinIndex = playerCoins.findIndex(
      (coin) => coin.symbol === coinSymbol
    );
    if (coinIndex !== -1) {
      const page = Math.floor(coinIndex / coinsPerPage) + 1;
      setCurrentPage(page);
    }
  };

  const currentCoin = playerCoins[currentIndex] || playerCoins[0];

  if (!currentCoin) {
    return null;
  }

  const handleNext = () => {
    if (playerCoins.length === 0) return;
    const nextIndex = (currentIndex + 1) % playerCoins.length;
    const nextCoin = playerCoins[nextIndex];
    setCurrentIndex(nextIndex);
    setHighlightedCoin(nextCoin.symbol);
    // Navigate to the page containing the next coin
    navigateToCoinPage(nextCoin.symbol);
  };

  const handlePrevious = () => {
    if (playerCoins.length === 0) return;
    const prevIndex =
      (currentIndex - 1 + playerCoins.length) % playerCoins.length;
    const prevCoin = playerCoins[prevIndex];
    setCurrentIndex(prevIndex);
    setHighlightedCoin(prevCoin.symbol);
    // Navigate to the page containing the previous coin
    navigateToCoinPage(prevCoin.symbol);
  };

  const handleCoinClick = () => {
    if (!currentCoin) return;
    // Format symbol with underscore for Binance URL (e.g., CREAM_USDT)
    const binanceSymbol = `${currentCoin.baseAsset}_USDT`;
    const binanceUrl = `https://www.binance.com/en/trade/${binanceSymbol}`;
    window.open(binanceUrl, "_blank", "noopener,noreferrer");
  };

  if (playerCoins.length === 0) {
    return null;
  }

  return (
    <div className="p-6 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm shadow-lg">
      {/* Player Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Coin Navigator
        </div>
        <div className="text-xs text-muted-foreground">
          {currentIndex + 1}/{playerCoins.length}
        </div>
      </div>

      {/* Coin Display */}
      <div className="mb-4">
        <button
          onClick={handleCoinClick}
          className="w-full text-left group cursor-pointer transition-all hover:opacity-80"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                {currentCoin.baseAsset}/USDT
              </h3>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-primary">
              ${formatPrice(currentCoin.lastPrice)}
            </div>
            <div className="text-xs text-muted-foreground">
              24h Volume: ${formatVolume(currentCoin.volume)}
            </div>
          </div>
        </button>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevious}
          className="h-12 w-12 rounded-full border-2 border-border hover:bg-primary/10 hover:border-primary hover:text-primary transition-all flex-shrink-0"
          aria-label="Previous coin"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <div className="flex gap-1.5 items-center max-w-md overflow-hidden">
          {playerCoins.length <= 50 ? (
            playerCoins.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all flex-shrink-0 ${
                  index === currentIndex
                    ? "w-6 bg-primary"
                    : "w-1.5 bg-muted-foreground/30"
                }`}
              />
            ))
          ) : (
            <div className="text-xs text-muted-foreground px-2">
              {currentIndex + 1} / {playerCoins.length}
            </div>
          )}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          className="h-12 w-12 rounded-full border-2 border-border hover:bg-primary/10 hover:border-primary hover:text-primary transition-all flex-shrink-0"
          aria-label="Next coin"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
