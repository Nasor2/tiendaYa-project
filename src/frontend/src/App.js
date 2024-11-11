import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000')
      .then(response => {
        setMessage(response.data);
      })
      .catch(error => {
        console.error('Hubo un error al conectar con el backend', error);
      });
  }, []);

  return (
    <div>
      <h1>{message}</h1>
      <h1>Hola</h1>
    </div>
  );
}

export default App;
