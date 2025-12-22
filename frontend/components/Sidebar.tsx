'use client';

import { useState } from 'react';
import { TabSelector } from './TabSelector';
import { TabSelectorProps } from '@/lib/types';

export default function Sidebar({ tabs, selectedTabId, onSelectTab }: TabSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectTab = (tabId: string) => {
    onSelectTab(tabId);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 py-2 px-3 bg-gray-700 text-white rounded-md cursor-pointer"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-white border-r border-gray-200
          transform transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-6">
          <nav>
            <div className="mb-4">
              <h3 className="text-md font-semibold text-gray-700 uppercase mb-2 mt-8 lg:mt-0">
                Energy Measurement
              </h3>
              <TabSelector 
                tabs={tabs} 
                selectedTabId={selectedTabId} 
                onSelectTab={handleSelectTab}
              />
            </div>
          </nav>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
        />
      )}
    </>
  );
}