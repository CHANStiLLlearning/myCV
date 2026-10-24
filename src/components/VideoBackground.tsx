import React, { useRef, useEffect, useState } from 'react';
import { Film, Eye, EyeOff } from 'lucide-react';

interface VideoBackgroundProps {
  theme: string;
}

export const VideoBackground: React.FC<VideoBackgroundProps> = ({ theme: _theme }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [dimmed, setDimmed] = useState<boolean>(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.85; // Cinematic smooth speed
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback
        setIsPlaying(false);
      });
    }
  }, []);

  const togglePlayback = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleDimmed = () => {
    setDimmed((prev) => !prev);
  };

  return (
    <div className={`video-bg-container ${dimmed ? 'dimmed' : ''}`} aria-hidden="true">
      <video
        ref={videoRef}
        className="video-bg-element"
        src="/coding-bg.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      {/* Dark vignette and cyber scanline overlays for crystal-clear readability */}
      <div className="video-bg-overlay" />
      <div className="video-bg-gradient" />
      <div className="video-bg-scanlines" />

      {/* Floating subtle control pill */}
      <div className="video-bg-controls no-print">
        <button
          type="button"
          className="video-ctrl-btn"
          onClick={togglePlayback}
          title={isPlaying ? 'Pause background video' : 'Play background video'}
          aria-label="Toggle background video playback"
        >
          <Film size={12} className={isPlaying ? 'pulse' : ''} />
          <span>{isPlaying ? 'BG Video' : 'Paused'}</span>
        </button>

        <button
          type="button"
          className="video-ctrl-btn"
          onClick={toggleDimmed}
          title={dimmed ? 'Increase video brightness' : 'Dim video for higher contrast'}
          aria-label="Toggle video dimming"
        >
          {dimmed ? <Eye size={12} /> : <EyeOff size={12} />}
          <span>{dimmed ? 'Brighten' : 'Dim'}</span>
        </button>
      </div>
    </div>
  );
};
