
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
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [sounds, setSounds] = useState<Record<string, HTMLAudioElement | null>>({
    keypress: null,
    success: null,
    error: null,
    transition: null,
    access: null,
    denied: null,
    boot: null,
  });

  // Initialize Web Audio API context for fallback sounds
  useEffect(() => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        setAudioContext(new AudioContextClass());
      }
    } catch (e) {
      console.warn("Web Audio API not supported in this browser");
    }

    return () => {
      if (audioContext) {
        audioContext.close().catch(e => console.warn("Error closing audio context:", e));
      }
    };
  }, []);

  // Create audio elements with browser-compatible formats
  useEffect(() => {
    const createAudio = (path: string): HTMLAudioElement => {
      const audio = new Audio(path);
      // Pre-load the audio to check if it's valid
      audio.preload = 'auto';
      // Set low volume by default
      audio.volume = 0.3;
      return audio;
    };

    // Create audio elements
    try {
      const keypressSound = createAudio('/beep-short.mp3');
      const successSound = createAudio('/beep-success.mp3');
      const errorSound = createAudio('/beep-error.mp3');
      const transitionSound = createAudio('/transition.mp3');
      const accessSound = createAudio('/access-granted.mp3');
      const deniedSound = createAudio('/access-denied.mp3');
      const bootSound = createAudio('/boot-sequence.mp3');
      
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
    } catch (e) {
      console.warn("Error creating audio elements:", e);
      // We'll rely on fallback sounds
      setSoundsReady(false);
    }

    return () => {
      // Cleanup function - stop all sounds
      Object.values(sounds).forEach(sound => {
        if (sound) {
          sound.pause();
          sound.currentTime = 0;
        }
      });
    };
  }, []);

  // Helper function for fallback beep sounds using Web Audio API
  const createFallbackBeep = (
    freq = 440, 
    duration = 100, 
    type: OscillatorType = 'sine',
    volume = 0.1
  ): boolean => {
    if (!audioContext) return false;
    
    try {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.value = volume;
      
      osc.connect(gain);
      gain.connect(audioContext.destination);
      
      osc.start();
      setTimeout(() => {
        osc.stop();
      }, duration);
      
      return true;
    } catch (e) {
      console.warn("Fallback sound failed:", e);
      return false;
    }
  };

  // Sound playing function with improved error handling and fallbacks
  const playSound = (soundName: keyof typeof sounds) => {
    if (!state.soundEnabled) return;
    
    // Try to play the actual sound file
    if (soundsReady && sounds[soundName]) {
      try {
        const sound = sounds[soundName];
        if (sound) {
          // Reset the audio to the beginning
          sound.currentTime = 0;
          
          // Create a promise to play the sound
          const playPromise = sound.play();
          
          // Handle the promise to catch any errors
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.log(`Sound playback failed for ${soundName}, using fallback:`, error);
              playFallbackSound(soundName);
            });
          }
        } else {
          playFallbackSound(soundName);
        }
      } catch (error) {
        console.warn(`Error playing sound ${soundName}:`, error);
        playFallbackSound(soundName);
      }
    } else {
      // Use fallback beep if sounds aren't ready
      playFallbackSound(soundName);
    }
  };
  
  // Play appropriate fallback sound based on sound type
  const playFallbackSound = (soundName: string) => {
    switch (soundName) {
      case 'keypress':
        createFallbackBeep(440, 40, 'sine', 0.05);
        break;
      case 'success':
        createFallbackBeep(880, 120, 'sine', 0.1);
        break;
      case 'error':
        createFallbackBeep(220, 200, 'square', 0.1);
        break;
      case 'transition':
        createFallbackBeep(660, 80, 'sine', 0.1);
        setTimeout(() => createFallbackBeep(880, 80, 'sine', 0.1), 100);
        break;
      case 'access':
        createFallbackBeep(880, 80, 'sine', 0.1);
        setTimeout(() => createFallbackBeep(1320, 120, 'sine', 0.1), 100);
        break;
      case 'denied':
        createFallbackBeep(440, 100, 'sawtooth', 0.1);
        setTimeout(() => createFallbackBeep(220, 200, 'sawtooth', 0.1), 120);
        break;
      case 'boot':
        // Sequence of beeps for boot sound
        const intervals = [0, 200, 400, 600, 800];
        const frequencies = [440, 660, 880, 1100, 1320];
        
        intervals.forEach((delay, i) => {
          setTimeout(() => createFallbackBeep(frequencies[i], 100, 'sine', 0.08), delay);
        });
        break;
      default:
        createFallbackBeep(440, 100, 'sine', 0.1);
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
