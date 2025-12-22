import { MeasurementPoint, Indicators } from './types';

export function calculateIndicators(meterData: MeasurementPoint[]): Indicators {
  if (!meterData || meterData.length === 0) {
    return {
      totalProduction: 0,
      selfConsumption: 0,
      gridFeedIn: 0,
      totalConsumption: 0,
      selfConsumptionRate: 0,
    };
  }

  // Sum up the values from the DB
  const totalProduction = meterData.reduce((sum, p) => sum + p.solar_value, 0);
  const totalConsumption = meterData.reduce((sum, p) => sum + p.consumption_value, 0);
  const selfConsumption = meterData.reduce((sum, p) => sum + p.self_consumption, 0);
  const gridFeedIn = totalProduction - selfConsumption;
  const selfConsumptionRate = totalProduction > 0
    ? (selfConsumption / totalProduction) * 100
    : 0;

  return {
    totalProduction,
    selfConsumption,
    gridFeedIn,
    totalConsumption,
    selfConsumptionRate,
  };
}