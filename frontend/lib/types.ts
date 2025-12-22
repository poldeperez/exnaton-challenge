export type ViewMode = 'day' | 'week' | 'month' | 'year';

export interface MeasurementPoint {
  timestamp: string;
  solar_value: number;
  consumption_value: number;
  self_consumption: number;
}

export interface DashboardProps {
  installations: Installation[];
  meterData: MeasurementPoint[];
  indicators: Indicators;
  loading: boolean;
  error: string | null;
  onViewModeChange: (mode: ViewMode) => void;
  onDateChange: (date: string) => void;
  onInstallationChange: (id: string) => void;
  viewMode: ViewMode;
  date: string;
  selectedInstallation: Installation | undefined | null;
}

export interface FetchMeterDataParams {
  tenantId: string;
  installationId: string;
  solarMeterId: string;
  solarObisCode: string;
  consumptionMeterId: string;
  consumptionObisCode: string;
  start: string;
  stop: string;
  interval: 'd' | 'w' | 'm' | 'y';
}

export interface Meter {
  meterId: string;
  obisCode: string;
}

export interface Installation {
  id: string;
  name: string;
  meterCount: number;
  meters: Meter[]
}

export interface Tab {
  id: string;
  name: string;
  icon?: React.ReactNode;
}

export interface TabSelectorProps {
  tabs: { id: string; name: string; icon?: React.ReactNode }[];
  selectedTabId: string;
  onSelectTab: (tabId: string) => void;
}

export interface Indicators {
  totalProduction: number;
  selfConsumption: number;
  gridFeedIn: number;
  totalConsumption: number;
  selfConsumptionRate: number;
}

export interface FiltersProps {
  date: string;
  viewMode: ViewMode;
  onDateChange: (date: string) => void;
  onViewModeChange: (mode: ViewMode) => void;
  installations: Installation[];
  selectedInstallation: Installation | undefined | null;
  onInstallationChange: (id: string) => void;
}