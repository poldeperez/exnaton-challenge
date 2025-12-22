'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import { getRange } from '@/lib/date';
import { ViewMode, Installation, } from '@/lib/types';
import { DASHBOARD_TABS } from '@/lib/dashboard.config'
import { calculateIndicators } from '@/lib/calculateIndicators';
import { useMeasurements } from '@/hooks/useMeasurements';
import { useInstallations } from '@/hooks/useInstallations';

const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID!;

export default function HomePage() {
  const [selectedTabId, setSelectedTabId] = useState<string>('1');
  const [selectedInstallation, setSelectedInstallation] = useState<Installation>();
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [date, setDate] = useState<string>('2023-02-01');

  // Fetch installations with React Query
  const {
    data: installations = [],
    isLoading: loadingInstallations,
    error: installationsError,
  } = useInstallations(TENANT_ID);

  // Set initial installation when data loads
  useEffect(() => {
    if (installations.length > 0 && !selectedInstallation) {
      setSelectedInstallation(installations[0]);
    }
  }, [installations, selectedInstallation]);

  const handleInstallationChange = (installationId: string) => {
    const installation = installations.find(i => i.id === installationId);
    if (installation) {
      setSelectedInstallation(installation);
    }
  };

  const baseDate = new Date(date);
  const { start, stop, interval } = getRange(baseDate, viewMode);

  // Find solar and consumption meters form installation
  const solarMeter = selectedInstallation?.meters.find(m => m.obisCode === '0100021D00FF');
  const consumptionMeter = selectedInstallation?.meters.find(m => m.obisCode === '0100011D00FF');

  const hasMissingMeters = selectedInstallation?.id && (!solarMeter || !consumptionMeter);
  const metersError = hasMissingMeters ? 'Missing solar or consumption meter data' : null;

  // Use the measurements hook with caching
  const { data: meterData = [], isLoading: loading, error: meterDataError } = useMeasurements({
    tenantId: TENANT_ID,
    installationId: selectedInstallation?.id ?? '',
    solarMeterId: solarMeter?.meterId ?? '',
    solarObisCode: solarMeter?.obisCode ?? '',
    consumptionMeterId: consumptionMeter?.meterId ?? '',
    consumptionObisCode: consumptionMeter?.obisCode ?? '',
    start,
    stop,
    interval,
  });


  const indicators = calculateIndicators(meterData ?? []);
  const error = installationsError?.message || metersError || (meterDataError as Error)?.message || null;

  if (installationsError) {
    return <div className="flex items-center justify-center min-h-screen text-red-600">{error}</div>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar
        tabs={DASHBOARD_TABS}
        selectedTabId={selectedTabId}
        onSelectTab={setSelectedTabId}
      />
      
      {loadingInstallations ? (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <p className="text-xl text-gray-600">Loading installations...</p>
        </div>
      ) : installations.length === 0 ? (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <p className="text-xl text-gray-600">No installations found for this user</p>
          </div>
        </div>
      ) : selectedTabId === '1' ? (
        <Dashboard
          installations={installations}
          meterData={meterData ?? []}
          indicators={indicators}
          loading={loading}
          error={error}
          onViewModeChange={setViewMode}
          onDateChange={setDate}
          selectedInstallation={selectedInstallation}
          onInstallationChange={handleInstallationChange}
          viewMode={viewMode}
          date={date}
        />
      ) : (
        <div className="flex-1 p-6 bg-gray-50">
          <h1 className="text-3xl text-gray-700 font-bold">Analysis</h1>
          <p className="text-gray-600 mt-2">Could implement and AI agent to analyze the charts.</p>
        </div>
      )}
    </div>
  );
}