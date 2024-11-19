// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CartProvider } from "./context/CartContext";
import Login from './paginas/Login';
import Registro from './paginas/Registro';
import Inicio from './paginas/Inicio';
import Footer from './componentes/Footer';
import Categorias from './paginas/Categorias';
import ResultadosBusqueda from './paginas/ResultadosBusqueda';
import VistaProducto from './paginas/VistaProducto';
import CartPreview from './paginas/Carrito';
import MisPedidos from './paginas/MisPedidos';

function App() {
  return (
    <CartProvider>
      <Router>
      <div className="flex flex-col min-h-screen">
        <div className='flex-1'>
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registro />} />
            <Route path="/buscar" element={<ResultadosBusqueda />} /> 
            <Route path="/categorias" element={<Categorias />} />
            <Route path="/producto/:nombre" element={<VistaProducto />} />
            <Route path="/cart" element={<CartPreview />} />
            <Route path="/mis-pedidos" element={<MisPedidos />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
    </CartProvider>
  );
}

export default App;
