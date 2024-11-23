import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg mb-4">TiendaYa</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Tu destino de compras en línea para encontrar los mejores productos con la mejor calidad y precio.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Navegación</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-400 hover:text-white transition-colors duration-300 block py-1"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link 
                  to="/categorias" 
                  className="text-gray-400 hover:text-white transition-colors duration-300 block py-1"
                >
                  Categorías
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contacto</h3>
            <ul className="space-y-4">
              <li className="flex items-center text-gray-400">
                <MapPin className="w-5 h-5 mr-3 text-purple-500" />
                <span>Calle Principal 123, Ciudad</span>
              </li>
              <li className="flex items-center text-gray-400">
                <Phone className="w-5 h-5 mr-3 text-purple-500" />
                <span>+1 234 567 890</span>
              </li>
              <li className="flex items-center text-gray-400">
                <Mail className="w-5 h-5 mr-3 text-purple-500" />
                <span>contacto@tiendaya.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-gray-700 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} TiendaYa - Todos los derechos reservados
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;