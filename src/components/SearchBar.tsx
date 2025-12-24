/**
 * Search bar component
 * Provides real-time filtering of coins by symbol
 */

import { useCryptoStore } from '@/store/useCryptoStore';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SearchBar() {
  const { searchQuery, setSearchQuery } = useCryptoStore();

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search coins..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10 pr-10 bg-card/50 border-border/50 focus:border-primary/50 transition-colors"
      />
      {searchQuery && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSearchQuery('')}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
