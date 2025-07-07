import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Search, TrendingUp, Users, Clock, Star, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import GameCard from '@/components/GameCard';
import { useData } from '@/contexts/DataContext';

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { games, blogPosts } = useData();

  const featuredGames = [...games]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 3);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/juegos?search=${encodeURIComponent(searchTerm)}`;
    }
  };

  const stats = [
    { icon: TrendingUp, label: 'Juegos Reseñados', value: games.length },
    { icon: Users, label: 'Para Toda la Familia', value: '2-8 jugadores' },
    { icon: Clock, label: 'Desde', value: '15 minutos' },
    { icon: Star, label: 'Rating Promedio', value: '4.5/5' }
  ];

  return (
    <>
      <Helmet>
        <title>Mesa & Dados - Tu Catálogo Personal de Juegos de Mesa</title>
        <meta name="description" content="Descubre los mejores juegos de mesa con reseñas detalladas, filtros avanzados y recomendaciones personalizadas. Tu guía definitiva para encontrar tu próximo juego favorito." />
      </Helmet>

      <div className="min-h-screen">
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20"></div>
          
          <div className="relative max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h1 className="text-4xl md:text-6xl font-bold">
                <span className="gradient-text">Mesa & Dados</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                Tu catálogo personal de juegos de mesa con reseñas detalladas y recomendaciones que realmente importan
              </p>

              <motion.form
                onSubmit={handleSearch}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="max-w-2xl mx-auto"
              >
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
                  <Input
                    type="text"
                    placeholder="¿Qué juego estás buscando?"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-32 h-14 text-lg glass-effect border-white/20 text-white placeholder-gray-400 search-glow"
                  />
                  <Button
                    type="submit"
                    className="absolute right-2 top-2 h-10 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    Buscar
                  </Button>
                </div>
              </motion.form>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-16"
              >
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mb-3">
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Juegos Destacados
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Los juegos mejor valorados de nuestra colección, perfectos para empezar tu aventura
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredGames.map((game, index) => (
                <GameCard key={game.id} game={game} index={index} />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Link to="/juegos">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  Ver Todos los Juegos
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-slate-900/50 to-gray-900/50">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Últimas del Blog
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Rankings, recomendaciones y guías para sacar el máximo partido a tus juegos
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogPosts.slice(0, 3).map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="glass-effect border-white/10 card-hover h-full">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                          {post.category}
                        </Badge>
                        <span className="text-gray-400 text-sm">{post.readTime}</span>
                      </div>
                      <CardTitle className="text-white hover:text-blue-400 transition-colors">
                        <Link to={`/blog/${post.id}`}>
                          {post.title}
                        </Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 mb-4">{post.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">{post.date}</span>
                        <Link 
                          to={`/blog/${post.id}`}
                          className="text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors"
                        >
                          Leer más →
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Link to="/blog">
                <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/5">
                  Ver Todas las Entradas
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="glass-effect rounded-2xl p-12 border border-white/10"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                ¿Tienes alguna recomendación?
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Me encanta descubrir nuevos juegos. Si tienes alguna recomendación o quieres que reseñe algún juego en particular, no dudes en contactarme.
              </p>
              <Link to="/contacto">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  Enviar Recomendación
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;