import React, { useState, useEffect } from 'react';
import { AppState, CallerSettings } from './types';
import { Settings } from './components/Settings';
import { IncomingCall } from './components/IncomingCall';
import { ActiveCall } from './components/ActiveCall';

export default function App() {
  const [appState, setAppState] = useState<AppState>('settings');
  const [settings, setSettings] = useState<CallerSettings>({
    name: 'Unknown Caller',
    image: '',
    videoUrl: '',
    delaySeconds: 3,
  });

  // Handle the fake call loop
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    
    if (appState === 'idle') {
      timeout = setTimeout(() => {
        setAppState('incoming');
      }, settings.delaySeconds * 1000);
    }
    
    return () => clearTimeout(timeout);
  }, [appState, settings.delaySeconds]);

  const handleStart = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      } else if ((document.documentElement as any).webkitRequestFullscreen) {
        await (document.documentElement as any).webkitRequestFullscreen();
      }
    } catch (err) {
      console.warn("Fullscreen failed:", err);
    }
    setAppState('idle');
  };

  const handleAccept = () => setAppState('active');
  const handleDecline = () => setAppState('idle');
  const handleEndCall = () => setAppState('idle');
  const handleBackToSettings = () => {
    try {
      if (document.exitFullscreen && document.fullscreenElement) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen && (document as any).webkitFullscreenElement) {
        (document as any).webkitExitFullscreen();
      }
    } catch (err) {
      // ignore
    }
    setAppState('settings');
  };

  return (
    <div className="w-full h-[100dvh] bg-black overflow-hidden font-sans select-none pb-[safe-area-inset-bottom]">
      {appState === 'settings' && (
        <Settings 
          settings={settings} 
          onUpdate={setSettings} 
          onStart={handleStart} 
        />
      )}
      
      {appState === 'idle' && (
        <div className="flex flex-col items-center justify-center h-full bg-black text-white p-6 relative">
          <button 
            onClick={handleBackToSettings}
            className="absolute top-8 left-8 text-sm text-blue-400 hover:text-blue-300 font-medium"
          >
            ← Configure Settings
          </button>
          
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-medium tracking-tight">Simulator is active</h2>
            <p className="text-gray-400">
              Waiting {settings.delaySeconds} seconds before incoming call...
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Note: Sound & Vibration require you to interact closely with the page.
            </p>
            <div className="mt-8 flex justify-center">
              <div className="w-8 h-8 border-2 border-dashed border-gray-400 rounded-full animate-spin"></div>
            </div>
            <button 
              onClick={() => setAppState('incoming')}
              className="mt-8 text-sm text-gray-500 hover:text-white transition-colors"
            >
              Trigger Now
            </button>
          </div>
        </div>
      )}
      
      {appState === 'incoming' && (
        <IncomingCall 
          settings={settings}
          onAccept={handleAccept}
          onDecline={handleDecline}
        />
      )}
      
      {appState === 'active' && (
        <ActiveCall 
          settings={settings}
          onEndCall={handleEndCall}
        />
      )}
    </div>
  );
}
