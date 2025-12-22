import { FiltersProps, ViewMode } from '@/lib/types';
import { VIEW_MODES } from '@/lib/dashboard.config';

export default function Filters({date, viewMode, onDateChange, onViewModeChange, selectedInstallation, onInstallationChange, installations}: FiltersProps) {

    return (
        <div className="flex flex-wrap items-center gap-4 w-full bg-white rounded-lg shadow p-4">
            <div className="w-full md:w-auto md:min-w-62.5">
                <select
                    id="installation-select"
                    value={selectedInstallation?.id || ''}
                    onChange={(e) => onInstallationChange(e.target.value)}
                    className="block w-full px-4 py-2 text-xl font-bold text-gray-900 bg-[#fafafa] border border-gray-100 rounded-lg shadow focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                    {installations.map((installation) => (
                    <option key={installation.id} value={installation.id}>
                        {installation.name}
                    </option>
                    ))}
                </select>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap gap-4 items-center w-full md:w-auto md:flex-1">
                <div>
                    <input
                        id="date-select"
                        type="date"
                        value={date}
                        onChange={(e) => onDateChange(e.target.value)}
                        className="px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex gap-2">
                    {VIEW_MODES.map((mode) => (
                        <button
                            key={mode}
                            onClick={() => onViewModeChange(mode as ViewMode)}
                            className={`
                                px-4 py-2 rounded-full font-medium transition-colors duration-300 ease-in cursor-pointer
                                ${
                                    viewMode === mode
                                        ? 'bg-gray-700 text-white font-semibold'
                                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                }
                            `}
                        >
                            {mode.charAt(0).toUpperCase() + mode.slice(1)}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}