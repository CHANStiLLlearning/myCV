import React from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import type { SceneTheme } from '../types';
import { Hero3DFace } from './Hero3DFace';
import { sounds } from '../utils/soundEffects';
import { ArrowRight, Download, Send, Sparkles, MapPin, ChevronDown } from 'lucide-react';

import type { PersonalInfo } from '../services/api';

interface HeroProps {
  currentTheme: SceneTheme;
  onThemeChange: (theme: SceneTheme) => void;
  onOpenResume: () => void;
  profile?: PersonalInfo;
}

export const Hero: React.FC<HeroProps> = ({ currentTheme, onThemeChange, onOpenResume, profile }) => {
  const info = profile || (PERSONAL_INFO as PersonalInfo);
  const scrollTo = (id: string) => {
    sounds.playClick();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="hero-section">
      {/* Background cyber radial glow */}
      <div className={`hero-ambient-glow ${currentTheme}`} />

      <div className="hero-grid-container">
        {/* Left Side: Typography & Narrative */}
        <div className="hero-content">
          {/* Eyebrow Pill */}
          <div className="hero-eyebrow">
            <span className="eyebrow-badge">
              <Sparkles size={13} className="sparkle-icon" />
              <span>{info.role.toUpperCase()}</span>
            </span>
            <div className="location-pill">
              <MapPin size={12} />
              <span>{info.location}</span>
            </div>
          </div>

          {/* Master Headline */}
          <h1 className="hero-headline">
            CRAFTING <br />
            <span className="headline-gradient">DIGITAL EXPERIENCES.</span>
          </h1>

          {/* Introduction & Subtitle */}
          <p className="hero-description">
            Hello, I’m <strong>{info.name}</strong>. {info.bioShort || 'I build fluid, high-performance web applications and interactive digital experiences. Bridging the gap between cutting-edge creative aesthetics and rigorous frontend engineering.'}
          </p>

          {/* Key Quick Technology Tags */}
          <div className="hero-tech-pills">
            <span className="tech-pill">React.js</span>
            <span className="tech-pill">TypeScript</span>
            <span className="tech-pill">Modern CSS3</span>
            <span className="tech-pill">Tailwind CSS</span>
            <span className="tech-pill">60 FPS Motion</span>
          </div>

          {/* CTA Buttons */}
          <div className="hero-cta-group">
            <button
              type="button"
              id="hero-explore-btn"
              className="btn btn-primary"
              onClick={() => scrollTo('projects')}
              onMouseEnter={() => sounds.playHover()}
            >
              <span>Explore My Work</span>
              <ArrowRight size={16} />
            </button>

            <button
              type="button"
              id="hero-contact-btn"
              className="btn btn-secondary"
              onClick={() => scrollTo('contact')}
              onMouseEnter={() => sounds.playHover()}
            >
              <Send size={15} />
              <span>Get In Touch</span>
            </button>

            <button
              type="button"
              id="hero-resume-btn"
              className="btn btn-ghost"
              onClick={() => {
                sounds.playClick();
                onOpenResume();
              }}
              onMouseEnter={() => sounds.playHover()}
              title="View & Download Chan's CV"
            >
              <Download size={15} />
              <span>View CV</span>
            </button>
          </div>

          {/* Live Micro Metric Counters */}
          <div className="hero-metrics-row">
            {info.stats.map((stat, idx) => (
              <div key={idx} className="metric-chip">
                <span className="metric-val">{stat.value}</span>
                <span className="metric-lbl">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Interactive 3D Holographic Face Portrait */}
        <div className="hero-visual">
          <Hero3DFace currentTheme={currentTheme} onThemeChange={onThemeChange} profile={info} />
        </div>
      </div>

      {/* Bottom Scroll Prompt */}
      <button
        type="button"
        className="hero-scroll-prompt"
        onClick={() => scrollTo('about')}
        aria-label="Scroll to About section"
      >
        <span className="scroll-text">SCROLL TO DISCOVER</span>
        <ChevronDown size={18} className="scroll-chevron" />
      </button>
    </section>
  );
};
