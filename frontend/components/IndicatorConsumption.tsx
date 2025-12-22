import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Indicators } from '@/lib/types';

export default function IndicatorConsumption({ indicators }: { indicators: Indicators }) {
  const { totalConsumption, selfConsumption } = indicators;
  const fromGrid = totalConsumption - selfConsumption;
  const selfConsumptionRate = totalConsumption > 0 ? (selfConsumption / totalConsumption) * 100 : 0;
  const fromGridRate = totalConsumption > 0 ? (fromGrid / totalConsumption) * 100 : 0;

  const chartData = [
    { name: 'Self Consumed', value: selfConsumption, color: '#10B981' },
    { name: 'From Grid', value: fromGrid, color: '#fbbf24' },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Energy Consumption
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Circular Chart */}
        <div className="flex flex-col items-center">
          <div className="w-full h-80 relative">
            <ResponsiveContainer width="100%" height={330}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="52%"
                  innerRadius={75}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number | undefined) => `${(value ?? 0).toFixed(2)} kWh`}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="text-3xl font-bold text-gray-900">
                {totalConsumption.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">kWh Consumed</div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="flex flex-col justify-center space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Consumption</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalConsumption.toFixed(2)} kWh
                </p>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Self Consumed</p>
                <p className="text-2xl font-bold text-green-700">
                  {selfConsumption.toFixed(2)} kWh
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {selfConsumptionRate.toFixed(1)}% of consumption
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">From Grid</p>
                <p className="text-2xl font-bold text-yellow-700">
                  {fromGrid.toFixed(2)} kWh
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {fromGridRate.toFixed(1)}% of consumption
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}