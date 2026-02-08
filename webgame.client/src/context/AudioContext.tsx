import { type FC, createContext, useRef, type ReactNode, useCallback, useMemo } from 'react';

export const AudioContext = createContext<AudioContextType | null>(null);

type AudioOptions = {
  loop?: boolean;
  volume?: number;
}
type AudioContextType = {
  playBackgroundMusic: (src: string, options?: AudioOptions) => void;
  playSFX: (src: string, volume?: number) => void;
};

type AudioProviderProps = {
  children: ReactNode;
}
const AudioProvider: FC<AudioProviderProps> = ({ children }) => {
  //Hooks
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const sfxRef = useRef<HTMLAudioElement | null>(null);

  if (!bgMusicRef.current) bgMusicRef.current = new Audio();
  if (!sfxRef.current) sfxRef.current = new Audio();
  const playBackgroundMusic = useCallback((src: string, options: AudioOptions = {}) => {
    const audio = bgMusicRef.current!;
    if (audio.src.includes(src)) {
      if (audio.paused) {
        audio.play().catch(() => {
          console.warn("Autoplay has been blocked. Music will play after first user interaction.");
        });
      }
      return;
    }
    audio.pause();
    audio.src = src;
    audio.loop = options.loop ?? true;
    audio.volume = options.volume ?? 0.25;
    audio.play().catch(() => {
      console.warn("Autoplay has been blocked. Music will play after first user interaction.");
    });
  }, []);
  const playSFX = useCallback((src: string, volume: number = 1.0) => {
    const audio = sfxRef.current!;
    audio.src = src;
    audio.volume = volume;
    audio.play().catch(() => { });
  }, []);
  const value = useMemo(() => ({ playBackgroundMusic, playSFX }), [playBackgroundMusic, playSFX]);
  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};
export default AudioProvider;