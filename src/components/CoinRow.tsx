/**
 * Individual coin row component
 * Displays coin symbol, price, and percentage change with animations
 */

import { memo, useState, useEffect } from "react";
import type { CoinData } from "@/types/crypto";
import { formatPrice, formatPercent, formatVolume } from "@/lib/binanceApi";
import { TrendingUp, TrendingDown } from "lucide-react";

interface CoinRowProps {
  coin: CoinData;
  rank: number;
  isHighlighted?: boolean;
}

/**
 * Memoized coin row for performance
 * Prevents unnecessary re-renders when other coins update
 */
export const CoinRow = memo(function CoinRow({
  coin,
  rank,
  isHighlighted = false,
}: CoinRowProps) {
  const [flash, setFlash] = useState<"up" | "down" | null>(null);
  const [prevPrice, setPrevPrice] = useState(coin.lastPrice);

  // Flash effect when price changes
  useEffect(() => {
    if (coin.lastPrice !== prevPrice) {
      setFlash(coin.lastPrice > prevPrice ? "up" : "down");
      setPrevPrice(coin.lastPrice);

      // Remove flash after animation
      const timeout = setTimeout(() => setFlash(null), 500);
      return () => clearTimeout(timeout);
    }
  }, [coin.lastPrice, prevPrice]);

  const isGainer = coin.priceChangePercent >= 0;

  return (
    <div
      className={`
        group relative flex items-center gap-4 px-4 py-3 
        backdrop-blur-sm rounded-lg border transition-all duration-300
        ${
          isHighlighted
            ? "bg-primary/20 border-primary/50 shadow-lg shadow-primary/20"
            : "bg-card/50 border-border/50 hover:bg-card hover:border-primary/30"
        }
        ${flash === "up" ? "animate-flash-green" : ""}
        ${flash === "down" ? "animate-flash-red" : ""}
      `}
    >
      {/* Rank indicator */}
      <div className="w-8 text-center">
        <span className="text-xs font-mono text-muted-foreground">#{rank}</span>
      </div>

      {/* Coin symbol and base asset */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">
            {coin.baseAsset}
          </span>
          <span className="text-xs text-muted-foreground">/USDT</span>
        </div>
        <div className="text-xs text-muted-foreground mt-0.5">
          Vol: ${formatVolume(coin.volume)}
        </div>
      </div>

      {/* Price */}
      <div className="text-right">
        <div className="font-mono font-medium text-foreground">
          ${formatPrice(coin.lastPrice)}
        </div>
      </div>

      {/* Percentage change badge */}
      <div
        className={`
          flex items-center gap-1 px-3 py-1.5 rounded-md font-mono text-sm font-medium
          ${isGainer ? "bg-gain/20 text-gain" : "bg-loss/20 text-loss"}
        `}
      >
        {isGainer ? (
          <TrendingUp className="w-3.5 h-3.5" />
        ) : (
          <TrendingDown className="w-3.5 h-3.5" />
        )}
        <span>{formatPercent(coin.priceChangePercent)}</span>
      </div>

      {/* Hover glow effect */}
      <div
        className={`
          absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 
          transition-opacity duration-300 pointer-events-none
          ${isGainer ? "shadow-glow-gain" : "shadow-glow-loss"}
        `}
      />
    </div>
  );
});
