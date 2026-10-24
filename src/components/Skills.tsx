import React, { useState, useEffect } from 'react';
import { SKILL_CATEGORIES } from '../data/portfolioData';
import type { SceneTheme, SkillCategory } from '../types';
import { SkillsRadarCard } from './SkillsRadarCard';
import { sounds } from '../utils/soundEffects';
import { Code2, Boxes, Cpu, Sparkles, Flame } from 'lucide-react';
import { portfolioApi } from '../services/api';

interface SkillsProps {
  theme: SceneTheme;
}

export const Skills: React.FC<SkillsProps> = ({ theme }) => {
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>(SKILL_CATEGORIES);
  const [selectedCatId, setSelectedCatId] = useState<string>('all');
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number>(0);

  useEffect(() => {
    let mounted = true;
    portfolioApi.getSkills()
      .then((data) => {
        if (mounted && Array.isArray(data) && data.length > 0) {
          setSkillCategories(data);
        }
      })
      .catch((err) => {
        console.warn('Could not load dynamic skills from backend, using static data:', err);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code2':
        return <Code2 size={18} />;
      case 'Boxes':
        return <Boxes size={18} />;
      case 'Cpu':
      default:
        return <Cpu size={18} />;
    }
  };

  const handleTabChange = (catId: string, idx: number) => {
    sounds.playClick();
    setSelectedCatId(catId);
    setActiveCategoryIndex(idx);
  };

  const displayedCategories =
    selectedCatId === 'all'
      ? skillCategories
      : skillCategories.filter((c) => c.id === selectedCatId);

  return (
    <section id="skills" className="section-container skills-section">
      <div className="section-header text-center">
        <div className="section-tag">
          <Sparkles size={14} />
          <span>TECHNICAL ARSENAL</span>
        </div>
        <h2 className="section-title">
          MODERN SKILLS &amp; <br />
          <span className="text-gradient">ENGINEERING CRAFT</span>
        </h2>
        <p className="section-subtitle">
          Specialized in high-fidelity user interfaces, modern component architectures, and responsive 60fps web applications.
        </p>
      </div>

      {/* Category Filter Pills & Interactive 3D Visualizer */}
      <div className="skills-interactive-layout">
        <div className="skills-left-content">
          <div className="skills-tabs" role="tablist" aria-label="Skills Filter">
            <button
              type="button"
              className={`skills-tab-btn ${selectedCatId === 'all' ? 'active' : ''}`}
              onClick={() => handleTabChange('all', 0)}
              onMouseEnter={() => sounds.playHover()}
            >
              <Sparkles size={16} />
              <span>All Skills</span>
            </button>

            {skillCategories.map((cat, idx) => (
              <button
                key={cat.id}
                type="button"
                className={`skills-tab-btn ${selectedCatId === cat.id ? 'active' : ''}`}
                onClick={() => handleTabChange(cat.id, idx + 1)}
                onMouseEnter={() => sounds.playHover()}
              >
                {getCategoryIcon(cat.icon)}
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          {/* Render Categories and Skill Cards */}
          <div className="skills-categories-wrapper">
            {displayedCategories.map((category) => (
              <div key={category.id} className="skill-category-block">
                <div className="category-header">
                  <div className="cat-icon-badge">{getCategoryIcon(category.icon)}</div>
                  <h3 className="category-title">{category.name}</h3>
                  <span className="category-count">{category.skills.length} Technologies</span>
                </div>

                <div className="skills-grid">
                  {category.skills.map((skill, sIdx) => (
                    <div
                      key={sIdx}
                      className={`skill-card interactive-card ${skill.highlight ? 'featured' : ''}`}
                      onMouseEnter={() => sounds.playHover()}
                    >
                      <div className="skill-card-top">
                        <div className="skill-name-wrap">
                          <span className="skill-name">{skill.name}</span>
                          {skill.highlight && (
                            <span className="skill-hot-badge" title="Core Specialization">
                              <Flame size={12} />
                              <span>Core</span>
                            </span>
                          )}
                        </div>
                        <span className="skill-exp">{skill.experience}</span>
                      </div>

                      {/* Visual Proficiency Bar */}
                      <div className="skill-progress-bar">
                        <div
                          className="skill-progress-fill"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>

                      <div className="skill-card-footer">
                        <span className="level-label">Proficiency</span>
                        <span className="level-val">{skill.level}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side: Interactive Domain Architecture & Radar Metric Card */}
        <div className="skills-visual-aside">
          <SkillsRadarCard theme={theme} activeCategoryIndex={activeCategoryIndex} />
        </div>
      </div>
    </section>
  );
};
