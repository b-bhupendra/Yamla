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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-semibold text-center text-gray-800">Call Simulator</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Caller Name</label>
            <input
              type="text"
              name="name"
              value={settings.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Caller Image URL (optional)</label>
            <input
              type="url"
              name="image"
              value={settings.image}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Caller Video URL (optional, mp4/webm)</label>
            <input
              type="url"
              name="videoUrl"
              value={settings.videoUrl}
              onChange={handleChange}
              placeholder="https://.../video.mp4"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Delay Between Calls (Seconds)</label>
            <input
              type="number"
              name="delaySeconds"
              min="1"
              value={settings.delaySeconds}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <button
          onClick={onStart}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          Start Simulator
        </button>
      </div>
    </div>
  );
}
