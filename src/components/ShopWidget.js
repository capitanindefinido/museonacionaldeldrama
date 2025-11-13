'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SHOP } from '../lib/routes';
import { useCart } from '../context/CartContext';

export default function ShopWidget() {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const { cart } = useCart();
  const cartItemsCount = cart.item_count || 0;

  // No mostrar en la página de tienda
  if (pathname === SHOP) return null;

  return (
    <Link
      href={SHOP}
      className="fixed bottom-6 right-6 z-50 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Ir a la tienda"
    >
      {/* Botón principal con efectos neón */}
      <div
        className="relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
        style={{
          background: isHovered
            ? 'linear-gradient(135deg, rgba(0, 191, 255, 0.9), rgba(255, 0, 160, 0.9))'
            : 'linear-gradient(135deg, rgba(0, 191, 255, 0.8), rgba(255, 0, 160, 0.8))',
          boxShadow: isHovered
            ? '0 0 30px rgba(0, 191, 255, 0.8), 0 0 50px rgba(255, 0, 160, 0.6), inset 0 0 20px rgba(249, 213, 126, 0.3)'
            : '0 0 20px rgba(0, 191, 255, 0.6), 0 0 40px rgba(255, 0, 160, 0.4), inset 0 0 15px rgba(249, 213, 126, 0.2)',
        }}
      >
        {/* Ícono del carrito */}
        <svg
          className="w-7 h-7 text-white transition-transform duration-300 group-hover:scale-110"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          style={{
            filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.8))',
          }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>

        {/* Badge de cantidad de items (solo mostrar si hay items) */}
        {cartItemsCount > 0 && (
          <div
            className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white animate-pulse"
            style={{
              background: 'linear-gradient(135deg, rgba(249, 213, 126, 1), rgba(255, 200, 100, 1))',
              boxShadow: '0 0 15px rgba(249, 213, 126, 0.8), inset 0 0 5px rgba(0, 0, 0, 0.2)',
            }}
          >
            {cartItemsCount > 9 ? '9+' : cartItemsCount}
          </div>
        )}

        {/* Efecto de pulso en hover */}
        <div
          className="absolute inset-0 rounded-full animate-ping opacity-20"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 191, 255, 1), rgba(255, 0, 160, 1))',
          }}
        />
      </div>

      {/* Tooltip */}
      <div
        className={`absolute bottom-full right-0 mb-3 px-4 py-2 rounded-lg backdrop-blur-sm transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
        style={{
          background: 'rgba(15, 15, 30, 0.95)',
          border: '1px solid rgba(0, 191, 255, 0.4)',
          boxShadow: '0 0 20px rgba(0, 191, 255, 0.4)',
        }}
      >
        <p
          className="text-sm font-semibold whitespace-nowrap"
          style={{
            color: '#00BFFF',
            textShadow: '0 0 10px rgba(0, 191, 255, 0.8)',
          }}
        >
          Ir a la Tienda
        </p>
        <div
          className="absolute top-full right-4 w-0 h-0"
          style={{
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: '6px solid rgba(0, 191, 255, 0.4)',
          }}
        />
      </div>
    </Link>
  );
}


