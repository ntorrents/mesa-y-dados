import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';

const FilterSidebar = ({ onSearch, onFilter, filters, onClearFilters }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [localFilters, setLocalFilters] = useState({
    players: [1, 8],
    duration: [15, 240],
    minAge: [3, 18],
    categories: [],
    difficulty: ''
  });
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    players: true,
    duration: true,
    age: true,
    difficulty: true
  });

  const categories = ['Estrategia', 'Party', 'Cooperativo', 'Familiar', 'Abstracto', 'Comercio', 'Cartas', 'Subasta'];
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

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const hasActiveFilters = 
    localFilters.categories.length > 0 || 
    localFilters.difficulty !== '' ||
    searchTerm !== '';

  const FilterSection = ({ title, sectionKey, children }) => (
    <div className="border-b border-white/10 pb-4 mb-4">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full text-left text-white font-medium mb-3 hover:text-blue-400 transition-colors"
      >
        <span className="text-sm">{title}</span>
        {expandedSections[sectionKey] ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>
      {expandedSections[sectionKey] && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      )}
    </div>
  );

  return (
    <div className="w-80 glass-effect rounded-lg p-6 border border-white/10 h-fit sticky top-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-white">Filtros</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-gray-400 hover:text-white text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Limpiar
          </Button>
        )}
      </div>

      {/* Búsqueda */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Buscar juegos..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 glass-effect border-white/20 text-white placeholder-gray-400 text-sm h-9"
          />
        </div>
      </div>

      {/* Filtros activos */}
      {hasActiveFilters && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <Badge className="bg-blue-500 text-white text-xs">
                "{searchTerm}"
              </Badge>
            )}
            {localFilters.categories.map(category => (
              <Badge key={category} className="bg-blue-500 text-white text-xs">
                {category}
              </Badge>
            ))}
            {localFilters.difficulty && (
              <Badge className="bg-blue-500 text-white text-xs">
                {localFilters.difficulty}
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Categorías */}
      <FilterSection title="Categorías" sectionKey="categories">
        <div className="grid grid-cols-2 gap-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={localFilters.categories.includes(category) ? "default" : "outline"}
              className={`cursor-pointer transition-colors text-xs py-1 px-2 ${
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
      </FilterSection>

      {/* Número de jugadores */}
      <FilterSection title="Jugadores" sectionKey="players">
        <div className="space-y-3">
          <div className="text-white text-sm">
            {localFilters.players[0]} - {localFilters.players[1]} jugadores
          </div>
          <Slider
            value={localFilters.players}
            onValueChange={(value) => handleFilterChange('players', value)}
            max={8}
            min={1}
            step={1}
            className="w-full"
          />
        </div>
      </FilterSection>

      {/* Duración */}
      <FilterSection title="Duración" sectionKey="duration">
        <div className="space-y-3">
          <div className="text-white text-sm">
            {localFilters.duration[0]} - {localFilters.duration[1]} min
          </div>
          <Slider
            value={localFilters.duration}
            onValueChange={(value) => handleFilterChange('duration', value)}
            max={240}
            min={15}
            step={15}
            className="w-full"
          />
        </div>
      </FilterSection>

      {/* Edad mínima */}
      <FilterSection title="Edad" sectionKey="age">
        <div className="space-y-3">
          <div className="text-white text-sm">
            {localFilters.minAge[0]} - {localFilters.minAge[1]} años
          </div>
          <Slider
            value={localFilters.minAge}
            onValueChange={(value) => handleFilterChange('minAge', value)}
            max={18}
            min={3}
            step={1}
            className="w-full"
          />
        </div>
      </FilterSection>

      {/* Dificultad */}
      <FilterSection title="Dificultad" sectionKey="difficulty">
        <div className="space-y-2">
          {difficulties.map((difficulty) => (
            <Badge
              key={difficulty}
              variant={localFilters.difficulty === difficulty ? "default" : "outline"}
              className={`cursor-pointer transition-colors text-xs py-1 px-3 w-full justify-center ${
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
      </FilterSection>
    </div>
  );
};

export default FilterSidebar;