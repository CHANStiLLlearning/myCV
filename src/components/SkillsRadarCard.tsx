import React from 'react';
import { SKILL_CATEGORIES } from '../data/portfolioData';
import { Layers, ShieldCheck, Zap, Gauge } from 'lucide-react';

interface SkillsRadarCardProps {
  theme: string;
  activeCategoryIndex: number;
}

export const SkillsRadarCard: React.FC<SkillsRadarCardProps> = ({ activeCategoryIndex }) => {
  const currentCategory = SKILL_CATEGORIES[activeCategoryIndex] || SKILL_CATEGORIES[0];

  // Domain breakdown metrics for each category
  const domainMetrics = [
    { label: 'Responsive Architecture', score: 98, icon: Layers },
    { label: 'Type Safety & Modularity', score: 94, icon: ShieldCheck },
    { label: 'Core Web Vitals & Speed', score: 99, icon: Gauge },
    { label: 'Interaction Polish', score: 96, icon: Zap }
  ];

  return (
    <div className="skills-canvas-card interactive-card">
      <div className="canvas-card-header">
        <div className="radar-header-top">
          <span className="card-badge">DOMAIN ARCHITECTURE</span>
          <span className="perf-tag">Pure CSS • 0% GPU</span>
        </div>
        <h4 className="radar-cat-title">{currentCategory.name}</h4>
        <p className="card-sub">{currentCategory.skills.map((s) => s.name).slice(0, 3).join(' • ')}</p>
      </div>

      {/* Lightweight SVG Radar / Diagnostic Hexagon (Zero WebGL) */}
      <div className="radar-visual-box">
        <svg viewBox="0 0 200 200" className="radar-svg" aria-hidden="true">
          {/* Concentric diagnostic rings */}
          <circle cx="100" cy="100" r="80" className="radar-grid-ring" />
          <circle cx="100" cy="100" r="55" className="radar-grid-ring" />
          <circle cx="100" cy="100" r="30" className="radar-grid-ring" />
          
          {/* Axis crosshairs */}
          <line x1="100" y1="20" x2="100" y2="180" className="radar-axis" />
          <line x1="20" y1="100" x2="180" y2="100" className="radar-axis" />

          {/* Dynamic Polygon that subtly adjusts according to category index */}
          <polygon
            points={
              activeCategoryIndex === 0
                ? "100,32 170,100 100,168 35,100"
                : activeCategoryIndex === 1
                ? "100,40 162,100 100,160 45,100"
                : "100,35 166,100 100,164 38,100"
            }
            className="radar-polygon"
          />

          {/* Glowing node vertices */}
          <circle cx="100" cy={activeCategoryIndex === 0 ? "32" : "40"} r="4" className="radar-node-vertex" />
          <circle cx={activeCategoryIndex === 0 ? "170" : "162"} cy="100" r="4" className="radar-node-vertex" />
          <circle cx="100" cy={activeCategoryIndex === 0 ? "168" : "160"} r="4" className="radar-node-vertex" />
          <circle cx={activeCategoryIndex === 0 ? "35" : "45"} cy="100" r="4" className="radar-node-vertex" />
          
          {/* Center core pulse */}
          <circle cx="100" cy="100" r="5" className="radar-center-core" />
        </svg>

        {/* Floating labels around radar */}
        <span className="radar-axis-label top">ARCHITECTURE</span>
        <span className="radar-axis-label right">SPEED</span>
        <span className="radar-axis-label bottom">UI/UX</span>
        <span className="radar-axis-label left">MODULARITY</span>
      </div>

      {/* Metrics Breakdown */}
      <div className="radar-metrics-list">
        {domainMetrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="radar-metric-item">
              <div className="m-left">
                <Icon size={14} className="m-icon" />
                <span className="m-name">{m.label}</span>
              </div>
              <div className="m-right">
                <div className="m-bar">
                  <div className="m-fill" style={{ width: `${m.score}%` }} />
                </div>
                <span className="m-val">{m.score}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="canvas-card-footer">
        <div className="legend-row">
          <span className="legend-dot active" />
          <span className="legend-text">Native CSS Hardware Acceleration</span>
        </div>
        <div className="legend-row">
          <span className="legend-dot" />
          <span className="legend-text">Zero GPU/Battery Drain</span>
        </div>
      </div>
    </div>
  );
};
