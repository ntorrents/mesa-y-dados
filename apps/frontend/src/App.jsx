import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import HomePage from '@/pages/HomePage';
import GamesPage from '@/pages/GamesPage';
import GameDetailPage from '@/pages/GameDetailPage';
import BlogPage from '@/pages/BlogPage';
import BlogPostPage from '@/pages/BlogPostPage';
import ContactPage from '@/pages/ContactPage';
import FavoritosPage from '@/pages/FavoritosPage';
import AdminPage from '@/pages/AdminPage';
import { DataProvider } from '@/contexts/DataContext';

function App() {
  return (
    <DataProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col">
          <Helmet>
            <title>Mesa & Dados - Catálogo de Juegos de Mesa</title>
            <meta name="description" content="Descubre los mejores juegos de mesa con reseñas detalladas, filtros avanzados y recomendaciones personalizadas." />
          </Helmet>
          
          <Header />
          
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/juegos" element={<GamesPage />} />
              <Route path="/games" element={<GamesPage />} />
              <Route path="/juego/:id" element={<GameDetailPage />} />
              <Route path="/gamedetail" element={<GameDetailPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:id" element={<BlogPostPage />} />
              <Route path="/blogpost" element={<BlogPostPage />} />
              <Route path="/favoritos" element={<FavoritosPage />} />
              <Route path="/contacto" element={<ContactPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </main>
          
          <Footer />
          <Toaster />
        </div>
      </Router>
    </DataProvider>
  );
}

export default App;