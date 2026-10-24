import React, { useEffect } from 'react';
import { PERSONAL_INFO, SKILL_CATEGORIES, TIMELINE_DATA, PROJECTS_DATA } from '../data/portfolioData';
import { sounds } from '../utils/soundEffects';
import { X, Printer, Download, MapPin, Mail, Send } from 'lucide-react';

import type { PersonalInfo } from '../services/api';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile?: PersonalInfo;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose, profile }) => {
  const info = profile || (PERSONAL_INFO as PersonalInfo);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    sounds.playClick();
    window.print();
  };

  const handleDownloadTxt = () => {
    sounds.playClick();
    const content = `=====================================================
${info.fullName.toUpperCase()} — RESUME / CV
${info.role} | 3D Web & Frontend Specialist
Location: ${info.location}
Email: ${info.email}
Telegram: ${info.telegram}
=====================================================

PROFILE SUMMARY
-----------------------------------------------------
${info.bioExtended.join('\n\n')}

CORE TECHNICAL COMPETENCIES
-----------------------------------------------------
${SKILL_CATEGORIES.map(
  (c) =>
    `• ${c.name}: ${c.skills.map((s) => `${s.name} (${s.experience}, ${s.level}%)`).join(', ')}`
).join('\n')}

SELECTED FEATURED PROJECTS
-----------------------------------------------------
${PROJECTS_DATA.map(
  (p) =>
    `• ${p.title} (${p.category})
  ${p.tagline}
  Tech Stack: ${p.tags.join(', ')}
  Highlights: ${p.highlights ? p.highlights.join('; ') : ''}
  Live Demo: ${p.liveUrl} | GitHub: ${p.githubUrl}`
).join('\n\n')}

WORK EXPERIENCE & MILESTONES
-----------------------------------------------------
${TIMELINE_DATA.map(
  (t) =>
    `• ${t.year}: ${t.role} at ${t.organization} (${t.location})
  ${t.description}
  Technologies: ${t.tags.join(', ')}`
).join('\n\n')}
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `KEO_KIMCHAN_Frontend_Resume.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="resume-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header Action Bar */}
        <div className="resume-action-bar no-print">
          <div className="action-bar-left">
            <span className="badge">Curriculum Vitae</span>
            <span className="action-hint">Print-ready or export as text</span>
          </div>

          <div className="action-bar-right">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleDownloadTxt}
              title="Download text format"
            >
              <Download size={14} />
              <span>Export .TXT</span>
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handlePrint}
              title="Print to PDF"
            >
              <Printer size={14} />
              <span>Print / PDF</span>
            </button>
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable CV Document Content */}
        <div className="resume-sheet">
          <div className="resume-header">
            <div className="resume-header-bio">
              <img
                src="/profile.jpg"
                alt={info.fullName}
                className="resume-avatar-img"
              />
              <div>
                <h1 className="resume-name">{info.fullName}</h1>
                <h2 className="resume-title">{info.role}</h2>
              </div>
            </div>
            <div className="resume-contacts">
              <div className="r-item">
                <MapPin size={13} />
                <span>{info.location}</span>
              </div>
              <div className="r-item">
                <Mail size={13} />
                <span>{info.email}</span>
              </div>
              <div className="r-item">
                <Send size={13} />
                <span>{info.telegram}</span>
              </div>
            </div>
          </div>

          <div className="resume-section">
            <h3 className="r-section-heading">Executive Summary</h3>
            {info.bioExtended.map((p, idx) => (
              <p key={idx} className="r-text">{p}</p>
            ))}
          </div>

          <div className="resume-section">
            <h3 className="r-section-heading">Technical Skills</h3>
            <div className="r-skills-grid">
              {SKILL_CATEGORIES.map((cat) => (
                <div key={cat.id} className="r-skill-group">
                  <strong className="r-cat-name">{cat.name}:</strong>{' '}
                  <span className="r-cat-list">
                    {cat.skills.map((s) => s.name).join(', ')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="resume-section">
            <h3 className="r-section-heading">Featured Projects</h3>
            <div className="r-projects-list">
              {PROJECTS_DATA.map((p) => (
                <div key={p.id} className="r-project-entry">
                  <div className="r-p-header">
                    <span className="r-p-title">{p.title}</span>
                    <span className="r-p-tags">{p.tags.slice(0, 4).join(' • ')}</span>
                  </div>
                  <p className="r-text">{p.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="resume-section">
            <h3 className="r-section-heading">Experience &amp; Milestones</h3>
            <div className="r-timeline-list">
              {TIMELINE_DATA.map((t, idx) => (
                <div key={idx} className="r-time-entry">
                  <div className="r-t-top">
                    <span className="r-t-role">
                      <strong>{t.role}</strong> — {t.organization}
                    </span>
                    <span className="r-t-year">{t.year}</span>
                  </div>
                  <p className="r-text">{t.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
