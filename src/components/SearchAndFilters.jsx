import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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

  // Player count options
  const playerOptions = [
    { label: '1 jugador', value: [1, 1] },
    { label: '2 jugadores', value: [2, 2] },
    { label: '3-4 jugadores', value: [3, 4] },
    { label: '5-6 jugadores', value: [5, 6] },
    { label: '7+ jugadores', value: [7, 8] },
    { label: 'Cualquier número', value: [1, 8] }
  ];

  // Duration options
  const durationOptions = [
    { label: 'Rápido (15-30 min)', value: [15, 30] },
    { label: 'Medio (30-60 min)', value: [30, 60] },
    { label: 'Largo (60-120 min)', value: [60, 120] },
    { label: 'Épico (120+ min)', value: [120, 240] },
    { label: 'Cualquier duración', value: [15, 240] }
  ];

  // Age options
  const ageOptions = [
    { label: 'Niños (3-7 años)', value: [3, 7] },
    { label: 'Familiar (8-12 años)', value: [8, 12] },
    { label: 'Adolescente (13+ años)', value: [13, 18] },
    { label: 'Cualquier edad', value: [3, 18] }
  ];

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
    searchTerm !== '' ||
    JSON.stringify(localFilters.players) !== JSON.stringify([1, 8]) ||
    JSON.stringify(localFilters.duration) !== JSON.stringify([15, 240]) ||
    JSON.stringify(localFilters.minAge) !== JSON.stringify([3, 18]);

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

  const isOptionSelected = (currentValue, optionValue) => {
    return JSON.stringify(currentValue) === JSON.stringify(optionValue);
  };

  return (
    <div className="w-80 glass-effect rounded-lg border border-white/10 h-fit sticky top-8 max-h-[calc(100vh-4rem)] flex flex-col">
      {/* Fixed Header */}
      <div className="p-6 border-b border-white/10 flex-shrink-0">
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
              {!isOptionSelected(localFilters.players, [1, 8]) && (
                <Badge className="bg-blue-500 text-white text-xs">
                  {localFilters.players[0]}-{localFilters.players[1]} jugadores
                </Badge>
              )}
              {!isOptionSelected(localFilters.duration, [15, 240]) && (
                <Badge className="bg-blue-500 text-white text-xs">
                  {localFilters.duration[0]}-{localFilters.duration[1]} min
                </Badge>
              )}
              {!isOptionSelected(localFilters.minAge, [3, 18]) && (
                <Badge className="bg-blue-500 text-white text-xs">
                  {localFilters.minAge[0]}-{localFilters.minAge[1]} años
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 pt-0">
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
          <div className="space-y-2">
            {playerOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => handleFilterChange('players', option.value)}
                className={`w-full text-left p-2 rounded-md text-sm transition-colors ${
                  isOptionSelected(localFilters.players, option.value)
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Duración */}
        <FilterSection title="Duración" sectionKey="duration">
          <div className="space-y-2">
            {durationOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => handleFilterChange('duration', option.value)}
                className={`w-full text-left p-2 rounded-md text-sm transition-colors ${
                  isOptionSelected(localFilters.duration, option.value)
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Edad mínima */}
        <FilterSection title="Edad" sectionKey="age">
          <div className="space-y-2">
            {ageOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => handleFilterChange('minAge', option.value)}
                className={`w-full text-left p-2 rounded-md text-sm transition-colors ${
                  isOptionSelected(localFilters.minAge, option.value)
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                {option.label}
              </button>
            ))}
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
    </div>
  );
};

export default FilterSidebar;