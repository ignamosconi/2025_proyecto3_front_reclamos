import { useQuery } from '@tanstack/react-query';
import { linesService } from '@/services/lines/lines.service';

export function useLineas() {
  return useQuery({
    queryKey: ['lineas'],
    queryFn: () => linesService.getAll(),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
