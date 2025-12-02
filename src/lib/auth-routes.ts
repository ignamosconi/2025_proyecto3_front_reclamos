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
      // Los clientes gestionan sus reclamos
      return '/sales'; // Ruta para que los clientes gestionen sus reclamos
    case 'Encargado':
      // Dashboard Operativo - para usuarios con rol Encargado
      // Los encargados gestionan reclamos operativamente
      return '/sales'; // Ruta para gestión operativa de reclamos
    case 'Gerente':
      // Dashboard Estratégico - para usuarios con rol Gerente
      // Los gerentes ven métricas y estadísticas generales
      return '/'; // Dashboard principal con métricas y estadísticas
    default:
      // Por defecto, redirigir al dashboard principal
      return '/';
  }
}

