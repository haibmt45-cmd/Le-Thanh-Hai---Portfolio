import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export type HeaderTab = 'analyze' | 'samples' | 'settings';

interface HeaderProps {
  activeTab: HeaderTab;
  onSelectTab: (tab: HeaderTab) => void;
  hasDataset: boolean;
  onResetToInput: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  hasDataset,
  onResetToInput,
}) => {
  const handleNavClick = (tab: HeaderTab) => {
    if (hasDataset && tab !== 'settings') {
      onResetToInput();
    }
    onSelectTab(tab);
  };

  return (
    <header className="no-print sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Back to Portfolio */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-[#2563EB] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded-md px-1.5 py-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Quay lại Portfolio</span>
          <span className="sm:hidden">Portfolio</span>
        </Link>

        {/* Zone 2: Center Wordmark */}
        <button
          type="button"
          onClick={() => handleNavClick('analyze')}
          className="text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 cursor-pointer hover:text-[#2563EB] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded-md px-2 py-1"
          style={{ fontFamily: 'var(--font-saas-display)' }}
        >
          Social Lens
        </button>

        {/* Zone 3: Quick Nav Tabs */}
        <nav
          aria-label="Điều hướng Social Lens"
          className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0"
        >
          <button
            type="button"
            onClick={() => handleNavClick('analyze')}
            className={`px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'analyze'
                ? 'bg-white text-[#2563EB] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Phân tích mới
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('samples')}
            className={`px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'samples'
                ? 'bg-white text-[#2563EB] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Báo cáo mẫu
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('settings')}
            className={`px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-white text-[#2563EB] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cài đặt API
          </button>
        </nav>
      </div>
    </header>
  );
};
