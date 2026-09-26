import React from 'react';
import { Home, Map, MessageSquareText, User } from 'lucide-react';

export type NavTab = 'home' | 'map' | 'posts' | 'profile';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  postsBadgeCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  postsBadgeCount = 3,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1 shadow-lg">
      <div className="max-w-md mx-auto grid grid-cols-4 items-center h-16">
        {/* 1. Home */}
        <button
          onClick={() => onTabChange('home')}
          aria-label="Home Tab"
          className={`flex flex-col items-center justify-center h-full min-h-[44px] cursor-pointer transition-colors relative ${
            activeTab === 'home' ? 'text-amber-500 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className="relative">
            <Home className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            {activeTab === 'home' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-amber-500 rounded-full" />
            )}
          </div>
          <span className="text-[11px] tracking-tight mt-1">Home</span>
        </button>

        {/* 2. Map */}
        <button
          onClick={() => onTabChange('map')}
          aria-label="Map Tab"
          className={`flex flex-col items-center justify-center h-full min-h-[44px] cursor-pointer transition-colors relative ${
            activeTab === 'map' ? 'text-amber-500 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className="relative">
            <Map className={`w-5 h-5 ${activeTab === 'map' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            {activeTab === 'map' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-amber-500 rounded-full" />
            )}
          </div>
          <span className="text-[11px] tracking-tight mt-1">Map</span>
        </button>

        {/* 3. Posts */}
        <button
          onClick={() => onTabChange('posts')}
          aria-label="Community Posts Tab"
          className={`flex flex-col items-center justify-center h-full min-h-[44px] cursor-pointer transition-colors relative ${
            activeTab === 'posts' ? 'text-amber-500 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className="relative">
            <MessageSquareText className={`w-5 h-5 ${activeTab === 'posts' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            {postsBadgeCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {postsBadgeCount}
              </span>
            )}
            {activeTab === 'posts' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-amber-500 rounded-full" />
            )}
          </div>
          <span className="text-[11px] tracking-tight mt-1">Posts</span>
        </button>

        {/* 4. Profile */}
        <button
          onClick={() => onTabChange('profile')}
          aria-label="Profile Tab"
          className={`flex flex-col items-center justify-center h-full min-h-[44px] cursor-pointer transition-colors relative ${
            activeTab === 'profile' ? 'text-amber-500 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className="relative">
            <User className={`w-5 h-5 ${activeTab === 'profile' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            {activeTab === 'profile' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-amber-500 rounded-full" />
            )}
          </div>
          <span className="text-[11px] tracking-tight mt-1">Profile</span>
        </button>
      </div>
    </nav>
  );
};
