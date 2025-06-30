import React from 'react';
import { Home, FileText, Phone, Lock } from 'lucide-react';

interface NavigationProps {
  activeTab: 'home' | 'results' | 'contact';
  setActiveTab: (tab: 'home' | 'results' | 'contact') => void;
  resultsUnlocked: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab, resultsUnlocked }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home, enabled: true },
    { id: 'results', label: 'Results', icon: FileText, enabled: resultsUnlocked },
    { id: 'contact', label: 'Contact', icon: Phone, enabled: true },
  ] as const;

  return (
    <nav className="bg-white shadow-sm border-b border-green-100 sticky top-0 z-40">
      <div className="container mx-auto max-w-4xl">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => tab.enabled && setActiveTab(tab.id)}
              disabled={!tab.enabled}
              className={`
                flex-1 flex items-center justify-center px-4 py-4 text-sm font-medium transition-all duration-200
                ${activeTab === tab.id
                  ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                  : tab.enabled
                  ? 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                  : 'text-gray-400 cursor-not-allowed'
                }
              `}
            >
              <div className="flex items-center space-x-2">
                {tab.enabled ? (
                  <tab.icon className="h-5 w-5" />
                ) : (
                  <Lock className="h-5 w-5" />
                )}
                <span className="hidden sm:inline">{tab.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;