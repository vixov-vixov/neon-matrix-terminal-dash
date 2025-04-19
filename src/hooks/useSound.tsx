
import { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';

export interface SoundEffects {
  playKeypress: () => void;
  playSuccess: () => void;
  playError: () => void;
  playTransition: () => void;
  playAccess: () => void;
  playDenied: () => void;
  playBoot: () => void;
}

export const useSound = (): SoundEffects => {
  const { state } = useAppContext();
  const [soundsReady, setSoundsReady] = useState(false);
  const [sounds, setSounds] = useState<Record<string, HTMLAudioElement | null>>({
    keypress: null,
    success: null,
    error: null,
    transition: null,
    access: null,
    denied: null,
    boot: null,
  });

  // Create audio elements with browser-compatible formats
  useEffect(() => {
    // Using short beep sounds that are more likely to work across browsers
    const keypressSound = new Audio('/beep-short.mp3');
    const successSound = new Audio('/beep-success.mp3');
    const errorSound = new Audio('/beep-error.mp3');
    const transitionSound = new Audio('/transition.mp3');
    const accessSound = new Audio('/access-granted.mp3');
    const deniedSound = new Audio('/access-denied.mp3');
    const bootSound = new Audio('/boot-sequence.mp3');
    
    // Simple preloading to ensure sounds are ready
    const allSounds = [
      keypressSound, successSound, errorSound, 
      transitionSound, accessSound, deniedSound, bootSound
    ];
    
    // Use fallback sounds that don't require actual audio files
    const createFallbackBeep = (freq = 440, duration = 100, type = 'sine') => {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = type as OscillatorType;
        osc.frequency.value = freq;
        gain.gain.value = 0.1; // Lower volume
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start();
        setTimeout(() => {
          osc.stop();
          ctx.close();
        }, duration);
        
        return true;
      } catch (e) {
        console.warn("Web Audio API not supported, fallback sound failed");
        return false;
      }
    };

    setSounds({
      keypress: keypressSound,
      success: successSound,
      error: errorSound,
      transition: transitionSound,
      access: accessSound,
      denied: deniedSound,
      boot: bootSound,
    });
    
    setSoundsReady(true);

    return () => {
      allSounds.forEach(sound => {
        if (sound) {
          sound.pause();
          sound.currentTime = 0;
        }
      });
    };
  }, []);

  // Sound playing functions with volume and check if enabled
  const playSound = (soundName: keyof typeof sounds) => {
    if (!state.soundEnabled) return;
    
    // Try to play the actual sound file
    if (soundsReady && sounds[soundName]) {
      try {
        const sound = sounds[soundName];
        if (sound) {
          sound.currentTime = 0;
          sound.volume = 0.3; // Lower volume to avoid being too loud
          sound.play().catch(error => {
            // If sound file fails, use fallback beep
            console.log(`Using fallback sound for ${soundName}`);
            createFallbackBeep();
          });
        }
      } catch (error) {
        console.warn(`Sound playback failed for ${soundName}:`, error);
        createFallbackBeep();
      }
    } else {
      // Use fallback beep if sounds aren't ready yet
      createFallbackBeep();
    }
  };
  
  // Helper function for fallback beep sounds
  const createFallbackBeep = (freq = 440, duration = 100, type = 'sine') => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = type as OscillatorType;
      osc.frequency.value = freq;
      gain.gain.value = 0.1; // Lower volume
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      setTimeout(() => {
        osc.stop();
        ctx.close();
      }, duration);
      
      return true;
    } catch (e) {
      console.warn("Web Audio API not supported, fallback sound failed");
      return false;
    }
  };

  return {
    playKeypress: () => playSound('keypress'),
    playSuccess: () => playSound('success'),
    playError: () => playSound('error'),
    playTransition: () => playSound('transition'),
    playAccess: () => playSound('access'),
    playDenied: () => playSound('denied'),
    playBoot: () => playSound('boot'),
  };
};
