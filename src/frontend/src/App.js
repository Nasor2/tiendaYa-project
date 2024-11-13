// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './paginas/Login';
import Registro from './paginas/Registro';
import Inicio from './paginas/Inicio';
import Footer from './componentes/Footer';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registro />} />
        </Routes>
        <Footer className="mt-auto" /> {/* Asegura que el Footer esté justo después del contenido principal */}
      </div>
    </Router>
  );
}

export default App;
