import { MeasurementPoint, Installation, FetchMeterDataParams } from '../types';

export async function fetchMeterData({
  solarMeterId,
  solarObisCode,
  consumptionMeterId,
  consumptionObisCode,
  tenantId,
  installationId,
  start,
  stop,
  interval,
}: FetchMeterDataParams): Promise<MeasurementPoint[]> {
  const params = new URLSearchParams({
    installationId,
    solarMeterId,
    solarObisCode,
    consumptionMeterId,
    consumptionObisCode,
    measurement: 'energy',
    start,
    stop,
    interval,
    limit: '5000',
  });

  const res = await fetch(
    `/api/meterdata/measurement?${params.toString()}`,
    {
      headers: {
        'x-tenant-id': tenantId,
      },
    },
  );

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  const json = await res.json();
  return (json.data || []).map((item: MeasurementPoint) => ({
    timestamp: item.timestamp,
    solar_value: Number(item.solar_value ?? 0),
    consumption_value: Number(item.consumption_value ?? 0),
    self_consumption: Number(item.self_consumption ?? 0),
  }));
}

export async function fetchInstallations(tenantId: string): Promise<Installation[]> {
  const res = await fetch('/api/meterdata/installations', {
    headers: { 'x-tenant-id': tenantId },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch installations: ${res.status}`);
  }

  return res.json();
}