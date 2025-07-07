import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, User, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';

const BlogPostPage = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const { blogPosts } = useData();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    if (blogPosts.length > 0) {
      const postId = parseInt(id);
      const foundPost = blogPosts.find(p => p.id === postId);
      
      if (foundPost) {
        setPost(foundPost);
        
        const related = blogPosts
          .filter(p => p.id !== postId && p.category === foundPost.category)
          .slice(0, 3);
        setRelatedPosts(related);
      }
    }
  }, [id, blogPosts]);

  const handleShare = () => {
    toast({
      title: "🚧 Esta funcionalidad no está implementada aún—¡pero no te preocupes! ¡Puedes solicitarla en tu próximo prompt! 🚀"
    });
  };

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Artículo no encontrado</h2>
          <Link to="/blog">
            <Button variant="outline">Volver al blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getExpandedContent = (post) => {
    switch (post.id) {
      case 1:
        return `
          Los juegos para dos jugadores ofrecen una experiencia íntima y estratégica que no se encuentra en otros formatos. Aquí tienes mi selección de los mejores juegos para disfrutar en pareja o con un amigo.

          ## 1. Patchwork
          Un puzzle abstracto donde cada jugador construye su propio edredón con piezas de tetris. La gestión del tiempo y el dinero crean decisiones fascinantes.

          ## 2. 7 Wonders Duel
          La versión para dos jugadores del clásico 7 Wonders. Mantiene toda la profundidad estratégica del original pero con mecánicas adaptadas perfectamente para dos.

          ## 3. Jaipur
          Un juego de comercio rápido y táctico. Perfecto para partidas cortas pero llenas de decisiones interesantes.

          ## 4. Lost Cities
          Knizia en estado puro. Simple en reglas pero profundo en decisiones. Cada carta que juegas o descartas importa.

          ## 5. Targi
          Un worker placement único donde la posición de tus trabajadores determina las acciones disponibles. Brillante diseño.

          Estos juegos demuestran que no necesitas muchos jugadores para tener experiencias memorables. La interacción directa y las decisiones tácticas hacen que cada partida sea única.
        `;
      case 2:
        return `
          Los juegos cooperativos han revolucionado la industria de los juegos de mesa, ofreciendo experiencias donde todos los jugadores trabajan juntos hacia un objetivo común.

          ## ¿Por qué jugar cooperativos?
          - Eliminan la competitividad tóxica
          - Fomentan la comunicación y el trabajo en equipo
          - Son perfectos para familias con niños
          - Crean momentos de tensión compartida

          ## Los mejores cooperativos

          ### Pandemic
          El rey de los cooperativos. Salvar el mundo de cuatro enfermedades nunca fue tan emocionante.

          ### Spirit Island
          Para jugadores experimentados. Defiende tu isla de los invasores coloniales con poderes únicos.

          ### Forbidden Island/Desert
          Perfectos como introducción al género. Mecánicas simples pero emocionantes.

          ### Gloomhaven
          La experiencia cooperativa definitiva. Un RPG en caja con campaña épica.

          Los cooperativos nos enseñan que ganar juntos es mucho más satisfactorio que ganar solo.
        `;
      case 3:
        return `
          Elegir el primer juego para alguien nuevo en el hobby es crucial. Un mal primer juego puede alejar a alguien para siempre, mientras que el correcto puede crear un jugón de por vida.

          ## Características de un buen Gateway Game
          - Reglas simples de explicar (máximo 10 minutos)
          - Mecánicas intuitivas
          - Tiempo de juego razonable (30-60 minutos)
          - Componentes atractivos
          - Decisiones interesantes pero no abrumadoras

          ## Mis recomendaciones por tipo de persona

          ### Para familias con niños
          - **Ticket to Ride**: Coleccionar trenes y construir rutas es intuitivo
          - **Azul**: Hermoso y simple, pero con profundidad
          - **Splendor**: Gestión de recursos accesible

          ### Para jugadores de cartas tradicionales
          - **Love Letter**: Deducción simple con solo 16 cartas
          - **Sushi Go!**: Drafting divertido y temática atractiva

          ### Para amantes de la estrategia
          - **7 Wonders**: Civilizaciones y múltiples rutas a la victoria
          - **King of Tokyo**: Dados y monstruos, ¿qué más necesitas?

          ### Para grupos grandes
          - **Codenames**: Perfecto para fiestas
          - **One Night Ultimate Werewolf**: Roles ocultos en 10 minutos

          Recuerda: el mejor gateway game es el que se adapta a los gustos de la persona. Conoce a tu audiencia y elige en consecuencia.
        `;
      default:
        return post.content;
    }
  };

  return (
    <>
      <Helmet>
        <title>{post.title} - Mesa & Dados</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>

      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link to="/blog" className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al blog
            </Link>
          </motion.div>

          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="glass-effect border-white/10 mb-8">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                    {post.category}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleShare}
                    className="text-gray-400 hover:text-white"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Compartir
                  </Button>
                </div>
                
                <CardTitle className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {post.title}
                </CardTitle>
                
                <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {post.author}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {post.date}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {post.readTime}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="prose prose-invert prose-lg max-w-none">
                  <p className="text-xl text-gray-300 mb-8 font-medium">
                    {post.excerpt}
                  </p>
                  
                  <div className="text-gray-300 leading-relaxed space-y-6">
                    {getExpandedContent(post).split('\n\n').map((paragraph, index) => {
                      if (paragraph.startsWith('## ')) {
                        return (
                          <h2 key={index} className="text-2xl font-bold text-white mt-8 mb-4">
                            {paragraph.replace('## ', '')}
                          </h2>
                        );
                      } else if (paragraph.startsWith('### ')) {
                        return (
                          <h3 key={index} className="text-xl font-semibold text-blue-400 mt-6 mb-3">
                            {paragraph.replace('### ', '')}
                          </h3>
                        );
                      } else if (paragraph.startsWith('- ')) {
                        const listItems = paragraph.split('\n').filter(item => item.startsWith('- '));
                        return (
                          <ul key={index} className="list-disc list-inside space-y-2 ml-4">
                            {listItems.map((item, itemIndex) => (
                              <li key={itemIndex} className="text-gray-300">
                                {item.replace('- ', '')}
                              </li>
                            ))}
                          </ul>
                        );
                      } else if (paragraph.trim()) {
                        return (
                          <p key={index} className="text-gray-300 leading-relaxed">
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
          </motion.article>

          {relatedPosts.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="glass-effect border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Artículos Relacionados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {relatedPosts.map((relatedPost) => (
                      <Link
                        key={relatedPost.id}
                        to={`/blog/${relatedPost.id}`}
                        className="block p-4 glass-effect rounded-lg border border-white/10 hover:border-blue-500/30 transition-colors group"
                      >
                        <Badge variant="outline" className="border-blue-500/30 text-blue-400 mb-2">
                          {relatedPost.category}
                        </Badge>
                        <h4 className="text-white font-medium group-hover:text-blue-400 transition-colors mb-2">
                          {relatedPost.title}
                        </h4>
                        <p className="text-gray-400 text-sm mb-3">
                          {relatedPost.excerpt.substring(0, 100)}...
                        </p>
                        <div className="flex items-center text-gray-400 text-xs">
                          <Calendar className="h-3 w-3 mr-1" />
                          {relatedPost.date}
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.section>
          )}
        </div>
      </div>
    </>
  );
};

export default BlogPostPage;