export function formatCLP(value) {
  try {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0
    }).format(Number(value || 0));
  } catch (_e) {
    return `$${value}`;
  }
}


