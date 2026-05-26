export class RingtonePlayer {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private intervalId: any = null;

  start() {
    if (this.isPlaying) return;
    this.isPlaying = true;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    } catch (e) {
      console.warn("Web Audio API not supported", e);
      return;
    }

    if (navigator.vibrate) {
      // Vibrate pattern for 50 cycles
      navigator.vibrate(Array(50).fill([500, 1000]).flat());
    }

    const playSequence = () => {
      if (!this.ctx || !this.isPlaying) return;
      const t = this.ctx.currentTime;
      
      // Vibration sound (low frequency hum/buzz to simulate phone vibrating on table)
      const vibOsc = this.ctx.createOscillator();
      const vibGain = this.ctx.createGain();
      vibOsc.type = 'sawtooth';
      vibOsc.frequency.value = 45;
      
      const vFilter = this.ctx.createBiquadFilter();
      vFilter.type = 'bandpass';
      vFilter.frequency.value = 100;
      vFilter.Q.value = 1.0;

      vibOsc.connect(vFilter);
      vFilter.connect(vibGain);
      vibGain.connect(this.ctx.destination);

      vibGain.gain.setValueAtTime(0, t);
      vibGain.gain.linearRampToValueAtTime(0.5, t + 0.1);
      vibGain.gain.setValueAtTime(0.5, t + 0.4);
      vibGain.gain.linearRampToValueAtTime(0, t + 0.5);
      
      vibOsc.start(t);
      vibOsc.stop(t + 0.5);

      // Realistic Marimba/Synthesizer ringtone sequence
      const playNote = (freq: number, startOffset: number) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        
        // Add a bit of FM/harmonics for a "marimba" sound
        const fmOsc = this.ctx.createOscillator();
        const fmGain = this.ctx.createGain();
        fmOsc.type = 'triangle';
        fmOsc.frequency.value = freq * 2;
        fmGain.gain.value = 150;
        fmOsc.connect(fmGain);
        fmGain.connect(osc.frequency);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        const startTime = t + startOffset;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.4, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);
        
        fmOsc.start(startTime);
        osc.start(startTime);
        fmOsc.stop(startTime + 0.5);
        osc.stop(startTime + 0.5);
      };

      // iOS "Reflection" / "Opening" inspired motif
      playNote(659.25, 0.0);       // E5
      playNote(740.00, 0.15);      // F#5
      playNote(880.00, 0.3);       // A5
      playNote(1108.73, 0.45);     // C#6
      playNote(880.00, 0.6);       // A5
      playNote(1318.51, 0.85);     // E6
      playNote(1108.73, 1.0);      // C#6
    };

    playSequence();
    // Replay every 2 seconds
    this.intervalId = setInterval(playSequence, 2000);
  }

  stop() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
    if (navigator.vibrate) {
      navigator.vibrate(0);
    }
  }
}
