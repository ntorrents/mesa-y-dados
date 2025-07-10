import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/contexts/DataContext';

const BlogPage = () => {
  const { blogPosts } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [...new Set(blogPosts.map(post => post.category))];
  
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <>
      <Helmet>
        <title>Blog - Mesa & Dados</title>
        <meta name="description" content="Rankings, recomendaciones y guías sobre juegos de mesa. Descubre nuevas estrategias y encuentra tu próximo juego favorito." />
      </Helmet>

      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              Blog
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Rankings, recomendaciones y guías para sacar el máximo partido a tus juegos de mesa
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12"
          >
            <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Buscar artículos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 glass-effect border-white/20 text-white placeholder-gray-400"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-800 border border-white/20 rounded-md px-4 py-2 text-white"
              >
                <option value="">Todas las categorías</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </motion.div>

          {featuredPosts.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-16"
            >
              <h2 className="text-2xl font-bold text-white mb-8">Artículos Destacados</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {featuredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                  >
                    <Card className="glass-effect border-white/10 card-hover h-full overflow-hidden">
                      <div className="relative">
                         <img   
                          class="w-full h-48 object-cover"
                          alt={`Imagen destacada para ${post.title}`}
                          src="https://images.unsplash.com/photo-1504983875-d3b163aba9e6" />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
                            Destacado
                          </Badge>
                        </div>
                      </div>
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                            {post.category}
                          </Badge>
                          <div className="flex items-center text-gray-400 text-sm">
                            <Clock className="h-4 w-4 mr-1" />
                            {post.readTime}
                          </div>
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
                          <div className="flex items-center text-gray-400 text-sm">
                            <Calendar className="h-4 w-4 mr-1" />
                            {post.date}
                          </div>
                          <Link 
                            to={`/blog/${post.id}`}
                            className="text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors flex items-center"
                          >
                            Leer más
                            <ArrowRight className="h-4 w-4 ml-1" />
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {regularPosts.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-white mb-8">Todos los Artículos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                  >
                    <Card className="glass-effect border-white/10 card-hover h-full">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                            {post.category}
                          </Badge>
                          <div className="flex items-center text-gray-400 text-sm">
                            <Clock className="h-4 w-4 mr-1" />
                            {post.readTime}
                          </div>
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
                          <div className="flex items-center text-gray-400 text-sm">
                            <Calendar className="h-4 w-4 mr-1" />
                            {post.date}
                          </div>
                          <Link 
                            to={`/blog/${post.id}`}
                            className="text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors flex items-center"
                          >
                            Leer más
                            <ArrowRight className="h-4 w-4 ml-1" />
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {filteredPosts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                No se encontraron artículos
              </h3>
              <p className="text-gray-400 mb-6">
                Prueba con otros términos de búsqueda o categorías
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default BlogPage;