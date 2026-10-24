import React, { useState } from 'react';
import { PROJECTS_DATA } from '../data/portfolioData';
import type { Project, SceneTheme } from '../types';
import { sounds } from '../utils/soundEffects';
import { GithubIcon } from './icons';
import { Sparkles, ExternalLink, Eye, ArrowUpRight } from 'lucide-react';

interface ProjectsProps {
  theme: SceneTheme;
  onSelectProject: (project: Project) => void;
}

export const Projects: React.FC<ProjectsProps> = ({ theme: _theme, onSelectProject }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', '3D & WebGL', 'AI & Web Apps', 'Fintech & Dashboards', 'Cultural Heritage'];

  const filteredProjects =
    selectedCategory === 'All'
      ? PROJECTS_DATA
      : PROJECTS_DATA.filter((p) => p.category === selectedCategory);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
  };

  return (
    <section id="projects" className="section-container projects-section">
      <div className="section-header text-center">
        <div className="section-tag">
          <Sparkles size={14} />
          <span>FEATURED WORK</span>
        </div>
        <h2 className="section-title">
          SELECTED <br />
          <span className="text-gradient">3D &amp; WEB APPLICATIONS</span>
        </h2>
        <p className="section-subtitle">
          Engineered with performance, 3D spatial fidelity, and intuitive design. Hover over cards for 3D tilt.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="projects-filter-bar">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => {
              sounds.playClick();
              setSelectedCategory(cat);
            }}
            onMouseEnter={() => sounds.playHover()}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Projects Showcase Grid */}
      <div className="projects-grid">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="project-card interactive-card"
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            onMouseEnter={() => sounds.playHover()}
          >
            {/* Card Image Thumbnail */}
            <div className="project-thumbnail-wrapper">
              <img
                src={project.image}
                alt={project.title}
                className="project-thumb-img"
                loading="lazy"
              />
              <div className="thumb-gradient-overlay" />
              <div className="project-category-tag">{project.category}</div>

              {/* Quick View Button on Hover */}
              <button
                type="button"
                className="quick-view-btn"
                onClick={() => {
                  sounds.playClick();
                  onSelectProject(project);
                }}
                aria-label={`View details of ${project.title}`}
              >
                <Eye size={16} />
                <span>Deep Dive</span>
              </button>
            </div>

            {/* Card Body */}
            <div className="project-card-body">
              <div className="card-header-row">
                <h3 className="project-card-title">{project.title}</h3>
                <button
                  type="button"
                  className="quick-inspect-icon"
                  onClick={() => {
                    sounds.playClick();
                    onSelectProject(project);
                  }}
                  title="Inspect Architecture"
                >
                  <ArrowUpRight size={18} />
                </button>
              </div>

              <p className="project-card-tagline">{project.tagline}</p>
              <p className="project-card-desc">{project.description}</p>

              {/* Metrics preview */}
              {project.metrics && project.metrics.length > 0 && (
                <div className="project-card-metrics">
                  {project.metrics.slice(0, 2).map((m, idx) => (
                    <div key={idx} className="card-m-chip">
                      <span className="chip-val">{m.value}</span>
                      <span className="chip-lbl">{m.label}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Technologies */}
              <div className="project-tech-tags">
                {project.tags.map((tag, idx) => (
                  <span key={idx} className="tech-badge">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action Links */}
              <div className="project-card-actions">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-action-link primary"
                  onClick={() => sounds.playClick()}
                >
                  <ExternalLink size={14} />
                  <span>Live Demo</span>
                </a>

                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-action-link secondary"
                  onClick={() => sounds.playClick()}
                >
                  <GithubIcon size={14} />
                  <span>Source</span>
                </a>

                <button
                  type="button"
                  className="card-action-link ghost"
                  onClick={() => {
                    sounds.playClick();
                    onSelectProject(project);
                  }}
                >
                  <span>Details</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
