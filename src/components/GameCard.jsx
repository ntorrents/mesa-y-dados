
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Clock, Star, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const GameCard = ({ game, index = 0 }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Fácil': return 'difficulty-easy';
      case 'Medio': return 'difficulty-medium';
      case 'Difícil': return 'difficulty-hard';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryColor = (category) => {
    const categoryMap = {
      'Estrategia': 'category-strategy',
      'Party': 'category-party',
      'Cooperativo': 'category-cooperative',
      'Familiar': 'category-family',
      'Abstracto': 'category-abstract'
    };
    return categoryMap[category] || 'bg-blue-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <Card className="glass-effect border-white/10 overflow-hidden card-hover h-full">
        <div className="relative">
          <img  
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            alt={`Portada del juego ${game.name}`}
           src="https://images.unsplash.com/photo-1688984966950-080aa5e3998c" />
          
          {/* Overlay con información rápida */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center justify-between text-white text-sm">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>{game.players}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>{game.duration}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Badge de dificultad */}
          <div className="absolute top-3 right-3">
            <Badge className={`${getDifficultyColor(game.difficulty)} text-white border-0`}>
              {game.difficulty}
            </Badge>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Título y edad */}
            <div>
              <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                {game.name}
              </h3>
              <p className="text-gray-400 text-sm">Edad: {game.minAge}+</p>
            </div>

            {/* Categorías */}
            <div className="flex flex-wrap gap-2">
              {game.categories.map((category, idx) => (
                <Badge 
                  key={idx} 
                  className={`${getCategoryColor(category)} text-white border-0 text-xs`}
                >
                  {category}
                </Badge>
              ))}
            </div>

            {/* Rating */}
            {game.rating && (
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-yellow-400 font-medium">{game.rating}</span>
                <span className="text-gray-400 text-sm">/5</span>
              </div>
            )}

            {/* Descripción corta */}
            <p className="text-gray-300 text-sm line-clamp-2">
              {game.shortDescription || game.review?.substring(0, 100) + '...'}
            </p>

            {/* Botones de acción */}
            <div className="flex items-center justify-between pt-2">
              <Link 
                to={`/juego/${game.id}`}
                className="text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors"
              >
                Ver detalles →
              </Link>
              
              {game.externalLink && (
                <a
                  href={game.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default GameCard;
