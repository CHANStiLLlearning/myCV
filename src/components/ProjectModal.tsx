import React, { useEffect } from 'react';
import type { Project } from '../types';
import { sounds } from '../utils/soundEffects';
import { GithubIcon } from './icons';
import { X, ExternalLink, CheckCircle } from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        sounds.playClick();
        onClose();
      }
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-container interactive-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Close Button */}
        <button
          type="button"
          className="modal-close-btn"
          onClick={() => {
            sounds.playClick();
            onClose();
          }}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Modal Image Hero */}
        <div className="modal-image-hero">
          <img src={project.image} alt={project.title} className="modal-img" />
          <div className="modal-img-overlay" />
          <div className="modal-category-badge">{project.category}</div>
        </div>

        {/* Modal Content */}
        <div className="modal-body">
          <div className="modal-header-info">
            <h3 className="modal-title">{project.title}</h3>
            <p className="modal-tagline">{project.tagline}</p>
          </div>

          <p className="modal-description">{project.description}</p>

          {/* Performance Metrics */}
          {project.metrics && project.metrics.length > 0 && (
            <div className="modal-metrics-grid">
              {project.metrics.map((m, idx) => (
                <div key={idx} className="modal-metric-card">
                  <span className="m-val">{m.value}</span>
                  <span className="m-lbl">{m.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Architecture Highlights */}
          {project.highlights && project.highlights.length > 0 && (
            <div className="modal-highlights-section">
              <h4 className="highlights-title">
                <CheckCircle size={16} className="text-accent" />
                <span>Architecture &amp; Features</span>
              </h4>
              <ul className="highlights-list">
                {project.highlights.map((item, idx) => (
                  <li key={idx} className="highlight-item">
                    <span className="item-bullet">▹</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tech Stack Pills */}
          <div className="modal-tags-wrap">
            {project.tags.map((tag, idx) => (
              <span key={idx} className="badge">
                {tag}
              </span>
            ))}
          </div>

          {/* Modal Action Links */}
          <div className="modal-actions-row">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              onClick={() => sounds.playClick()}
            >
              <ExternalLink size={16} />
              <span>Launch Live Preview</span>
            </a>

            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
              onClick={() => sounds.playClick()}
            >
              <GithubIcon size={16} />
              <span>Inspect Source Code</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
