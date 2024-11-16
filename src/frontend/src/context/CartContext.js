import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {

  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      // Convertimos la cantidad (quantity) en números al recuperar
      return JSON.parse(savedCart).map((item) => ({
        ...item,
        quantity: Number(item.quantity) || 0, // Asegura que siempre sea un número
      }));
    }
    return [];
  });
  

  // Actualiza el localStorage cuando cambien los elementos del carrito
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.producto_id === product.producto_id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.producto_id === product.producto_id
            ? { ...item }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 0 }];
      }
    });
  };

    // Función para actualizar la cantidad de un producto
  const updateQuantity = (id, increment) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.producto_id === id
          ? {
            ...item,
            quantity: Math.max(1, item.quantity + increment),
            }
          : item
        )
      );
    };

  const removeItem = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.producto_id !== productId));
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.quantity * parseFloat(item.precio_venta),
    0
  );

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeItem, updateQuantity, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
