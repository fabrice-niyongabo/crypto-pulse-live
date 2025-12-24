/**
 * Coin list component
 * Renders paginated list of coins with loading and error states
 */

import { useCryptoStore } from "@/store/useCryptoStore";
import { CoinRow } from "./CoinRow";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useRef } from "react";

export function CoinList() {
  const {
    filteredCoins,
    currentPage,
    coinsPerPage,
    isLoading,
    error,
    highlightedCoin,
  } = useCryptoStore();
  const highlightedRef = useRef<HTMLDivElement>(null);

  // Calculate pagination bounds
  const startIndex = (currentPage - 1) * coinsPerPage;
  const endIndex = startIndex + coinsPerPage;
  const paginatedCoins = filteredCoins.slice(startIndex, endIndex);

  // Scroll to highlighted coin when it changes or page changes
  useEffect(() => {
    if (highlightedCoin && highlightedRef.current) {
      // Small delay to ensure DOM is updated after pagination
      const timeout = setTimeout(() => {
        highlightedRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [highlightedCoin, currentPage]);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: coinsPerPage }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-4 py-3 bg-card/50 rounded-lg border border-border/50"
          >
            <Skeleton className="w-8 h-4" />
            <Skeleton className="flex-1 h-10" />
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-20 h-8" />
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-loss text-lg font-medium mb-2">
          Failed to load data
        </div>
        <p className="text-muted-foreground text-sm">{error}</p>
      </div>
    );
  }

  // Empty state
  if (paginatedCoins.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-muted-foreground text-lg">No coins found</div>
        <p className="text-muted-foreground/70 text-sm mt-1">
          Try adjusting your search query
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {paginatedCoins.map((coin, index) => {
        const isHighlighted = coin.symbol === highlightedCoin;
        return (
          <div key={coin.symbol} ref={isHighlighted ? highlightedRef : null}>
            <CoinRow
              coin={coin}
              rank={startIndex + index + 1}
              isHighlighted={isHighlighted}
            />
          </div>
        );
      })}
    </div>
  );
}
