import React, { useState, useEffect } from 'react';
import { PROJECTS_DATA } from '../data/portfolioData';
import type { Project, SceneTheme } from '../types';
import { sounds } from '../utils/soundEffects';
import { GithubIcon } from './icons';
import { Sparkles, ExternalLink, Eye, ArrowUpRight, Heart } from 'lucide-react';
import { portfolioApi } from '../services/api';

interface ProjectsProps {
  theme: SceneTheme;
  onSelectProject: (project: Project) => void;
}

export const Projects: React.FC<ProjectsProps> = ({ theme: _theme, onSelectProject }) => {
  const [projects, setProjects] = useState<Project[]>(PROJECTS_DATA);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [likedProjects, setLikedProjects] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let mounted = true;
    portfolioApi.getProjects()
      .then((data) => {
        if (mounted && Array.isArray(data) && data.length > 0) {
          setProjects(data);
        }
      })
      .catch((err) => {
        console.warn('Could not load dynamic projects from backend, using static data:', err);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category)))];

  const filteredProjects =
    selectedCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  const handleLike = async (projectId: string) => {
    sounds.playClick();
    const wasLiked = !!likedProjects[projectId];
    setLikedProjects((prev) => ({ ...prev, [projectId]: !wasLiked }));

    // Optimistic update
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          return { ...p, likes: (p.likes || 0) + (wasLiked ? -1 : 1) };
        }
        return p;
      })
    );

    try {
      const res = await portfolioApi.likeProject(projectId);
      if (res && typeof res.likes === 'number') {
        setProjects((prev) =>
          prev.map((p) => (p.id === projectId ? { ...p, likes: res.likes } : p))
        );
      }
    } catch (err) {
      console.warn('Failed to persist project like to server:', err);
    }
  };

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
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    className="project-like-badge"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(project.id);
                    }}
                    title="Like this project"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: likedProjects[project.id] ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${likedProjects[project.id] ? 'rgba(239, 68, 68, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
                      borderRadius: '16px',
                      padding: '4px 9px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: likedProjects[project.id] ? '#ef4444' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  >
                    <Heart
                      size={13}
                      fill={likedProjects[project.id] ? '#ef4444' : 'none'}
                      color={likedProjects[project.id] ? '#ef4444' : 'currentColor'}
                    />
                    <span>{project.likes ?? 0}</span>
                  </button>

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
