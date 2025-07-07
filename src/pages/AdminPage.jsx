import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import AdminGameForm from '@/components/AdminGameForm';
import AdminBlogForm from '@/components/AdminBlogForm'; 
import { useData } from '@/contexts/DataContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminPage = () => {
  const { toast } = useToast();
  const { games, saveGames, blogPosts, saveBlogPosts } = useData();

  const [isGameFormVisible, setIsGameFormVisible] = useState(false);
  const [editingGame, setEditingGame] = useState(null);

  const [isBlogFormVisible, setIsBlogFormVisible] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const handleShowAddGameForm = () => {
    setEditingGame(null);
    setIsGameFormVisible(true);
  };

  const handleEditGame = (game) => {
    setEditingGame(game);
    setIsGameFormVisible(true);
  };

  const handleDeleteGame = (gameId) => {
    const updatedGames = games.filter(game => game.id !== gameId);
    saveGames(updatedGames);
    toast({
      title: "Juego eliminado",
      description: "El juego se ha eliminado del catálogo"
    });
  };

  const handleGameFormSubmit = (formData) => {
    if (editingGame) {
      const updatedGames = games.map(game =>
        game.id === editingGame.id ? { ...game, ...formData } : game
      );
      saveGames(updatedGames);
      toast({
        title: "¡Juego actualizado!",
        description: "Los cambios se han guardado correctamente"
      });
    } else {
      const newGame = { ...formData, id: Date.now() };
      const updatedGames = [...games, newGame];
      saveGames(updatedGames);
      toast({
        title: "¡Juego añadido!",
        description: `${newGame.name} se ha añadido al catálogo`
      });
    }
    setIsGameFormVisible(false);
    setEditingGame(null);
  };

  const handleShowAddBlogForm = () => {
    setEditingPost(null);
    setIsBlogFormVisible(true);
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setIsBlogFormVisible(true);
  };

  const handleDeletePost = (postId) => {
    const updatedPosts = blogPosts.filter(post => post.id !== postId);
    saveBlogPosts(updatedPosts);
    toast({
      title: "Artículo eliminado",
      description: "El artículo ha sido eliminado del blog"
    });
  };

  const handleBlogFormSubmit = (formData) => {
    if (editingPost) {
      const updatedPosts = blogPosts.map(post =>
        post.id === editingPost.id ? { ...post, ...formData } : post
      );
      saveBlogPosts(updatedPosts);
      toast({
        title: "¡Artículo actualizado!",
        description: "Los cambios se han guardado."
      });
    } else {
      const newPost = { ...formData, id: Date.now(), author: "Mesa & Dados", date: new Date().toISOString().slice(0, 10) };
      const updatedPosts = [...blogPosts, newPost];
      saveBlogPosts(updatedPosts);
      toast({
        title: "¡Artículo añadido!",
        description: `El artículo "${newPost.title}" se ha publicado.`
      });
    }
    setIsBlogFormVisible(false);
    setEditingPost(null);
  };

  return (
    <>
      <Helmet>
        <title>Administración - Mesa & Dados</title>
        <meta name="description" content="Panel de administración para gestionar el catálogo de juegos de mesa y el blog." />
      </Helmet>

      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold gradient-text mb-2">
              Panel de Administración
            </h1>
            <p className="text-gray-400">
              Gestiona el contenido de tu web: juegos y artículos del blog.
            </p>
          </motion.div>

          <Tabs defaultValue="games" className="w-full">
            <TabsList className="grid w-full grid-cols-2 glass-effect mb-8">
              <TabsTrigger value="games">Gestionar Juegos</TabsTrigger>
              <TabsTrigger value="blog">Gestionar Blog</TabsTrigger>
            </TabsList>
            
            <TabsContent value="games">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex justify-end mb-4">
                  <Button onClick={handleShowAddGameForm} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    <Plus className="h-4 w-4 mr-2" /> Añadir Juego
                  </Button>
                </div>
                <AnimatePresence>
                  {isGameFormVisible && (
                    <AdminGameForm
                      initialData={editingGame}
                      onSubmit={handleGameFormSubmit}
                      onCancel={() => setIsGameFormVisible(false)}
                    />
                  )}
                </AnimatePresence>

                <Card className="glass-effect border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Juegos en el Catálogo ({games.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {games.map((game) => (
                        <div key={game.id} className="flex items-center justify-between p-4 glass-effect rounded-lg border border-white/10">
                          <div>
                            <h3 className="text-white font-semibold">{game.name}</h3>
                            <p className="text-gray-400 text-sm">{game.categories.join(', ')}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button onClick={() => handleEditGame(game)} variant="outline" size="sm" className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"><Edit className="h-4 w-4" /></Button>
                            <Button onClick={() => handleDeleteGame(game.id)} variant="outline" size="sm" className="border-red-500/30 text-red-400 hover:bg-red-500/10"><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="blog">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex justify-end mb-4">
                  <Button onClick={handleShowAddBlogForm} className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600">
                    <Plus className="h-4 w-4 mr-2" /> Añadir Artículo
                  </Button>
                </div>
                <AnimatePresence>
                  {isBlogFormVisible && (
                    <AdminBlogForm
                      initialData={editingPost}
                      onSubmit={handleBlogFormSubmit}
                      onCancel={() => setIsBlogFormVisible(false)}
                    />
                  )}
                </AnimatePresence>

                <Card className="glass-effect border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Artículos del Blog ({blogPosts.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {blogPosts.map((post) => (
                        <div key={post.id} className="flex items-center justify-between p-4 glass-effect rounded-lg border border-white/10">
                          <div>
                            <h3 className="text-white font-semibold">{post.title}</h3>
                            <p className="text-gray-400 text-sm">{post.category} - {post.date}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button onClick={() => handleEditPost(post)} variant="outline" size="sm" className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"><Edit className="h-4 w-4" /></Button>
                            <Button onClick={() => handleDeletePost(post.id)} variant="outline" size="sm" className="border-red-500/30 text-red-400 hover:bg-red-500/10"><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default AdminPage;