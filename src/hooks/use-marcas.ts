import { useQuery } from '@tanstack/react-query';
import { brandsService } from '@/services/brands/brands.service';

export function useMarcas() {
  return useQuery({
    queryKey: ['marcas'],
    queryFn: () => brandsService.getAll(),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
