import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Indicators } from '@/lib/types';

export default function IndicatorProduction({ indicators }: { indicators: Indicators }) {
  const { totalProduction, selfConsumption, gridFeedIn, selfConsumptionRate } = indicators;

  const chartData = [
    { name: 'Self Consumption', value: selfConsumption, color: '#10B981' },
    { name: 'Grid Feed-in', value: gridFeedIn, color: '#2894c9' },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Solar Energy Production
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
                {totalProduction.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">kWh Produced</div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="flex flex-col justify-center space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Solar Production</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalProduction.toFixed(2)} kWh
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Consumed</p>
                <p className="text-2xl font-bold text-green-700">
                  {selfConsumption.toFixed(2)} kWh
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {selfConsumptionRate.toFixed(1)}% of production
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Fed to grid</p>
                <p className="text-2xl font-bold text-[#2894c9]">
                  {gridFeedIn.toFixed(2)} kWh
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {totalProduction > 0 ? ((gridFeedIn / totalProduction) * 100).toFixed(1) : 0}% of production
                </p>
              </div>
              <div className="w-12 h-12 bg-[#1d81b320] rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-[#1d81b3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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