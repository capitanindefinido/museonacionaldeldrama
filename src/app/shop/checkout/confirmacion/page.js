'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function ConfirmacionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      checkOrderStatus(token);
    } else {
      setStatus('error');
    }
  }, [searchParams]);

  const checkOrderStatus = async (token) => {
    try {
      // Buscar la orden por token (necesitarías crear este endpoint o usar el order_id)
      // Por ahora, simplemente verificamos el token
      setStatus('success');
    } catch (error) {
      console.error('Error al verificar orden:', error);
      setStatus('error');
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-4 text-xl">Verificando tu pago...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card bg-base-200 shadow-xl max-w-md w-full">
          <div className="card-body text-center">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="card-title justify-center text-2xl mb-4">
              Error en el pago
            </h2>
            <p className="text-base-content/70 mb-6">
              Hubo un problema al procesar tu pago. Por favor, intenta nuevamente.
            </p>
            <div className="card-actions justify-center">
              <Link href="/shop" className="btn btn-primary">
                Volver a la tienda
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 border border-primary/30 shadow-xl max-w-md w-full">
        <div className="card-body text-center">
          <div className="text-6xl mb-4 animate-bounce">✅</div>
          <h2 className="card-title justify-center text-2xl mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            ¡Pago exitoso!
          </h2>
          <p className="text-base-content/70 mb-6">
            Tu orden ha sido procesada correctamente. Recibirás un email de confirmación con los detalles de tu compra.
          </p>
          <div className="card-actions justify-center gap-4">
            <Link href="/shop" className="btn btn-primary">
              Seguir comprando
            </Link>
            <Link href="/" className="btn btn-ghost">
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmacionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    }>
      <ConfirmacionContent />
    </Suspense>
  );
}

