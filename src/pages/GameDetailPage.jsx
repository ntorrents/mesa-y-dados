import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Clock, Star, ExternalLink, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';

const GameDetailPage = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const { games } = useData();
  const [game, setGame] = useState(null);
  const [relatedGames, setRelatedGames] = useState([]);

  useEffect(() => {
    if (games.length > 0) {
      const gameId = parseInt(id);
      const foundGame = games.find(g => g.id === gameId);
      
      if (foundGame) {
        setGame(foundGame);
        
        const related = games
          .filter(g => 
            g.id !== gameId && 
            g.categories.some(cat => foundGame.categories.includes(cat))
          )
          .slice(0, 3);
        setRelatedGames(related);
      }
    }
  }, [id, games]);

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

  const handleExternalLink = () => {
    if (game?.externalLink) {
      window.open(game.externalLink, '_blank');
    } else {
      toast({
        title: "🚧 Esta funcionalidad no está implementada aún—¡pero no te preocupes! ¡Puedes solicitarla en tu próximo prompt! 🚀"
      });
    }
  };

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Juego no encontrado</h2>
          <Link to="/juegos">
            <Button variant="outline">Volver al catálogo</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{game.name} - Mesa & Dados</title>
        <meta name="description" content={`Reseña completa de ${game.name}: ${game.shortDescription}`} />
      </Helmet>

      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link to="/juegos" className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al catálogo
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-1"
            >
              <Card className="glass-effect border-white/10 sticky top-8">
                <CardContent className="p-6">
                  <img   
                    class="w-full h-64 object-cover rounded-lg mb-6"
                    alt={`Portada del juego ${game.name}`}
                    src="https://images.unsplash.com/photo-1688494098221-e0d43c0602ed" />

                  <div className="space-y-4">
                    {game.rating && (
                      <div className="flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg">
                        <Star className="h-6 w-6 text-yellow-400 fill-current" />
                        <span className="text-2xl font-bold text-yellow-400">{game.rating}</span>
                        <span className="text-gray-400">/5</span>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 glass-effect rounded-lg">
                        <Users className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                        <div className="text-white font-medium">{game.players}</div>
                        <div className="text-gray-400 text-sm">Jugadores</div>
                      </div>
                      <div className="text-center p-3 glass-effect rounded-lg">
                        <Clock className="h-6 w-6 text-green-400 mx-auto mb-2" />
                        <div className="text-white font-medium">{game.duration}</div>
                        <div className="text-gray-400 text-sm">Duración</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 glass-effect rounded-lg">
                        <div className="text-white font-medium">{game.minAge}+</div>
                        <div className="text-gray-400 text-sm">Edad mínima</div>
                      </div>
                      <div className="text-center p-3 glass-effect rounded-lg">
                        <Badge className={`${getDifficultyColor(game.difficulty)} text-white border-0`}>
                          {game.difficulty}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-white font-medium mb-2">Categorías</h3>
                      <div className="flex flex-wrap gap-2">
                        {game.categories.map((category, idx) => (
                          <Badge 
                            key={idx} 
                            className={`${getCategoryColor(category)} text-white border-0`}
                          >
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button 
                      onClick={handleExternalLink}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Ver en BoardGameGeek
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2 space-y-8"
            >
              <div>
                <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
                  {game.name}
                </h1>
                <p className="text-xl text-gray-300">
                  {game.shortDescription}
                </p>
              </div>

              <Card className="glass-effect border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Mi Reseña</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 leading-relaxed text-lg">
                      {game.review}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {(game.pros?.length > 0 || game.cons?.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {game.pros?.length > 0 && (
                    <Card className="glass-effect border-white/10">
                      <CardHeader>
                        <CardTitle className="text-green-400 flex items-center">
                          <ThumbsUp className="h-5 w-5 mr-2" />
                          Lo que me gusta
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {game.pros.map((pro, idx) => (
                            <li key={idx} className="text-gray-300 flex items-start">
                              <span className="text-green-400 mr-2">•</span>
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {game.cons?.length > 0 && (
                    <Card className="glass-effect border-white/10">
                      <CardHeader>
                        <CardTitle className="text-red-400 flex items-center">
                          <ThumbsDown className="h-5 w-5 mr-2" />
                          Puntos a mejorar
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {game.cons.map((con, idx) => (
                            <li key={idx} className="text-gray-300 flex items-start">
                              <span className="text-red-400 mr-2">•</span>
                              {con}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {relatedGames.length > 0 && (
                <Card className="glass-effect border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Juegos Relacionados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {relatedGames.map((relatedGame) => (
                        <Link
                          key={relatedGame.id}
                          to={`/juego/${relatedGame.id}`}
                          className="block p-4 glass-effect rounded-lg border border-white/10 hover:border-blue-500/30 transition-colors group"
                        >
                          <h4 className="text-white font-medium group-hover:text-blue-400 transition-colors">
                            {relatedGame.name}
                          </h4>
                          <p className="text-gray-400 text-sm mt-1">
                            {relatedGame.players} • {relatedGame.duration}
                          </p>
                          {relatedGame.rating && (
                            <div className="flex items-center mt-2">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-yellow-400 text-sm ml-1">{relatedGame.rating}</span>
                            </div>
                          )}
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GameDetailPage;