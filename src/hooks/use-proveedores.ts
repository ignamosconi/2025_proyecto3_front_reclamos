import { useQuery } from '@tanstack/react-query';
import { suppliersService } from '@/services/suppliers/suppliers.service';

export function useProveedores() {
  return useQuery({
    queryKey: ['proveedores'],
    queryFn: () => suppliersService.getAll(),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
