import React from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import type { SceneTheme } from '../types';
import { sounds } from '../utils/soundEffects';
import { Sparkles, Terminal, Cpu, Layers, CheckCircle2, Heart } from 'lucide-react';

interface AboutProps {
  theme: SceneTheme;
}

const PRINCIPLES = [
  {
    icon: Layers,
    title: 'Visual Polish & Precision',
    description: 'Every padding, font weight, and micro-interaction is intentionally crafted to feel tactile and premium.'
  },
  {
    icon: Cpu,
    title: '60 FPS Performance',
    description: 'GPU-accelerated transforms, zero layout shifts, optimized Three.js geometries, and tight bundles.'
  },
  {
    icon: Terminal,
    title: 'Clean & Strict Code',
    description: 'Type-safe TypeScript, idiomatic React hooks, maintainable folder patterns, and zero bloat.'
  },
  {
    icon: Heart,
    title: 'Obsessive Learner',
    description: 'True to my alias "stilllearning"—constantly exploring new WebGL techniques, shaders, and web standards.'
  }
];

export const About: React.FC<AboutProps> = ({ theme: _theme }) => {
  return (
    <section id="about" className="section-container about-section">
      <div className="section-header text-center">
        <div className="section-tag">
          <Sparkles size={14} />
          <span>ABOUT THE DEVELOPER</span>
        </div>
        <h2 className="section-title">
          BRIDGING CREATIVE ART <br />
          <span className="text-gradient">AND RIGOROUS CODE</span>
        </h2>
        <p className="section-subtitle">
          Passionate about crafting websites that make an immediate visual statement without compromising on speed or accessibility.
        </p>
      </div>

      <div className="about-grid">
        {/* Left Column: Profile Card with Holographic Elements */}
        <div className="about-profile-card interactive-card">
          <div className="profile-image-wrapper">
            <img
              src="/profile.jpg"
              alt={`${PERSONAL_INFO.name} - Frontend Developer`}
              className="profile-img"
              loading="lazy"
            />
            <div className="profile-scanline" />
            <div className="profile-corner top-left" />
            <div className="profile-corner top-right" />
            <div className="profile-corner bottom-left" />
            <div className="profile-corner bottom-right" />
          </div>

          <div className="profile-details">
            <div className="profile-status-bar">
              <span className="live-dot" />
              <span className="status-label">BASED IN {PERSONAL_INFO.location.toUpperCase()}</span>
            </div>
            <h3 className="profile-name">{PERSONAL_INFO.fullName}</h3>
            <p className="profile-role">{PERSONAL_INFO.role}</p>

            <div className="profile-badges">
              <span className="badge">Frontend Engineer</span>
              <span className="badge">Performance &amp; UI</span>
              <span className="badge">UI/UX Craftsman</span>
            </div>

            <div className="profile-divider" />

            <div className="profile-quick-stats">
              <div className="q-stat">
                <span className="q-val">3+</span>
                <span className="q-lbl">Years Code</span>
              </div>
              <div className="q-stat">
                <span className="q-val">100%</span>
                <span className="q-lbl">Commitment</span>
              </div>
              <div className="q-stat">
                <span className="q-val">Remote</span>
                <span className="q-lbl">Worldwide</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Narrative & Engineering Philosophy */}
        <div className="about-narrative">
          <div className="narrative-text">
            {PERSONAL_INFO.bioExtended.map((paragraph, idx) => (
              <p key={idx} className="bio-paragraph">
                {paragraph}
              </p>
            ))}
          </div>

          <h4 className="principles-title">
            <CheckCircle2 size={18} className="text-accent" />
            <span>Core Engineering Principles</span>
          </h4>

          <div className="principles-grid">
            {PRINCIPLES.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="principle-card interactive-card"
                  onMouseEnter={() => sounds.playHover()}
                >
                  <div className="principle-icon-box">
                    <Icon size={20} />
                  </div>
                  <h5 className="principle-name">{item.title}</h5>
                  <p className="principle-desc">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
