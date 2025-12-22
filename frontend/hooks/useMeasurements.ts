import { useQuery } from '@tanstack/react-query';
import { fetchMeterData } from '@/lib/api/meter';
import { FetchMeterDataParams, MeasurementPoint } from '@/lib/types';

export function useMeasurements(params: FetchMeterDataParams) {
  return useQuery({
    queryKey: [
      'measurements',
      params.tenantId,
      params.installationId,
      params.solarMeterId,
      params.solarObisCode,
      params.consumptionMeterId,
      params.consumptionObisCode,
      params.start,
      params.stop,
      params.interval,
    ],
    queryFn: async () => {
      const result = await fetchMeterData(params);
      
      // Response mapped to MeasurementPoint structure
      return result.map((item): MeasurementPoint => ({
        timestamp: item.timestamp,
        solar_value: item.solar_value ?? 0,
        consumption_value: item.consumption_value ?? 0,
        self_consumption: item.self_consumption ?? 0,
      }));
    },
    enabled: Boolean(
      params.start &&
      params.stop &&
      params.installationId &&
      params.solarMeterId &&
      params.solarObisCode &&
      params.consumptionMeterId &&
      params.consumptionObisCode
    ),
  });
}
