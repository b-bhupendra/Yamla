import React, { useState, useEffect } from 'react';
import { Phone, MicOff, Grid, Volume2, Plus, Video, User } from 'lucide-react';
import { motion } from 'motion/react';
import { CallerSettings } from '../types';
import { cn } from '../utils';

interface ActiveCallProps {
  settings: CallerSettings;
  onEndCall: () => void;
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

const IconButton = ({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center gap-2 w-20"
  >
    <div className={cn(
      "w-[72px] h-[72px] rounded-full flex items-center justify-center transition-colors shadow-sm",
      active 
        ? "bg-white text-black" 
        : "bg-white/15 backdrop-blur-2xl text-white hover:bg-white/25"
    )}>
      <Icon size={32} strokeWidth={1.5} className={active ? "fill-black" : "fill-transparent"} />
    </div>
    <span className="text-white/90 text-[13px] tracking-wide font-medium">{label}</span>
  </button>
);

export function ActiveCall({ settings, onEndCall }: ActiveCallProps) {
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(false);
  const [isScreenOff, setIsScreenOff] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-full min-h-screen bg-black overflow-hidden flex flex-col justify-between items-center pb-10">
      
      {/* Proximity Sensor Trigger (Top 25% of Screen) */}
      <div 
        className="absolute top-0 left-0 w-full h-[25vh] z-[100]"
        onMouseEnter={() => setIsScreenOff(true)}
        onMouseLeave={() => setIsScreenOff(false)}
        onTouchStart={(e) => { e.preventDefault(); setIsScreenOff(true); }}
        onTouchEnd={(e) => { e.preventDefault(); setIsScreenOff(false); }}
        onTouchCancel={() => setIsScreenOff(false)}
      />

      {/* Black Screen Overlay for Proximity */}
      {isScreenOff && (
        <div className="absolute inset-0 bg-black z-[99]" />
      )}

      {/* Background Media */}
      {settings.videoUrl ? (
        <video 
          src={settings.videoUrl} 
          autoPlay 
          loop 
          playsInline 
          muted={true}
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        />
      ) : settings.image ? (
        <div 
          className="absolute inset-0 bg-cover bg-center pointer-events-none z-0"
          style={{ backgroundImage: `url(${settings.image})` }}
        />
      ) : (
        <div className="absolute inset-0 bg-[#1c1c1e] pointer-events-none z-0" />
      )}

      {/* Dark gradient so controls are readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-black/70 pointer-events-none z-10" />

      {/* Caller Info & Duration */}
      <div className="relative z-20 flex flex-col items-center w-full mt-24">
        <h1 className="text-white text-[42px] leading-tight font-medium tracking-tight font-sans text-center px-4 overflow-hidden text-ellipsis whitespace-nowrap drop-shadow-md">{settings.name}</h1>
        <span className="text-white/80 text-[20px] font-normal font-sans drop-shadow-md mt-1">{formatDuration(duration)}</span>
      </div>

      <div className="flex-1" />

      {/* Call Actions Grid */}
      <div className="relative z-20 w-full max-w-[340px] px-4 flex flex-col items-center">
        <div className="grid grid-cols-3 gap-y-6 gap-x-5 place-items-center mb-12 w-full">
          <IconButton icon={MicOff} label="mute" active={muted} onClick={() => setMuted(!muted)} />
          <IconButton icon={Grid} label="keypad" />
          <IconButton icon={Volume2} label="audio" active={speaker} onClick={() => setSpeaker(!speaker)} />
          
          <IconButton icon={Plus} label="add call" />
          <IconButton icon={Video} label="FaceTime" />
          <IconButton icon={User} label="contacts" />
        </div>

        {/* End Call Button */}
        <div className="flex justify-center flex-col items-center mb-4">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={onEndCall}
            className="w-[76px] h-[76px] rounded-full bg-[#FF3B30] flex items-center justify-center shadow-lg"
          >
            <Phone className="text-white rotate-[135deg]" size={36} fill="white" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
