import React from 'react';
import { CallerSettings } from '../types';

interface SettingsProps {
  settings: CallerSettings;
  onUpdate: (newSettings: CallerSettings) => void;
  onStart: () => void;
}

export function Settings({ settings, onUpdate, onStart }: SettingsProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onUpdate({
      ...settings,
      [name]: name === 'delaySeconds' ? Number(value) : value,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-black p-6">
      <div className="bg-[#1c1c1e] p-8 rounded-[32px] w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-medium text-center text-white">Call Simulator</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Caller Name</label>
            <input
              type="text"
              name="name"
              value={settings.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#2c2c2e] text-white border border-[#3c3c3e] rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Caller Image URL (optional)</label>
            <input
              type="url"
              name="image"
              value={settings.image}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full px-4 py-3 bg-[#2c2c2e] text-white border border-[#3c3c3e] rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Caller Video URL (optional, mp4/webm)</label>
            <input
              type="url"
              name="videoUrl"
              value={settings.videoUrl}
              onChange={handleChange}
              placeholder="https://.../video.mp4"
              className="w-full px-4 py-3 bg-[#2c2c2e] text-white border border-[#3c3c3e] rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Delay Between Calls (Seconds)</label>
            <input
              type="number"
              name="delaySeconds"
              min="1"
              value={settings.delaySeconds}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#2c2c2e] text-white border border-[#3c3c3e] rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-500"
            />
          </div>
        </div>

        <button
          onClick={onStart}
          className="w-full bg-[#0a84ff] hover:bg-blue-500 text-white font-semibold py-3.5 rounded-xl transition-colors mt-2"
        >
          Start Simulator (Fullscreen)
        </button>
      </div>
    </div>
  );
}
