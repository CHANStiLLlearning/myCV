import React, { useState, useRef, useEffect } from 'react';
import type { SceneTheme } from '../types';
import { PERSONAL_INFO } from '../data/portfolioData';
import { sounds } from '../utils/soundEffects';
import { Sparkles, Zap, Rotate3d } from 'lucide-react';

interface Hero3DFaceProps {
  currentTheme: SceneTheme;
  onThemeChange: (theme: SceneTheme) => void;
}

export const Hero3DFace: React.FC<Hero3DFaceProps> = ({ currentTheme, onThemeChange }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [glare, setGlare] = useState<{ x: number; y: number; opacity: number }>({ x: 50, y: 50, opacity: 0 });
  const [isAutoFloating, setIsAutoFloating] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Auto 3D gentle floating orbit when idle
  useEffect(() => {
    if (!isAutoFloating || isHovered) return;
    let animationFrameId: number;
    let time = 0;

    const animate = () => {
      time += 0.025;
      const x = Math.sin(time) * 12; // rotateX
      const y = Math.cos(time * 0.8) * 16; // rotateY
      setRotate({ x, y });
      setGlare({
        x: 50 + Math.cos(time * 0.8) * 30,
        y: 50 + Math.sin(time) * 30,
        opacity: 0.35
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isAutoFloating, isHovered]);

  // Interactive 3D mouse tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation (-22deg to +22deg)
    const rotateX = ((centerY - y) / centerY) * 20;
    const rotateY = ((x - centerX) / centerX) * 22;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setRotate({ x: rotateX, y: rotateY });
    setGlare({ x: glareX, y: glareY, opacity: 0.7 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    sounds.playHover();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!isAutoFloating) {
      setRotate({ x: 0, y: 0 });
      setGlare((prev) => ({ ...prev, opacity: 0 }));
    }
  };

  const toggleAutoFloat = () => {
    sounds.playClick();
    setIsAutoFloating((prev) => !prev);
  };

  const themes: SceneTheme[] = ['cyan', 'violet', 'emerald', 'amber'];

  return (
    <div className="hero-3d-face-perspective-wrapper">
      {/* 3D Holographic Tilt Card */}
      <div
        ref={cardRef}
        className="hero-3d-face-card"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1200px) rotateX(${rotate.x.toFixed(2)}deg) rotateY(${rotate.y.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`,
          transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.5s ease-out'
        }}
        aria-label="Interactive 3D Portrait of Chan Sovannarith"
      >
        {/* Layer 0: Ambient Cyber Glow Behind the Card */}
        <div className={`face-ambient-glow ${currentTheme}`} />

        {/* Dynamic Specular 3D Holographic Glare */}
        <div
          className="face-specular-glare"
          style={{
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.45) 0%, rgba(0, 240, 255, 0.15) 30%, transparent 70%)`,
            opacity: glare.opacity
          }}
        />

        {/* Layer 1: Face Portrait Frame with 3D Depth (translateZ: 30px) */}
        <div className="face-layer-portrait">
          <img
            src="/profile.jpg"
            alt={`${PERSONAL_INFO.fullName} - 3D Interactive Portrait`}
            className="face-portrait-img"
          />

          {/* Holographic Scanlines & Spatial Grid Lines */}
          <div className="face-scanlines-overlay" />
          <div className="face-matrix-overlay" />

          {/* Futuristic Target Reticle & HUD Rings */}
          <div className="face-hud-reticle" />
          <div className="face-corner-bracket top-left" />
          <div className="face-corner-bracket top-right" />
          <div className="face-corner-bracket bottom-left" />
          <div className="face-corner-bracket bottom-right" />
        </div>

        {/* Layer 2: Floating 3D HUD Tag at Top (translateZ: 60px) */}
        <div className="face-layer-hud-top">
          <div className="face-status-pill">
            <span className="live-scan-dot" />
            <span className="live-scan-text">3D HOLOGRAPHIC MATRIX</span>
          </div>
          <span className="face-coords-tag">
            X: {rotate.y.toFixed(0)}° / Y: {rotate.x.toFixed(0)}°
          </span>
        </div>

        {/* Layer 3: Floating 3D Title Card at Bottom (translateZ: 85px) */}
        <div className="face-layer-hud-bottom">
          <div className="face-name-row">
            <h3 className="face-card-name">{PERSONAL_INFO.fullName}</h3>
            <span className="face-alias-badge">{PERSONAL_INFO.name}</span>
          </div>
          <p className="face-card-role">{PERSONAL_INFO.role}</p>

          <div className="face-micro-tags">
            <span className="face-chip">
              <Zap size={11} className="text-cyan" />
              <span>Fluid 60 FPS</span>
            </span>
            <span className="face-chip">
              <Sparkles size={11} className="text-emerald" />
              <span>Zero Lag</span>
            </span>
            <span className="face-chip">Phnom Penh</span>
          </div>
        </div>
      </div>

      {/* Floating 3D Controls Bar */}
      <div className="face-3d-controls-bar">
        <button
          type="button"
          className={`face-ctrl-btn ${isAutoFloating ? 'active' : ''}`}
          onClick={toggleAutoFloat}
          title={isAutoFloating ? 'Pause 3D auto-orbit' : 'Enable 3D auto-orbit'}
        >
          <Rotate3d size={13} className={isAutoFloating ? 'spin-slow' : ''} />
          <span>{isAutoFloating ? '3D Orbit: On' : '3D Orbit: Paused'}</span>
        </button>

        <div className="face-theme-pills-row">
          <span className="face-theme-label">Theme:</span>
          <div className="theme-pills">
            {themes.map((th) => (
              <button
                key={th}
                type="button"
                className={`theme-dot ${th} ${currentTheme === th ? 'active' : ''}`}
                onClick={() => {
                  sounds.playClick();
                  onThemeChange(th);
                }}
                title={`Switch to ${th.toUpperCase()} accent`}
                aria-label={`Theme ${th}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
