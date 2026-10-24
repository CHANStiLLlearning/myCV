import React from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import type { SceneTheme } from '../types';
import { Sparkles } from 'lucide-react';

import type { PersonalInfo } from '../services/api';

interface AboutProps {
  theme: SceneTheme;
  profile?: PersonalInfo;
}

export const About: React.FC<AboutProps> = ({ theme: _theme, profile }) => {
  const info = profile || (PERSONAL_INFO as PersonalInfo);

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
              alt={`${info.name} - Frontend Developer`}
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
              <span className="status-label">BASED IN {info.location.toUpperCase()}</span>
            </div>
            <h3 className="profile-name">{info.fullName}</h3>
            <p className="profile-role">{info.role}</p>

            <div className="profile-badges">
              <span className="badge">Frontend Engineer</span>
              <span className="badge">Performance &amp; UI</span>
              <span className="badge">{info.focus}</span>
            </div>

            <div className="profile-divider" />

            <div className="profile-quick-stats">
              {info.stats && info.stats.length > 0 ? (
                info.stats.slice(0, 3).map((st, i) => (
                  <div key={i} className="q-stat">
                    <span className="q-val">{st.value}</span>
                    <span className="q-lbl">{st.label}</span>
                  </div>
                ))
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Narrative */}
        <div className="about-narrative">
          <div className="narrative-text">
            {info.bioExtended.map((paragraph, idx) => (
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

