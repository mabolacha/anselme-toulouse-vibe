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
    // Use Supabase Storage for audio files
    const { data } = supabase.storage
      .from('audio-content')
      .getPublicUrl(path);
    return data.publicUrl;
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
    <div className="bg-warm-black/50 backdrop-blur-sm border border-gold/20 rounded-lg p-6">
      <audio
        ref={audioRef}
        src={getAudioUrl(filePath)}
        preload="metadata"
      />
      
      {/* Main Controls */}
      <div className="flex items-center gap-6 mb-6">
        <Button
          onClick={handlePlay}
          disabled={isLoading}
          size="lg"
          className="rounded-full w-16 h-16 p-0 bg-gold hover:bg-gold-muted text-deep-black shadow-gold flex-shrink-0"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-deep-black border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause className="h-7 w-7" />
          ) : (
            <Play className="h-7 w-7 ml-1" />
          )}
        </Button>
        
        <div className="flex-1 min-w-0">
          <div className="text-lg font-bold font-montserrat text-gold mb-1 truncate">{title}</div>
          <div className="text-sm text-muted-foreground font-montserrat">
            {formatTime(currentTime)} / {formatTime(audioDuration)}
          </div>
        </div>

        <Button
          variant="outline"
          size="lg"
          onClick={handleDownload}
          className="border-gold/50 text-gold hover:bg-gold/10 rounded-lg w-14 h-14 p-0 flex-shrink-0"
        >
          <Download className="h-5 w-5" />
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <Slider
          value={[currentTime]}
          max={audioDuration}
          step={1}
          onValueChange={handleProgressChange}
          className="w-full cursor-pointer"
        />
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-4">
        <Volume2 className="h-5 w-5 text-gold flex-shrink-0" />
        <Slider
          value={[volume]}
          max={100}
          step={1}
          onValueChange={handleVolumeChange}
          className="flex-1 max-w-xs"
        />
        <span className="text-sm text-gold font-montserrat font-bold min-w-[3.5ch] flex-shrink-0">
          {volume}%
        </span>
      </div>
    </div>
  );
};

export default AudioPlayer;