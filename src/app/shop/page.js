'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { formatCLP } from '../../lib/formatters';
import { useCart } from '../../context/CartContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function ShopPage() {
  const router = useRouter();
  const { addToCart, cart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingProduct, setAddingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    setAddingProduct(productId);
    const result = await addToCart(productId, 1);
    if (result.success) {
      // Opcional: mostrar notificación de éxito
    } else {
      alert(result.error || 'Error al agregar al carrito');
    }
    setAddingProduct(null);
  };
  return (
    <section className="min-h-screen py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Tienda
          </h1>
          <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
            Lleva el arte de Drama26 a tu espacio. Productos exclusivos y de alta calidad.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary via-secondary to-accent mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Carrito Info */}
        {cart.item_count > 0 && (
          <div className="mb-8 card bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 border border-primary/30">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold">
                    {cart.item_count} {cart.item_count === 1 ? 'producto' : 'productos'} en el carrito
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    Total: {formatCLP(cart.total)}
                  </p>
                </div>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => router.push('/shop/checkout')}
                >
                  Ir a Pagar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-xl text-base-content/70">No hay productos disponibles</p>
              </div>
            ) : (
              products.map((product) => (
            <div key={product.id} className="card bg-base-200/50 backdrop-blur-sm border border-base-300 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
              <figure className="relative overflow-hidden rounded-t-2xl">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-base-200/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </figure>
              <div className="card-body">
                <h2 className="card-title text-accent group-hover:text-primary transition-colors">
                  {product.name}
                </h2>
                <p className="text-base-content/70 text-sm mb-4">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <div>
                    <p className="text-2xl font-bold text-primary">{formatCLP(product.price)}</p>
                    <p className="text-xs text-base-content/60">Envío incluido</p>
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleAddToCart(product.id)}
                    disabled={addingProduct === product.id || cart.loading}
                  >
                    {addingProduct === product.id || cart.loading ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Agregando...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Agregar
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
              ))
            )}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-16 card bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border border-primary/30">
          <div className="card-body text-center">
            <h3 className="text-2xl font-bold mb-4">Productos de Edición Limitada</h3>
            <p className="text-base-content/80 max-w-2xl mx-auto">
              Cada producto está diseñado con cuidado y atención al detalle. Materiales premium y 
              envíos seguros a todo Chile.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}


