import BarChartSection from './BarChartSection';
import Filters from './Filters';
import { DashboardProps } from '@/lib/types';
import IndicatorProduction from './IndicatorProduction';
import IndicatorConsumption from './IndicatorConsumption';


export default function Dashboard({installations, meterData, indicators, loading, error, onViewModeChange, onDateChange, viewMode, date, selectedInstallation, onInstallationChange}: DashboardProps) {
  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        <Filters date={date} viewMode={viewMode} onDateChange={onDateChange} onViewModeChange={onViewModeChange} selectedInstallation={selectedInstallation} installations={installations} onInstallationChange={onInstallationChange}/>

        {/* Content */}
        {loading && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">Loading...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <BarChartSection meterData={meterData} viewMode={viewMode} />
            <IndicatorProduction indicators={indicators} />
            <IndicatorConsumption indicators={indicators} />
          </>
        )}
      </div>
    </div>
  );
}