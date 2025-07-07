import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Clock, Star, ExternalLink, ThumbsUp, ThumbsDown, BookOpen, Zap, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';

const GameDetailPage = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const { games } = useData();
  const [game, setGame] = useState(null);
  const [relatedGames, setRelatedGames] = useState([]);
  const [activeTab, setActiveTab] = useState('resumen');

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
      'Abstracto': 'category-abstract',
      'Comercio': 'category-cooperative',
      'Cartas': 'category-strategy',
      'Subasta': 'category-party'
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

  const getFullRules = (game) => {
    // Generate comprehensive rules based on game type
    const baseRules = `
## Objetivo del Juego
${game.name === 'Wingspan' ? 'Construye el mejor hábitat para aves y acumula la mayor cantidad de puntos a través de cartas de ave, objetivos y huevos.' :
  game.name === 'Azul' ? 'Decora las paredes de tu palacio con hermosos azulejos, completando patrones para ganar puntos.' :
  game.name === 'Pandemic' ? 'Trabajad en equipo para encontrar las curas de cuatro enfermedades antes de que se extienda una pandemia global.' :
  game.name === 'Catan' ? 'Sé el primero en alcanzar 10 puntos de victoria construyendo asentamientos, ciudades y carreteras en la isla de Catan.' :
  'Alcanza la condición de victoria específica del juego antes que tus oponentes.'}

## Preparación
1. **Configuración inicial**: Coloca el tablero en el centro de la mesa
2. **Distribución de componentes**: Cada jugador recibe su material inicial
3. **Cartas iniciales**: Baraja y reparte las cartas según las reglas
4. **Determinación del primer jugador**: El jugador más joven comienza

## Desarrollo del Juego
### Estructura de Turno
Cada turno consta de las siguientes fases:

1. **Fase de Acción Principal**
   - Realiza tu acción principal del turno
   - Aplica cualquier efecto inmediato

2. **Fase de Resolución**
   - Resuelve efectos secundarios
   - Actualiza marcadores si es necesario

3. **Fase de Preparación**
   - Prepara el turno del siguiente jugador
   - Roba cartas si es necesario

### Acciones Disponibles
${game.categories.includes('Estrategia') ? 
  '- **Planificación**: Desarrolla tu estrategia a largo plazo\n- **Gestión de recursos**: Administra eficientemente tus recursos\n- **Interacción**: Considera las acciones de otros jugadores' :
  '- **Acción rápida**: Toma decisiones inmediatas\n- **Interacción social**: Comunícate con otros jugadores'}

## Condiciones de Victoria
${game.name === 'Wingspan' ? 'El juego termina después de 4 rondas. Gana quien tenga más puntos sumando cartas de ave, objetivos, huevos y cartas de bonificación.' :
  game.name === 'Azul' ? 'El juego termina cuando un jugador completa una fila horizontal. Gana quien tenga más puntos tras la puntuación final.' :
  game.name === 'Pandemic' ? 'Ganáis si encontráis las 4 curas. Perdéis si se agotan los cubos de enfermedad, las cartas del mazo o hay 8 brotes.' :
  'El primer jugador en alcanzar la condición de victoria específica gana la partida.'}

## Reglas Especiales
- **Empates**: En caso de empate, se aplican los criterios de desempate específicos
- **Errores**: Si se comete un error, retrocede al estado anterior si es posible
- **Variantes**: Consulta el manual para variantes opcionales del juego
    `;
    
    return baseRules;
  };

  const getQuickRules = (game) => {
    return `
## Configuración Rápida (2 minutos)
• **Jugadores**: ${game.players} | **Edad**: ${game.minAge}+ | **Duración**: ${game.duration}

## Objetivo
${game.name === 'Wingspan' ? '🎯 Acumula más puntos con aves, huevos y objetivos' :
  game.name === 'Azul' ? '🎯 Completa patrones de azulejos para ganar puntos' :
  game.name === 'Pandemic' ? '🎯 Encontrad las 4 curas antes de que se extienda la pandemia' :
  game.name === 'Catan' ? '🎯 Alcanza 10 puntos de victoria primero' :
  '🎯 Cumple la condición de victoria antes que los demás'}

## Tu Turno (30 segundos)
${game.categories.includes('Estrategia') ? 
  '1. **Elige** tu acción principal\n2. **Ejecuta** la acción y sus efectos\n3. **Prepara** el siguiente turno' :
  '1. **Actúa** rápidamente\n2. **Interactúa** con otros jugadores\n3. **Pasa** el turno'}

## Puntuación Rápida
${game.name === 'Wingspan' ? '• Cartas de ave + huevos + objetivos + bonificaciones' :
  game.name === 'Azul' ? '• Azulejos colocados + patrones completos + bonificaciones' :
  game.name === 'Pandemic' ? '• Cooperativo: todos ganan o todos pierden' :
  '• Consulta la tabla de puntuación del juego'}

## Consejos Express
✅ **Haz**: ${game.pros?.[0] || 'Planifica tus movimientos'}
❌ **Evita**: ${game.cons?.[0] || 'Decisiones apresuradas'}

## Fin del Juego
🏁 **Termina cuando**: ${game.name === 'Wingspan' ? 'Se completan 4 rondas' :
  game.name === 'Azul' ? 'Alguien completa una fila horizontal' :
  game.name === 'Pandemic' ? 'Se encuentran las 4 curas o se pierde' :
  'Se cumple la condición de victoria'}
    `;
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
            {/* Sidebar con información del juego */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-1"
            >
              <Card className="glass-effect border-white/10 sticky top-8">
                <CardContent className="p-6">
                  <img   
                    className="w-full h-48 object-cover rounded-lg mb-6"
                    alt={`Portada del juego ${game.name}`}
                    src="https://images.unsplash.com/photo-1688494098221-e0d43c0602ed?auto=format&fit=crop&w=400&q=60" />

                  <div className="space-y-4">
                    {game.rating && (
                      <div className="flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg">
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        <span className="text-xl font-bold text-yellow-400">{game.rating}</span>
                        <span className="text-gray-400">/5</span>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 glass-effect rounded-lg">
                        <Users className="h-5 w-5 text-blue-400 mx-auto mb-2" />
                        <div className="text-white font-medium text-sm">{game.players}</div>
                        <div className="text-gray-400 text-xs">Jugadores</div>
                      </div>
                      <div className="text-center p-3 glass-effect rounded-lg">
                        <Clock className="h-5 w-5 text-green-400 mx-auto mb-2" />
                        <div className="text-white font-medium text-sm">{game.duration}</div>
                        <div className="text-gray-400 text-xs">Duración</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 glass-effect rounded-lg">
                        <div className="text-white font-medium text-sm">{game.minAge}+</div>
                        <div className="text-gray-400 text-xs">Edad mínima</div>
                      </div>
                      <div className="text-center p-3 glass-effect rounded-lg">
                        <Badge className={`${getDifficultyColor(game.difficulty)} text-white border-0 text-xs`}>
                          {game.difficulty}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-white font-medium mb-2 text-sm">Categorías</h3>
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
                    </div>

                    <Button 
                      onClick={handleExternalLink}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-sm"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Ver en BoardGameGeek
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contenido principal con tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Título del juego */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-3">
                  {game.name}
                </h1>
                <p className="text-lg text-gray-300">
                  {game.shortDescription}
                </p>
              </div>

              {/* Navegación por tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 glass-effect border-white/10">
                  <TabsTrigger value="resumen" className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4" />
                    Resumen
                  </TabsTrigger>
                  <TabsTrigger value="reglas-completas" className="flex items-center gap-2 text-sm">
                    <BookOpen className="h-4 w-4" />
                    Reglas Completas
                  </TabsTrigger>
                  <TabsTrigger value="reglas-rapidas" className="flex items-center gap-2 text-sm">
                    <Zap className="h-4 w-4" />
                    Reglas Rápidas
                  </TabsTrigger>
                </TabsList>

                {/* Contenido del tab Resumen */}
                <TabsContent value="resumen" className="space-y-6 mt-6">
                  <Card className="glass-effect border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white">Mi Reseña</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-invert max-w-none">
                        <p className="text-gray-300 leading-relaxed">
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
                            <CardTitle className="text-green-400 flex items-center text-lg">
                              <ThumbsUp className="h-5 w-5 mr-2" />
                              Lo que me gusta
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {game.pros.map((pro, idx) => (
                                <li key={idx} className="text-gray-300 flex items-start text-sm">
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
                            <CardTitle className="text-red-400 flex items-center text-lg">
                              <ThumbsDown className="h-5 w-5 mr-2" />
                              Puntos a mejorar
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {game.cons.map((con, idx) => (
                                <li key={idx} className="text-gray-300 flex items-start text-sm">
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
                </TabsContent>

                {/* Contenido del tab Reglas Completas */}
                <TabsContent value="reglas-completas" className="mt-6">
                  <Card className="glass-effect border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <BookOpen className="h-5 w-5 mr-2" />
                        Reglas Completas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-invert max-w-none">
                        <div className="text-gray-300 leading-relaxed space-y-4">
                          {getFullRules(game).split('\n\n').map((paragraph, index) => {
                            if (paragraph.startsWith('## ')) {
                              return (
                                <h2 key={index} className="text-xl font-bold text-white mt-6 mb-3">
                                  {paragraph.replace('## ', '')}
                                </h2>
                              );
                            } else if (paragraph.startsWith('### ')) {
                              return (
                                <h3 key={index} className="text-lg font-semibold text-blue-400 mt-4 mb-2">
                                  {paragraph.replace('### ', '')}
                                </h3>
                              );
                            } else if (paragraph.includes('- **')) {
                              const listItems = paragraph.split('\n').filter(item => item.trim());
                              return (
                                <ul key={index} className="list-disc list-inside space-y-1 ml-4">
                                  {listItems.map((item, itemIndex) => (
                                    <li key={itemIndex} className="text-gray-300 text-sm">
                                      {item.replace(/- \*\*(.*?)\*\*/, '<strong class="text-white">$1</strong>').replace(/- /, '')}
                                    </li>
                                  ))}
                                </ul>
                              );
                            } else if (paragraph.trim()) {
                              return (
                                <p key={index} className="text-gray-300 leading-relaxed text-sm">
                                  {paragraph.split('**').map((part, partIndex) => 
                                    partIndex % 2 === 1 ? (
                                      <strong key={partIndex} className="text-white font-semibold">
                                        {part}
                                      </strong>
                                    ) : (
                                      part
                                    )
                                  )}
                                </p>
                              );
                            }
                            return null;
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Contenido del tab Reglas Rápidas */}
                <TabsContent value="reglas-rapidas" className="mt-6">
                  <Card className="glass-effect border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Zap className="h-5 w-5 mr-2" />
                        Reglas Rápidas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-invert max-w-none">
                        <div className="text-gray-300 leading-relaxed space-y-4">
                          {getQuickRules(game).split('\n\n').map((paragraph, index) => {
                            if (paragraph.startsWith('## ')) {
                              return (
                                <h2 key={index} className="text-lg font-bold text-white mt-4 mb-2 flex items-center">
                                  {paragraph.replace('## ', '')}
                                </h2>
                              );
                            } else if (paragraph.includes('•')) {
                              const listItems = paragraph.split('\n').filter(item => item.includes('•'));
                              return (
                                <div key={index} className="space-y-2">
                                  {listItems.map((item, itemIndex) => (
                                    <div key={itemIndex} className="text-gray-300 text-sm flex items-start">
                                      <span className="text-blue-400 mr-2">•</span>
                                      <span>{item.replace('• ', '')}</span>
                                    </div>
                                  ))}
                                </div>
                              );
                            } else if (paragraph.includes('1. ') || paragraph.includes('2. ') || paragraph.includes('3. ')) {
                              const listItems = paragraph.split('\n').filter(item => /^\d+\./.test(item.trim()));
                              return (
                                <ol key={index} className="list-decimal list-inside space-y-1 ml-4">
                                  {listItems.map((item, itemIndex) => (
                                    <li key={itemIndex} className="text-gray-300 text-sm">
                                      {item.replace(/^\d+\.\s*/, '').split('**').map((part, partIndex) => 
                                        partIndex % 2 === 1 ? (
                                          <strong key={partIndex} className="text-white">
                                            {part}
                                          </strong>
                                        ) : (
                                          part
                                        )
                                      )}
                                    </li>
                                  ))}
                                </ol>
                              );
                            } else if (paragraph.trim()) {
                              return (
                                <p key={index} className="text-gray-300 leading-relaxed text-sm">
                                  {paragraph.split('**').map((part, partIndex) => 
                                    partIndex % 2 === 1 ? (
                                      <strong key={partIndex} className="text-white font-semibold">
                                        {part}
                                      </strong>
                                    ) : (
                                      part
                                    )
                                  )}
                                </p>
                              );
                            }
                            return null;
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Juegos relacionados */}
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
                          <h4 className="text-white font-medium group-hover:text-blue-400 transition-colors text-sm">
                            {relatedGame.name}
                          </h4>
                          <p className="text-gray-400 text-xs mt-1">
                            {relatedGame.players} • {relatedGame.duration}
                          </p>
                          {relatedGame.rating && (
                            <div className="flex items-center mt-2">
                              <Star className="h-3 w-3 text-yellow-400 fill-current" />
                              <span className="text-yellow-400 text-xs ml-1">{relatedGame.rating}</span>
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