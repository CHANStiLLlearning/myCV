import React from 'react';
import { TIMELINE_DATA } from '../data/portfolioData';
import type { SceneTheme } from '../types';
import { sounds } from '../utils/soundEffects';
import { Sparkles, Calendar, MapPin } from 'lucide-react';

interface ExperienceProps {
  theme: SceneTheme;
}

export const Experience: React.FC<ExperienceProps> = ({ theme: _theme }) => {
  return (
    <section id="experience" className="section-container experience-section">
      <div className="section-header text-center">
        <div className="section-tag">
          <Sparkles size={14} />
          <span>CAREER &amp; GROWTH</span>
        </div>
        <h2 className="section-title">
          EXPERIENCE &amp; <br />
          <span className="text-gradient">LEARNING MILESTONES</span>
        </h2>
        <p className="section-subtitle">
          A progression of dedicated web development, client challenges, and ongoing exploration of 3D technologies.
        </p>
      </div>

      <div className="timeline-container">
        <div className="timeline-line-glow" />

        <div className="timeline-milestones-list">
          {TIMELINE_DATA.map((milestone, idx) => (
            <div
              key={idx}
              className={`timeline-item ${idx % 2 === 0 ? 'left' : 'right'}`}
              onMouseEnter={() => sounds.playHover()}
            >
              {/* Checkpoint Node */}
              <div className="timeline-dot-wrapper">
                <div className="timeline-dot-ring">
                  <span className="timeline-dot-core" />
                </div>
              </div>

              {/* Milestone Card */}
              <div className="timeline-card interactive-card">
                <div className="milestone-badge-row">
                  <span className="milestone-year">
                    <Calendar size={13} />
                    <span>{milestone.year}</span>
                  </span>
                  <span className="milestone-location">
                    <MapPin size={12} />
                    <span>{milestone.location}</span>
                  </span>
                </div>

                <h3 className="milestone-role">{milestone.role}</h3>
                <h4 className="milestone-org">{milestone.organization}</h4>

                <p className="milestone-desc">{milestone.description}</p>

                <div className="milestone-tags">
                  {milestone.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="milestone-tag-pill">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
