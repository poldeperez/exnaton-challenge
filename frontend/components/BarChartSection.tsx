import { ComposedChart, Bar, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { MeasurementPoint, ViewMode } from '@/lib/types';

export default function BarChartSection({ meterData, viewMode }: { meterData: MeasurementPoint[]; viewMode: ViewMode; }) {
  // Directly use meterData as chartData since timestamps are already aligned
  const chartData = meterData.map((point) => ({
    timestamp: point.timestamp,
    solar: point.solar_value,
    consumption: point.consumption_value,
    self_consumption: point.self_consumption,
    label:
      viewMode === 'day'
        ? new Date(point.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })
        : new Date(point.timestamp).toLocaleDateString(),
  }));

  const hasSolarData = meterData.length > 0 && meterData.some(p => Number(p.solar_value) > 0);
  const hasConsumptionData = meterData.length > 0 && meterData.some(p => Number(p.consumption_value) > 0);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Energy Overview
      </h2>
      {!hasSolarData && !hasConsumptionData ? (
        <div className="flex items-center justify-center h-80">
          <p className="text-gray-500">No data available for this period</p>
        </div>
      ) : (
        <div className="w-full h-80 relative">
          <ResponsiveContainer width="100%" height={360}>
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                label={{
                  value: 'kWh',
                  angle: -90,
                  position: 'insideLeft',
                }}
              />
              <Tooltip
                formatter={(value: number | undefined) => [
                  `${(value ?? 0).toFixed(4)} kWh`
                ]}
              />
              <Legend verticalAlign="top" />
              {hasConsumptionData && (
                <Bar
                  dataKey="consumption"
                  name="Consumption"
                  fill="#9CA3AF"
                  stroke="#6B7280"
                />
              )}
              {hasSolarData && (
                <>
                  {viewMode === 'day' ? (
                    <Area
                      type="monotone"
                      dataKey="solar"
                      name="Solar Production"
                      fill="#10B981"
                      fillOpacity={0.2}
                      strokeWidth={2}
                      stroke="#10B981"
                    />
                  ) : (
                    <Bar
                      dataKey="solar"
                      name="Solar Production"
                      fill="#10B981"
                    />
                  )}
                </>
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}