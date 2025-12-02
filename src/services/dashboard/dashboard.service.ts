import api from '@/lib/axios';

export interface DashboardStats {
  totalRevenue: number;
  totalSales: number;
  revenueGrowth: number;
  salesGrowth: number;
}

export interface MonthlySales {
  month: string;
  total: number;
}

export interface RecentSale {
  id: number;
  usuario: {
    nombre: string;
    apellido: string;
    email: string;
  };
  total: number;
  fechaCreacion: string;
  metodoPago: string;
}

export const dashboardService = {
  // Función auxiliar para filtrar ventas según los criterios
  filterVentas(ventas: any[], filters?: {
    dateFrom?: Date;
    dateTo?: Date;
  }): any[] {
    if (!filters) return ventas;

    return ventas.filter((venta: any) => {
      const ventaDate = new Date(venta.fechaCreacion);
      
      // Filtro por fecha desde
      if (filters.dateFrom && ventaDate < filters.dateFrom) {
        return false;
      }
      
      // Filtro por fecha hasta
      if (filters.dateTo && ventaDate > filters.dateTo) {
        return false;
      }
      
      return true;
    });
  },

  // Obtener estadísticas generales del dashboard
  async getStats(filters?: {
    dateFrom?: Date;
    dateTo?: Date;
  }): Promise<DashboardStats> {
    const response = await api.get('/ventas');
    let ventas = response.data;

    // Aplicar filtros
    ventas = this.filterVentas(ventas, filters);

    // Obtener fecha actual y del mes anterior
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    // Filtrar ventas del mes actual
    const currentMonthSales = ventas.filter((venta: any) => {
      const ventaDate = new Date(venta.fechaCreacion);
      return ventaDate.getMonth() === currentMonth && ventaDate.getFullYear() === currentYear;
    });

    // Filtrar ventas del mes anterior
    const lastMonthSales = ventas.filter((venta: any) => {
      const ventaDate = new Date(venta.fechaCreacion);
      return ventaDate.getMonth() === lastMonth && ventaDate.getFullYear() === lastMonthYear;
    });

    // Calcular totales
    const currentRevenue = currentMonthSales.reduce((sum: number, venta: any) => sum + Number(venta.total), 0);
    const lastRevenue = lastMonthSales.reduce((sum: number, venta: any) => sum + Number(venta.total), 0);
    
    const totalRevenue = ventas.reduce((sum: number, venta: any) => sum + Number(venta.total), 0);
    const totalSales = ventas.length;

    // Calcular crecimiento
    const revenueGrowth = lastRevenue > 0 ? ((currentRevenue - lastRevenue) / lastRevenue) * 100 : 0;
    const salesGrowth = lastMonthSales.length > 0 
      ? ((currentMonthSales.length - lastMonthSales.length) / lastMonthSales.length) * 100 
      : 0;

    return {
      totalRevenue,
      totalSales,
      revenueGrowth: Math.round(revenueGrowth * 10) / 10,
      salesGrowth: Math.round(salesGrowth * 10) / 10,
    };
  },

  // Obtener ventas por mes para el gráfico
  async getMonthlySales(filters?: {
    dateFrom?: Date;
    dateTo?: Date;
  }): Promise<MonthlySales[]> {
    const response = await api.get('/ventas');
    let ventas = response.data;

    // Aplicar filtros
    ventas = this.filterVentas(ventas, filters);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();

    // Inicializar objeto con todos los meses en 0
    const monthlySales: { [key: string]: number } = {};
    monthNames.forEach(month => {
      monthlySales[month] = 0;
    });

    // Agrupar ventas por mes del año actual
    ventas.forEach((venta: any) => {
      const ventaDate = new Date(venta.fechaCreacion);
      if (ventaDate.getFullYear() === currentYear) {
        const monthIndex = ventaDate.getMonth();
        const monthName = monthNames[monthIndex];
        monthlySales[monthName] += Number(venta.total);
      }
    });

    // Convertir a array para el gráfico
    return monthNames.map(month => ({
      month,
      total: Math.round(monthlySales[month] * 100) / 100,
    }));
  },

  // Obtener ventas recientes
  async getRecentSales(limit: number = 5, filters?: {
    dateFrom?: Date;
    dateTo?: Date;
  }): Promise<RecentSale[]> {
    const response = await api.get('/ventas');
    let ventas = response.data;

    // Aplicar filtros
    ventas = this.filterVentas(ventas, filters);

    // Ordenar por fecha de creación (más recientes primero)
    const sortedSales = ventas
      .sort((a: any, b: any) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime())
      .slice(0, limit);

    return sortedSales.map((venta: any) => ({
      id: venta.idVenta || venta.id,
      usuario: {
        nombre: venta.usuario?.firstName || 'Usuario',
        apellido: venta.usuario?.lastName || 'Desconocido',
        email: venta.usuario?.email || 'sin-email@example.com',
      },
      total: Number(venta.total),
      fechaCreacion: venta.fechaCreacion,
      metodoPago: venta.metodoPago,
    }));
  },
};
