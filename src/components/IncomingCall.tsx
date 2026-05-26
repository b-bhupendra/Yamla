import React, { useEffect, useRef } from 'react';
import { Phone, MessageSquare, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { CallerSettings } from '../types';
import { RingtonePlayer } from '../audio';

interface IncomingCallProps {
  settings: CallerSettings;
  onAccept: () => void;
  onDecline: () => void;
}

export function IncomingCall({ settings, onAccept, onDecline }: IncomingCallProps) {
  const playerRef = useRef<RingtonePlayer | null>(null);

  useEffect(() => {
    // Start ringtone and vibration
    playerRef.current = new RingtonePlayer();
    playerRef.current.start();

    return () => {
      // Cleanup on unmount (accept/decline)
      if (playerRef.current) {
        playerRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-screen bg-black overflow-hidden flex flex-col justify-between items-center pb-12">
      {/* Background Media */}
      {settings.videoUrl ? (
        <video 
          src={settings.videoUrl} 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
        />
      ) : settings.image ? (
        <div 
          className="absolute inset-0 bg-cover bg-center pointer-events-none z-0"
          style={{ backgroundImage: `url(${settings.image})` }}
        />
      ) : (
        <div className="absolute inset-0 bg-[#1c1c1e] pointer-events-none z-0" />
      )}
      
      {/* Dark/Blur overlay for legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-black/60 pointer-events-none z-10" />

      {/* Caller Info */}
      <div className="relative z-20 flex flex-col items-center w-full mt-24">
        <h1 className="text-white text-[56px] leading-[1.1] font-medium tracking-tight font-sans text-center px-4 overflow-hidden text-ellipsis whitespace-nowrap drop-shadow-md">{settings.name}</h1>
        <span className="text-white/80 text-[22px] mt-1 font-normal font-sans drop-shadow-sm">mobile</span>
      </div>

      {/* Actions */}
      <div className="relative z-20 w-full max-w-[340px] px-6 mb-4 flex flex-col items-center">
        
        {/* Remind me / Message options */}
        <div className="flex justify-between w-full px-4 text-white text-[15px] font-medium mb-16">
          <div className="flex flex-col items-center gap-2 cursor-pointer opacity-80 hover:opacity-100 transition-opacity">
            <Clock size={28} strokeWidth={1.5} />
            <span>Remind Me</span>
          </div>
          <div className="flex flex-col items-center gap-2 cursor-pointer opacity-80 hover:opacity-100 transition-opacity">
            <MessageSquare size={28} strokeWidth={1.5} />
            <span>Message</span>
          </div>
        </div>

        {/* Answer / Decline buttons */}
        <div className="flex justify-between items-center w-full px-[2px]">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={onDecline}
            className="flex flex-col items-center gap-3"
          >
            <div className="w-[76px] h-[76px] rounded-full bg-[#FF3B30] flex items-center justify-center shadow-md">
              <Phone className="text-white rotate-[135deg]" size={36} fill="white" />
            </div>
            <span className="text-white/90 text-[17px] font-normal tracking-wide">Decline</span>
          </motion.button>
          
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={onAccept}
            className="flex flex-col items-center gap-3"
          >
            <div className="w-[76px] h-[76px] rounded-full bg-[#34C759] flex items-center justify-center shadow-md">
              <Phone className="text-white" size={36} fill="white" />
            </div>
            <span className="text-white/90 text-[17px] font-normal tracking-wide">Accept</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
