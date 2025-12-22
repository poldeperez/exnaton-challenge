import { TabSelectorProps } from '@/lib/types';

export function TabSelector({ tabs, selectedTabId, onSelectTab }: TabSelectorProps) {
  return (
    <div className="space-y-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onSelectTab(tab.id)}
          className={`
              w-full text-left px-3 py-2 rounded transition-colors flex items-center gap-3 cursor-pointer
              ${
                selectedTabId === tab.id
                  ? 'text-gray-900 font-bold'
                  : 'text-gray-600 hover:bg-gray-100'
              }
            `}
        >
          {tab.icon}
          {tab.name}
        </button>
      ))}
    </div>
  );
}