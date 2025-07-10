import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  itemsPerPage, 
  totalItems, 
  onPageChange, 
  onItemsPerPageChange 
}) => {
  const itemsPerPageOptions = [12, 24, 36];
  
  const getDiceIcon = (number) => {
    const diceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];
    const DiceIcon = diceIcons[(number - 1) % 6];
    return <DiceIcon className="h-4 w-4" />;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 p-6 glass-effect rounded-lg border border-white/10"
    >
      {/* Items info */}
      <div className="flex items-center text-gray-400 text-sm">
        <span className="flex items-center gap-2">
          🎲 Mostrando {startItem}-{endItem} de {totalItems} juegos
        </span>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-4">
        {/* Previous button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="border-white/20 text-white hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Anterior</span>
        </Button>

        {/* Page numbers */}
        <div className="flex items-center gap-2">
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            let pageNumber;
            if (totalPages <= 5) {
              pageNumber = i + 1;
            } else if (currentPage <= 3) {
              pageNumber = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNumber = totalPages - 4 + i;
            } else {
              pageNumber = currentPage - 2 + i;
            }

            const isActive = pageNumber === currentPage;
            
            return (
              <Button
                key={pageNumber}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(pageNumber)}
                className={`w-10 h-10 p-0 ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0' 
                    : 'border-white/20 text-white hover:bg-white/5'
                } flex items-center justify-center`}
              >
                {getDiceIcon(pageNumber)}
              </Button>
            );
          })}
        </div>

        {/* Next button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="border-white/20 text-white hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <span className="hidden sm:inline">Siguiente</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Items per page selector */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-400 whitespace-nowrap">Juegos por página:</span>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="bg-slate-800 border border-white/20 rounded-md px-3 py-1 text-white text-sm min-w-[80px]"
        >
          {itemsPerPageOptions.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </motion.div>
  );
};

export default Pagination;