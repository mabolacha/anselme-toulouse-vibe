import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { supabase } from '@/integrations/supabase/client';

interface AudioPlayerProps {
  title: string;
  filePath: string;
  duration?: number;
  onPlayCountUpdate?: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  title, 
  filePath, 
  duration = 0,
  onPlayCountUpdate 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(duration);
  const [volume, setVolume] = useState(70);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const getAudioUrl = (path: string) => {
    // For testing, use local files from public folder
    return `/${path}`;
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        setIsLoading(true);
        await audioRef.current.play();
        if (onPlayCountUpdate) {
          onPlayCountUpdate();
        }
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setAudioDuration(audioRef.current.duration);
    }
  };

  const handleProgressChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const handleDownload = () => {
    const url = getAudioUrl(filePath);
    const link = document.createElement('a');
    link.href = url;
    link.download = title;
    link.click();
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume / 100;
    
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [volume]);

  return (
    <div className="bg-card/80 backdrop-blur-sm border border-gold/20 rounded-lg p-4">
      <audio
        ref={audioRef}
        src={getAudioUrl(filePath)}
        preload="metadata"
      />
      
      {/* Controls */}
      <div className="flex items-center gap-4 mb-4">
        <Button
          onClick={handlePlay}
          disabled={isLoading}
          size="lg"
          className="rounded-full w-12 h-12 p-0 bg-gradient-gold hover:bg-gold-muted text-deep-black shadow-gold"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-deep-black border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5" />
          )}
        </Button>
        
        <div className="flex-1">
          <div className="text-sm font-montserrat text-gold mb-1">{title}</div>
          <div className="text-xs text-muted-foreground font-montserrat">
            {formatTime(currentTime)} / {formatTime(audioDuration)}
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
          className="border-gold text-gold hover:bg-gold hover:text-deep-black"
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <Slider
          value={[currentTime]}
          max={audioDuration}
          step={1}
          onValueChange={handleProgressChange}
          className="w-full cursor-pointer"
        />
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-3">
        <Volume2 className="h-4 w-4 text-gold" />
        <Slider
          value={[volume]}
          max={100}
          step={1}
          onValueChange={handleVolumeChange}
          className="flex-1 max-w-24"
        />
        <span className="text-xs text-muted-foreground font-montserrat min-w-[3ch]">
          {volume}%
        </span>
      </div>
    </div>
  );
};

export default AudioPlayer;