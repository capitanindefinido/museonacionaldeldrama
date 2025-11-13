'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { formatCLP } from '../../../lib/formatters';
import { useCart } from '../../../context/CartContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, refreshCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (cart.item_count === 0) {
      router.push('/shop');
    }
  }, [cart.item_count, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.customer_name.trim()) {
      newErrors.customer_name = 'El nombre es requerido';
    }
    
    if (!formData.customer_email.trim()) {
      newErrors.customer_email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customer_email)) {
      newErrors.customer_email = 'El email no es válido';
    }
    
    if (!formData.customer_phone.trim()) {
      newErrors.customer_phone = 'El teléfono es requerido';
    }
    
    if (!formData.shipping_address.trim()) {
      newErrors.shipping_address = 'La dirección de envío es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: cart.session_id,
          ...formData,
        }),
      });

      const data = await response.json();

      if (response.ok && data.flow_url) {
        // Redirigir a Flow para el pago
        window.location.href = data.flow_url;
      } else {
        alert(data.error || 'Error al crear la orden. Por favor, intenta nuevamente.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error al crear orden:', error);
      alert('Error de conexión. Por favor, intenta nuevamente.');
      setLoading(false);
    }
  };

  if (cart.item_count === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Tu carrito está vacío</p>
          <button 
            className="btn btn-primary"
            onClick={() => router.push('/shop')}
          >
            Volver a la tienda
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Checkout
          </h1>
          <p className="text-xl text-base-content/70">
            Completa tus datos para finalizar la compra
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="md:col-span-2">
            <div className="card bg-base-200/50 backdrop-blur-sm border border-base-300 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-6">Información de envío</h2>
                
                <form onSubmit={handleSubmit}>
                  <div className="form-control mb-4">
                    <label className="label">
                      <span className="label-text font-semibold">Nombre completo *</span>
                    </label>
                    <input
                      type="text"
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleChange}
                      placeholder="Juan Pérez"
                      className={`input input-bordered ${errors.customer_name ? 'input-error' : ''}`}
                      required
                    />
                    {errors.customer_name && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.customer_name}</span>
                      </label>
                    )}
                  </div>

                  <div className="form-control mb-4">
                    <label className="label">
                      <span className="label-text font-semibold">Email *</span>
                    </label>
                    <input
                      type="email"
                      name="customer_email"
                      value={formData.customer_email}
                      onChange={handleChange}
                      placeholder="juan@example.com"
                      className={`input input-bordered ${errors.customer_email ? 'input-error' : ''}`}
                      required
                    />
                    {errors.customer_email && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.customer_email}</span>
                      </label>
                    )}
                  </div>

                  <div className="form-control mb-4">
                    <label className="label">
                      <span className="label-text font-semibold">Teléfono *</span>
                    </label>
                    <input
                      type="tel"
                      name="customer_phone"
                      value={formData.customer_phone}
                      onChange={handleChange}
                      placeholder="+56 9 1234 5678"
                      className={`input input-bordered ${errors.customer_phone ? 'input-error' : ''}`}
                      required
                    />
                    {errors.customer_phone && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.customer_phone}</span>
                      </label>
                    )}
                  </div>

                  <div className="form-control mb-6">
                    <label className="label">
                      <span className="label-text font-semibold">Dirección de envío *</span>
                    </label>
                    <textarea
                      name="shipping_address"
                      value={formData.shipping_address}
                      onChange={handleChange}
                      placeholder="Calle, número, comuna, ciudad"
                      className={`textarea textarea-bordered h-24 ${errors.shipping_address ? 'textarea-error' : ''}`}
                      required
                    />
                    {errors.shipping_address && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.shipping_address}</span>
                      </label>
                    )}
                  </div>

                  <button
                    type="submit"
                    className={`btn btn-primary btn-lg w-full ${loading ? 'loading' : ''}`}
                    disabled={loading || cart.loading}
                  >
                    {loading ? (
                      <>
                        <span className="loading loading-spinner"></span>
                        Procesando...
                      </>
                    ) : (
                      <>
                        Proceder al pago con Flow
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Resumen */}
          <div className="md:col-span-1">
            <div className="card bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 border border-primary/30 shadow-xl sticky top-4">
              <div className="card-body">
                <h3 className="card-title text-xl mb-4">Resumen de compra</h3>
                
                <div className="space-y-3 mb-6">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex items-start gap-3 pb-3 border-b border-base-300">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-grow">
                        <p className="font-semibold text-sm">{item.name}</p>
                        <p className="text-xs text-base-content/70">
                          Cantidad: {item.quantity}
                        </p>
                        <p className="text-sm font-bold text-primary mt-1">
                          {formatCLP(item.subtotal)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatCLP(cart.total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Envío</span>
                    <span className="text-success">Gratis</span>
                  </div>
                  <div className="divider my-2"></div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">{formatCLP(cart.total)}</span>
                  </div>
                </div>

                <button
                  className="btn btn-ghost btn-sm w-full"
                  onClick={() => router.push('/shop')}
                >
                  ← Volver a la tienda
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

