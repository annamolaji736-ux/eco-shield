import React, { useState } from 'react';
import { Wifi, Battery, Smartphone, Maximize2, Minimize2, ZoomIn, ZoomOut, AlertCircle, Sparkles } from 'lucide-react';

interface PhoneMockupProps {
  children: React.ReactNode;
  activeSignalLevel?: number;
}

export const PhoneMockup: React.FC<PhoneMockupProps> = ({ children, activeSignalLevel = 2 }) => {
  const [deviceView, setDeviceView] = useState<'iphone' | 'fullscreen'>('iphone');
  const [finish, setFinish] = useState<'desert' | 'natural' | 'black'>('desert');
  const [scale, setScale] = useState<number>(1);
  const [dynamicIslandExpanded, setDynamicIslandExpanded] = useState<boolean>(false);

  // Chassis finish colors
  const finishStyles = {
    desert: 'bg-[#cfb997] border-[#bda682] shadow-[#8c7453]/25',
    natural: 'bg-[#9f9c96] border-[#8a8781] shadow-black/30',
    black: 'bg-[#2a2c30] border-[#1d1f23] shadow-black/40',
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-slate-100 flex flex-col items-center justify-start py-4 px-2 sm:px-4">
      {/* Top Floating Control Bar for Mockup / Viewport customization */}
      <div className="w-full max-w-xl mx-auto mb-4 flex items-center justify-between bg-neutral-800/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-neutral-700/60 shadow-lg text-xs z-50">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span className="font-bold text-white tracking-tight">
            ResQ <span className="text-amber-400 font-normal">iOS Preview</span>
          </span>
          <span className="hidden sm:inline-block text-[10px] text-neutral-400 bg-neutral-700 px-2 py-0.5 rounded-full font-mono">
            iPhone 16 Pro
          </span>
        </div>

        {/* View Mode & Finish Toggle */}
        <div className="flex items-center gap-2">
          {/* Finish selector */}
          {deviceView === 'iphone' && (
            <div className="hidden sm:flex items-center gap-1 bg-neutral-900/80 p-1 rounded-lg border border-neutral-700">
              <button
                onClick={() => setFinish('desert')}
                title="Desert Titanium (Gold)"
                className={`w-4 h-4 rounded-full bg-[#d8c5a4] transition-transform ${finish === 'desert' ? 'scale-125 ring-2 ring-amber-400' : 'opacity-70'}`}
              />
              <button
                onClick={() => setFinish('natural')}
                title="Natural Titanium"
                className={`w-4 h-4 rounded-full bg-[#9f9c96] transition-transform ${finish === 'natural' ? 'scale-125 ring-2 ring-white' : 'opacity-70'}`}
              />
              <button
                onClick={() => setFinish('black')}
                title="Black Titanium"
                className={`w-4 h-4 rounded-full bg-[#2a2c30] transition-transform ${finish === 'black' ? 'scale-125 ring-2 ring-neutral-400' : 'opacity-70'}`}
              />
            </div>
          )}

          {/* Scale controls */}
          {deviceView === 'iphone' && (
            <div className="hidden md:flex items-center gap-1 text-neutral-300">
              <button
                onClick={() => setScale((s) => Math.max(0.85, s - 0.05))}
                className="p-1 hover:text-white"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono tabular-nums">{Math.round(scale * 100)}%</span>
              <button
                onClick={() => setScale((s) => Math.min(1.15, s + 0.05))}
                className="p-1 hover:text-white"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Mockup vs Fullscreen toggle */}
          <button
            onClick={() => setDeviceView(deviceView === 'iphone' ? 'fullscreen' : 'iphone')}
            className="flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-slate-900 font-bold rounded-lg hover:bg-amber-300 active:scale-95 transition-all cursor-pointer"
          >
            {deviceView === 'iphone' ? (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Fullscreen</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5" />
                <span>iPhone Frame</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main View Area */}
      {deviceView === 'fullscreen' ? (
        <div className="w-full max-w-md mx-auto bg-neutral-50 text-slate-900 min-h-screen relative shadow-2xl rounded-none pb-12 overflow-x-hidden">
          {children}
        </div>
      ) : (
        /* iPhone 16 Pro Mockup Frame */
        <div
          className="relative transition-transform duration-300 ease-out my-auto"
          style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
        >
          {/* Side Hardware Buttons */}
          {/* Action button */}
          <div className="absolute -left-[14px] top-[115px] w-[4px] h-[26px] bg-neutral-500 rounded-l-sm" />
          {/* Volume Up */}
          <div className="absolute -left-[14px] top-[155px] w-[4px] h-[50px] bg-neutral-500 rounded-l-sm" />
          {/* Volume Down */}
          <div className="absolute -left-[14px] top-[215px] w-[4px] h-[50px] bg-neutral-500 rounded-l-sm" />
          {/* Power Button */}
          <div className="absolute -right-[14px] top-[170px] w-[4px] h-[75px] bg-neutral-500 rounded-r-sm" />

          {/* Phone Body with Titanium Finish */}
          <div
            className={`w-[390px] h-[844px] rounded-[54px] p-[10px] border-[4px] shadow-2xl transition-colors duration-500 ${finishStyles[finish]} relative`}
          >
            {/* Inner Black Bezel */}
            <div className="w-full h-full bg-black rounded-[46px] p-[3px] overflow-hidden relative shadow-inner">
              {/* Screen Content Container */}
              <div className="w-full h-full bg-[#FAF9F6] text-slate-900 rounded-[42px] overflow-hidden flex flex-col relative select-none">
                
                {/* iOS Dynamic Island & Status Bar */}
                <div className="relative z-50 bg-amber-400 pt-3 pb-2 px-6 flex items-center justify-between text-slate-950 font-semibold select-none">
                  {/* Status Bar: Time */}
                  <span className="text-[14px] font-bold tracking-tight">9:41</span>

                  {/* Interactive Dynamic Island */}
                  <div
                    onClick={() => setDynamicIslandExpanded(!dynamicIslandExpanded)}
                    className={`absolute left-1/2 -translate-x-1/2 top-2 bg-black text-white rounded-full transition-all duration-300 ease-in-out cursor-pointer flex items-center justify-center shadow-md ${
                      dynamicIslandExpanded ? 'w-[230px] h-[36px] px-3 gap-2' : 'w-[100px] h-[28px] px-2'
                    }`}
                  >
                    {!dynamicIslandExpanded ? (
                      <div className="flex items-center justify-between w-full px-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-amber-300 font-mono">Signal #2</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between w-full text-[11px] font-medium text-amber-300">
                        <span className="flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 text-red-500" /> Flood Watch
                        </span>
                        <span className="text-white font-mono text-[10px]">Active SOS</span>
                      </div>
                    )}
                  </div>

                  {/* Status Bar Icons: Cellular, 5G, Wifi, Battery */}
                  <div className="flex items-center gap-1.5 text-slate-900 text-xs">
                    <span className="text-[11px] font-bold">5G</span>
                    <Wifi className="w-3.5 h-3.5 stroke-[2.5]" />
                    <div className="flex items-center gap-0.5">
                      <span className="text-[10px] font-mono font-bold">98%</span>
                      <Battery className="w-4 h-4 stroke-[2.5] fill-current" />
                    </div>
                  </div>
                </div>

                {/* App Content Scrollable Area */}
                <div className="flex-1 overflow-y-auto no-scrollbar relative">
                  {children}
                </div>

                {/* iOS Home Indicator Bar */}
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-900/60 rounded-full pointer-events-none z-40" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
