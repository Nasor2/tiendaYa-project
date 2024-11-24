import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useCart } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { 
  Menu, 
  X, 
  Search, 
  ShoppingCart, 
  User,
  Store,
  Package,
  LogOut,
  ChevronDown
} from "lucide-react";

const Navbar = () => {
  const { user, setUser, logout } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUser(decodedToken);
      } catch (error) {
        console.error("Token inválido:", error);
        setUser(null);
      }
    }
  }, [setUser]);

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      window.location.href = `/buscar?q=${searchTerm}`;
      setSearchTerm("");
    }
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    setIsProfileDropdownOpen(false);
  };

  const ProfileDropdown = () => (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 transition-all duration-200 border border-gray-100">
      <div className="px-4 py-2 border-b border-gray-100">
        <p className="text-sm font-medium text-gray-900">{user.nombre}</p>
        <p className="text-xs text-gray-500">{user.correo}</p>
      </div>
      {user.role === "tendero" ? (
        <>
          <Link
            to="/mis-productos"
            className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 
                    text-gray-700 transition-colors duration-300"
          >
            <Store className="w-4 h-4" />
            Mis Productos
          </Link>

          <Link
            to="/pedidos-tendero"
            className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 
                    text-gray-700 transition-colors duration-300"
          >
            <Package className="w-4 h-4" />
            Pedidos
          </Link>
        </>
      ) : (
        <Link
          to="/mis-pedidos"
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
        >
          <Package className="w-4 h-4" />
          Mis Pedidos
        </Link>
      )}
      <button
        onClick={handleLogout}
        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
      >
        <LogOut className="w-4 h-4" />
        Cerrar Sesión
      </button>
    </div>
  );

  return (
    <header 
      className="bg-white backdrop-blur-md bg-opacity-80 shadow-lg sticky top-0 z-50 font-san"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 text-2xl font-black"
          >
            <img src="/logo32px.png" alt="TiendaYa Logo" />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-purple-600 hover:to-blue-600 transition-all duration-300">
              TiendaYa
            </span>
          </Link>

          {/* Barra de búsqueda - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-2xl">
            <div className={`relative w-full group ${isSearchFocused ? 'z-50' : ''}`}>
              <input
                type="text"
                placeholder="¿Qué estás buscando hoy?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full pl-12 pr-4 py-3 border rounded-xl text-gray-700 bg-gray-50/50 border-gray-200 
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none focus:bg-white
                         transition-all duration-300 group-hover:bg-gray-50"
              />
              <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Navegación - Desktop */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link 
              to="/categorias" 
              className="flex items-center gap-1 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300"
            >
              Categorías
            </Link>

            {!user ? (
              <>
                <Link
                  to="/register"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300"
                >
                  Crear cuenta
                </Link>
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
                           text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-300 
                           hover:shadow-lg hover:shadow-blue-500/30 flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Ingresar
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-6">
                {user.role === "cliente" && (
                  <>
                    <Link
                      to="/cart"
                      className="relative p-2 hover:bg-gray-100 rounded-full transition-colors duration-300"
                    >
                      <ShoppingCart className="w-5 h-5 text-gray-600" />
                      {totalItems > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full 
                                     text-xs flex items-center justify-center animate-bounce">
                          {totalItems}
                        </span>
                      )}
                    </Link>
                  </>
                )}
                
                <div className="relative">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium 
                             transition-colors duration-300 group"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full 
                                  flex items-center justify-center text-white font-medium text-sm
                                  group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-300">
                      {user.nombre?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 
                      ${isProfileDropdownOpen ? 'rotate-180' : ''}`} 
                    />
                  </button>
                  {isProfileDropdownOpen && <ProfileDropdown />}
                </div>
              </div>
            )}
          </nav>

          {/* Menú móvil */}
          <button
            className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Menú móvil desplegable */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-xl border-t border-gray-100">
            <div className="p-4 space-y-4">
              {/* Búsqueda móvil */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="¿Qué estás buscando hoy?"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleSearch}
                  className="w-full pl-12 pr-4 py-3 border rounded-xl text-gray-700 bg-gray-50 
                           focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                />
                <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              {/* Enlaces móviles */}
              <nav className="flex flex-col gap-2">
                <Link 
                  to="/categorias"
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 
                           text-gray-700 font-medium transition-colors duration-300"
                >
                  Categorías
                  <ChevronDown className="w-4 h-4" />
                </Link>

                {!user ? (
                  <>
                    <Link
                      to="/register"
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 
                               text-gray-700 font-medium transition-colors duration-300"
                    >
                      Crear cuenta
                      <User className="w-4 h-4" />
                    </Link>
                    <Link
                      to="/login"
                      className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 
                               to-purple-600 text-white p-3 rounded-xl font-medium"
                    >
                      <User className="w-4 h-4" />
                      Ingresar
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="p-3 border-t border-gray-100">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 
                                      rounded-full flex items-center justify-center text-white font-medium">
                          {user.nombre?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.nombre}</p>
                          <p className="text-sm text-gray-500">{user.correo}</p>
                        </div>
                      </div>
                    </div>

                    {user.role === "tendero" ? (
                      <>
                        <Link
                          to="/mis-productos"
                          className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors duration-300"
                        >
                          <Store className="w-4 h-4" />
                          Mis Productos
                        </Link>

                        <Link
                          to="/pedidos-tendero"
                          className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 
                                  text-gray-700 transition-colors duration-300"
                        >
                          <Package className="w-4 h-4" />
                          Pedidos
                        </Link>
                      </>
                      
                    ) : (
                      <>
                        <Link
                          to="/mis-pedidos"
                          className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 
                                   text-gray-700 transition-colors duration-300"
                        >
                          <Package className="w-4 h-4" />
                          Mis Pedidos
                        </Link>
                        <Link
                          to="/cart"
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 
                                   text-gray-700 transition-colors duration-300"
                        >
                          <span className="font-medium">Mi Carrito</span>
                          <div className="relative">
                            <ShoppingCart className="w-5 h-5" />
                            {totalItems > 0 && (
                              <span className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 
                                           rounded-full text-xs flex items-center justify-center">
                                {totalItems}
                              </span>
                            )}
                          </div>
                        </Link>
                      </>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full p-3 text-red-600 hover:bg-red-50 
                               rounded-lg transition-colors duration-300"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar Sesión
                    </button>
                  </>
                )}
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;