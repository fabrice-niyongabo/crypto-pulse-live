/**
 * Pagination component
 * Provides navigation controls and page info display
 */

import { useCryptoStore } from '@/store/useCryptoStore';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Paginator() {
  const {
    filteredCoins,
    currentPage,
    coinsPerPage,
    nextPage,
    prevPage,
    setCurrentPage,
  } = useCryptoStore();

  const totalPages = Math.ceil(filteredCoins.length / coinsPerPage);
  const startItem = (currentPage - 1) * coinsPerPage + 1;
  const endItem = Math.min(currentPage * coinsPerPage, filteredCoins.length);

  // Don't render if no data
  if (filteredCoins.length === 0) return null;

  /**
   * Generate page numbers to display
   * Shows current page with neighbors and ellipsis for large ranges
   */
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 5;
    
    if (totalPages <= showPages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage > 3) pages.push('...');
      
      // Show pages around current
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) pages.push('...');
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
      {/* Page info */}
      <div className="text-sm text-muted-foreground">
        Showing{' '}
        <span className="font-medium text-foreground">{startItem}</span>
        {' - '}
        <span className="font-medium text-foreground">{endItem}</span>
        {' of '}
        <span className="font-medium text-foreground">
          {filteredCoins.length}
        </span>{' '}
        coins
      </div>

      {/* Navigation controls */}
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={prevPage}
          disabled={currentPage === 1}
          className="h-9 w-9"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {getPageNumbers().map((page, index) =>
          typeof page === 'number' ? (
            <Button
              key={page}
              variant={currentPage === page ? 'default' : 'outline'}
              size="icon"
              onClick={() => setCurrentPage(page)}
              className="h-9 w-9"
            >
              {page}
            </Button>
          ) : (
            <span
              key={`ellipsis-${index}`}
              className="px-2 text-muted-foreground"
            >
              {page}
            </span>
          )
        )}

        <Button
          variant="outline"
          size="icon"
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="h-9 w-9"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
