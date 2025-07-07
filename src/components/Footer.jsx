
import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="glass-effect border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                <Gamepad2 className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">Mesa & Dados</span>
            </div>
            <p className="text-gray-400 max-w-md">
              Tu catálogo personal de juegos de mesa con reseñas detalladas y recomendaciones. 
              Descubre tu próximo juego favorito.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <span className="text-lg font-semibold text-white mb-4 block">Enlaces</span>
            <div className="space-y-2">
              <Link to="/" className="block text-gray-400 hover:text-white transition-colors">
                Inicio
              </Link>
              <Link to="/juegos" className="block text-gray-400 hover:text-white transition-colors">
                Catálogo
              </Link>
              <Link to="/blog" className="block text-gray-400 hover:text-white transition-colors">
                Blog
              </Link>
              <Link to="/contacto" className="block text-gray-400 hover:text-white transition-colors">
                Contacto
              </Link>
            </div>
          </div>

          {/* Categorías */}
          <div>
            <span className="text-lg font-semibold text-white mb-4 block">Categorías</span>
            <div className="space-y-2">
              <span className="block text-gray-400">Estrategia</span>
              <span className="block text-gray-400">Party Games</span>
              <span className="block text-gray-400">Cooperativos</span>
              <span className="block text-gray-400">Familiares</span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Mesa & Dados. Hecho con <Heart className="inline h-4 w-4 text-red-500" /> para los amantes de los juegos de mesa.
          </p>
          <p className="text-gray-400 text-sm mt-2 md:mt-0">
            Versión 1.0
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
