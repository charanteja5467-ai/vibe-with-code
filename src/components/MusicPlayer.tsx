import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: 'Cybernetic Dreams',
    artist: 'AI Soundscapes',
    url: 'https://actions.google.com/sounds/v1/science_fiction/alien_spaceship_hum.ogg',
  },
  {
    id: 2,
    title: 'Neon Rain',
    artist: 'Neural Network Synth',
    url: 'https://actions.google.com/sounds/v1/science_fiction/sci_fi_hover_craft.ogg',
  },
  {
    id: 3,
    title: 'Quantum Cafe',
    artist: 'The Algorithms',
    url: 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg',
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const playNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const playPrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const duration = audioRef.current.duration;
      const currentTime = audioRef.current.currentTime;
      if (duration > 0) {
        setProgress((currentTime / duration) * 100);
      }
    }
  };

  const handleTrackEnded = () => {
    playNext();
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = (Number(e.target.value) / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(Number(e.target.value));
    }
  };

  return (
    <div className="flex flex-col bg-[#0a0a0c] border border-zinc-800 rounded-3xl py-6 px-8 shadow-2xl gap-6">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-gradient-to-br from-fuchsia-600 to-purple-800 rounded-sm flex items-center justify-center">
          <Music className="text-white w-5 h-5" />
        </div>
        <div>
          <div className="text-xs font-bold text-white tracking-tight uppercase">
            {currentTrack.title}
          </div>
          <div className="text-[10px] text-zinc-500 font-mono">
             {currentTrack.artist}
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnded}
        loop={false}
      />

      <div className="flex items-center gap-3">
        <span className="text-[10px] font-mono text-zinc-500 w-8 text-right">
          0:00
        </span>
        <div className="flex-1 shrink-0 relative flex items-center group h-4">
            <input
              type="range"
              min="0"
              max="100"
              value={progress || 0}
              onChange={seek}
              className="absolute inset-0 w-full h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:rounded-full my-auto z-10 opacity-0 group-hover:opacity-100 transition-opacity"
            />
            {/* Visual background track (fake accent) */}
            <div className="absolute left-0 right-0 h-1 bg-zinc-800 rounded-full overflow-hidden pointer-events-none my-auto group-hover:opacity-50 transition-opacity">
              <div className="h-full bg-cyan-400" style={{ width: `${progress}%` }} />
            </div>
        </div>
        <span className="text-[10px] font-mono text-zinc-500 w-8">
          4:20
        </span>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="text-zinc-500 hover:text-white transition-colors"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <div className="flex items-center gap-6">
          <button
            onClick={playPrev}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>
          <button
            onClick={togglePlay}
            className="w-12 h-12 flex items-center justify-center bg-white text-black rounded-full shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105 transition-transform"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-1" />
            )}
          </button>
          <button
            onClick={playNext}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
        </div>

        <div className="w-4 h-4" /> {/* Spacer for balance */}
      </div>
    </div>
  );
}
