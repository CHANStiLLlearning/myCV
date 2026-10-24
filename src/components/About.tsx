import React from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import type { SceneTheme } from '../types';
import { Sparkles } from 'lucide-react';

interface AboutProps {
  theme: SceneTheme;
}

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

        {/* Right Column: Narrative */}
        <div className="about-narrative">
          <div className="narrative-text">
            {PERSONAL_INFO.bioExtended.map((paragraph, idx) => (
              <p key={idx} className="bio-paragraph">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

