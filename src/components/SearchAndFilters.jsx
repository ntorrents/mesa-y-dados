
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';

const SearchAndFilters = ({ onSearch, onFilter, filters, onClearFilters }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    players: [1, 8],
    duration: [15, 240],
    minAge: [3, 18],
    categories: [],
    difficulty: ''
  });

  const categories = ['Estrategia', 'Party', 'Cooperativo', 'Familiar', 'Abstracto', 'Temático'];
  const difficulties = ['Fácil', 'Medio', 'Difícil'];

  const handleSearch = (value) => {
    setSearchTerm(value);
    onSearch(value);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilter(newFilters);
  };

  const toggleCategory = (category) => {
    const newCategories = localFilters.categories.includes(category)
      ? localFilters.categories.filter(c => c !== category)
      : [...localFilters.categories, category];
    handleFilterChange('categories', newCategories);
  };

  const clearAllFilters = () => {
    const resetFilters = {
      players: [1, 8],
      duration: [15, 240],
      minAge: [3, 18],
      categories: [],
      difficulty: ''
    };
    setLocalFilters(resetFilters);
    setSearchTerm('');
    onClearFilters();
    onSearch('');
  };

  const hasActiveFilters = 
    localFilters.categories.length > 0 || 
    localFilters.difficulty !== '' ||
    searchTerm !== '';

  return (
    <div className="space-y-6">
      {/* Barra de búsqueda */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="text"
          placeholder="Buscar juegos por nombre..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 glass-effect border-white/20 text-white placeholder-gray-400 search-glow"
        />
      </div>

      {/* Botón de filtros y filtros activos */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="border-white/20 text-white hover:bg-white/5"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtros
          {hasActiveFilters && (
            <Badge className="ml-2 bg-blue-500 text-white">
              {localFilters.categories.length + (localFilters.difficulty ? 1 : 0) + (searchTerm ? 1 : 0)}
            </Badge>
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={clearAllFilters}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4 mr-2" />
            Limpiar filtros
          </Button>
        )}
      </div>

      {/* Panel de filtros */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="glass-effect rounded-lg p-6 border border-white/10 space-y-6"
        >
          {/* Número de jugadores */}
          <div>
            <label className="text-white font-medium mb-3 block">
              Número de jugadores: {localFilters.players[0]} - {localFilters.players[1]}
            </label>
            <Slider
              value={localFilters.players}
              onValueChange={(value) => handleFilterChange('players', value)}
              max={8}
              min={1}
              step={1}
              className="w-full"
            />
          </div>

          {/* Duración */}
          <div>
            <label className="text-white font-medium mb-3 block">
              Duración: {localFilters.duration[0]} - {localFilters.duration[1]} min
            </label>
            <Slider
              value={localFilters.duration}
              onValueChange={(value) => handleFilterChange('duration', value)}
              max={240}
              min={15}
              step={15}
              className="w-full"
            />
          </div>

          {/* Edad mínima */}
          <div>
            <label className="text-white font-medium mb-3 block">
              Edad mínima: {localFilters.minAge[0]} - {localFilters.minAge[1]} años
            </label>
            <Slider
              value={localFilters.minAge}
              onValueChange={(value) => handleFilterChange('minAge', value)}
              max={18}
              min={3}
              step={1}
              className="w-full"
            />
          </div>

          {/* Categorías */}
          <div>
            <label className="text-white font-medium mb-3 block">Categorías</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={localFilters.categories.includes(category) ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    localFilters.categories.includes(category)
                      ? 'bg-blue-500 text-white'
                      : 'border-white/20 text-gray-300 hover:bg-white/5'
                  }`}
                  onClick={() => toggleCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* Dificultad */}
          <div>
            <label className="text-white font-medium mb-3 block">Dificultad</label>
            <div className="flex gap-2">
              {difficulties.map((difficulty) => (
                <Badge
                  key={difficulty}
                  variant={localFilters.difficulty === difficulty ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    localFilters.difficulty === difficulty
                      ? 'bg-blue-500 text-white'
                      : 'border-white/20 text-gray-300 hover:bg-white/5'
                  }`}
                  onClick={() => handleFilterChange('difficulty', 
                    localFilters.difficulty === difficulty ? '' : difficulty
                  )}
                >
                  {difficulty}
                </Badge>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SearchAndFilters;
