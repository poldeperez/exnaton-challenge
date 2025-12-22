import { useQuery } from '@tanstack/react-query';
import { fetchInstallations } from '@/lib/api/meter';
import type { Installation } from '@/lib/types';

export function useInstallations(tenantId: string) {
  return useQuery<Installation[], Error>({
    queryKey: ['installations', tenantId],
    queryFn: () => fetchInstallations(tenantId),
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
}