'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext();

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Función para obtener o crear session_id desde localStorage
const getSessionId = () => {
  if (typeof window === 'undefined') return null;
  let sessionId = localStorage.getItem('cart_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('cart_session_id', sessionId);
  }
  return sessionId;
};

export function CartProvider({ children }) {
  const [cart, setCart] = useState({
    session_id: null,
    items: [],
    total: 0,
    item_count: 0,
    loading: false,
  });

  // Cargar carrito al iniciar
  useEffect(() => {
    const sessionId = getSessionId();
    if (sessionId) {
      fetchCart(sessionId);
    }
  }, []);

  const fetchCart = useCallback(async (sessionId = null) => {
    if (!sessionId) sessionId = getSessionId();
    if (!sessionId) return;

    setCart(prev => ({ ...prev, loading: true }));
    
    try {
      const response = await fetch(`${API_URL}/api/cart?session_id=${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setCart({
          session_id: data.session_id,
          items: data.items || [],
          total: data.total || 0,
          item_count: data.item_count || 0,
          loading: false,
        });
        // Actualizar session_id si es nuevo
        if (data.session_id && typeof window !== 'undefined') {
          localStorage.setItem('cart_session_id', data.session_id);
        }
      } else {
        setCart(prev => ({ ...prev, loading: false }));
      }
    } catch (error) {
      console.error('Error al cargar carrito:', error);
      setCart(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const addToCart = useCallback(async (productId, quantity = 1) => {
    const sessionId = getSessionId();
    if (!sessionId) return { success: false, error: 'No hay sesión' };

    setCart(prev => ({ ...prev, loading: true }));

    try {
      const response = await fetch(`${API_URL}/api/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          product_id: productId,
          quantity,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setCart({
          session_id: data.session_id,
          items: data.items || [],
          total: data.total || 0,
          item_count: data.item_count || 0,
          loading: false,
        });
        if (data.session_id && typeof window !== 'undefined') {
          localStorage.setItem('cart_session_id', data.session_id);
        }
        return { success: true, message: data.message };
      } else {
        setCart(prev => ({ ...prev, loading: false }));
        return { success: false, error: data.error || 'Error al agregar al carrito' };
      }
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      setCart(prev => ({ ...prev, loading: false }));
      return { success: false, error: 'Error de conexión' };
    }
  }, []);

  const updateCartItem = useCallback(async (itemId, quantity) => {
    const sessionId = getSessionId();
    if (!sessionId) return { success: false, error: 'No hay sesión' };

    setCart(prev => ({ ...prev, loading: true }));

    try {
      const response = await fetch(`${API_URL}/api/cart/${sessionId}/items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      });

      const data = await response.json();

      if (response.ok) {
        setCart({
          session_id: data.session_id,
          items: data.items || [],
          total: data.total || 0,
          item_count: data.item_count || 0,
          loading: false,
        });
        return { success: true, message: data.message };
      } else {
        setCart(prev => ({ ...prev, loading: false }));
        return { success: false, error: data.error || 'Error al actualizar carrito' };
      }
    } catch (error) {
      console.error('Error al actualizar carrito:', error);
      setCart(prev => ({ ...prev, loading: false }));
      return { success: false, error: 'Error de conexión' };
    }
  }, []);

  const removeFromCart = useCallback(async (itemId) => {
    const sessionId = getSessionId();
    if (!sessionId) return { success: false, error: 'No hay sesión' };

    setCart(prev => ({ ...prev, loading: true }));

    try {
      const response = await fetch(`${API_URL}/api/cart/${sessionId}/items/${itemId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        setCart({
          session_id: data.session_id,
          items: data.items || [],
          total: data.total || 0,
          item_count: data.item_count || 0,
          loading: false,
        });
        return { success: true, message: data.message };
      } else {
        setCart(prev => ({ ...prev, loading: false }));
        return { success: false, error: data.error || 'Error al eliminar del carrito' };
      }
    } catch (error) {
      console.error('Error al eliminar del carrito:', error);
      setCart(prev => ({ ...prev, loading: false }));
      return { success: false, error: 'Error de conexión' };
    }
  }, []);

  const clearCart = useCallback(async () => {
    const sessionId = getSessionId();
    if (!sessionId) return { success: false, error: 'No hay sesión' };

    setCart(prev => ({ ...prev, loading: true }));

    try {
      const response = await fetch(`${API_URL}/api/cart/${sessionId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        setCart({
          session_id: data.session_id,
          items: [],
          total: 0,
          item_count: 0,
          loading: false,
        });
        return { success: true, message: data.message };
      } else {
        setCart(prev => ({ ...prev, loading: false }));
        return { success: false, error: data.error || 'Error al limpiar carrito' };
      }
    } catch (error) {
      console.error('Error al limpiar carrito:', error);
      setCart(prev => ({ ...prev, loading: false }));
      return { success: false, error: 'Error de conexión' };
    }
  }, []);

  const value = {
    cart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart: () => fetchCart(),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de CartProvider');
  }
  return context;
}

