/**
 * Helper para obtener la ruta de redirección según el rol del usuario
 * después de iniciar sesión
 * 
 * Según la historia de usuario:
 * - Dashboard Cliente: para usuarios con rol "Cliente"
 * - Dashboard Operativo: para usuarios con rol "Encargado"
 * - Dashboard Estratégico: para usuarios con rol "Gerente"
 */
export function getDashboardRouteByRole(role: string): string {
  switch (role) {
    case 'Cliente':
      // Dashboard Cliente - para usuarios con rol Cliente
      // Los clientes ven el dashboard principal
      return '/';
    case 'Encargado':
      // Dashboard Operativo - para usuarios con rol Encargado
      // Los encargados ven el dashboard principal
      return '/';
    case 'Gerente':
      // Dashboard Estratégico - para usuarios con rol Gerente
      // Los gerentes ven métricas y estadísticas generales
      return '/'; // Dashboard principal con métricas y estadísticas
    default:
      // Por defecto, redirigir al dashboard principal
      return '/';
  }
}

