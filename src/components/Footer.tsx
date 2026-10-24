import React, { useState, useEffect } from 'react';
import { PERSONAL_INFO, SOCIAL_LINKS } from '../data/portfolioData';
import { sounds } from '../utils/soundEffects';
import { GithubIcon, LinkedinIcon } from './icons';
import { ArrowUp, Terminal, Clock, Send, Mail } from 'lucide-react';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const [localTime, setLocalTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatted = new Intl.DateTimeFormat('en-US', {
          timeZone: PERSONAL_INFO.timezone,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }).format(now);
        setLocalTime(formatted);
      } catch {
        setLocalTime('UTC+7');
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    sounds.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* Brand & Mission */}
        <div className="footer-top-row">
          <div className="footer-brand">
            <div className="brand-logo footer-logo">
              <div className="logo-badge">
                <Terminal size={16} />
              </div>
              <span className="brand-name">{PERSONAL_INFO.name}</span>
            </div>
            <p className="footer-bio">
              Creative Frontend Developer based in {PERSONAL_INFO.location}. Specialized in high-performance WebGL, React architectures, and immersive interactive design.
            </p>
          </div>

          {/* Local Time in Phnom Penh */}
          <div className="footer-time-card interactive-card">
            <div className="time-header">
              <Clock size={14} className="text-accent" />
              <span>PHNOM PENH (LOCAL TIME)</span>
            </div>
            <div className="time-digits">{localTime || '14:15:00 PM'}</div>
            <span className="time-zone-label">Indochina Time (ICT, UTC+7)</span>
          </div>
        </div>

        <div className="footer-divider" />

        {/* Bottom Bar: Copyright, Socials, Back to Top */}
        <div className="footer-bottom-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <p className="copyright-text" style={{ margin: 0 }}>
              © {new Date().getFullYear()} {PERSONAL_INFO.fullName}. Crafted with React, Express &amp; TypeScript.
            </p>
            {onOpenAdmin && (
              <button
                type="button"
                id="admin-portal-footer-btn"
                onClick={() => {
                  sounds.playClick();
                  onOpenAdmin();
                }}
                className="admin-link-btn"
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: 'var(--text-muted)',
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  transition: 'all 0.2s ease'
                }}
                title="Open Portfolio CMS & Inquiries Portal"
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--accent-cyan)';
                  e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-muted)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                }}
              >
                <Terminal size={11} />
                <span>CMS Admin</span>
              </button>
            )}
          </div>

          <div className="footer-social-icons">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.platform}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-soc-link"
                onMouseEnter={() => sounds.playHover()}
                onClick={() => sounds.playClick()}
                title={s.platform}
                aria-label={s.platform}
              >
                {s.platform === 'GitHub' && <GithubIcon size={16} />}
                {s.platform === 'LinkedIn' && <LinkedinIcon size={16} />}
                {s.platform === 'Telegram' && <Send size={16} />}
                {s.platform === 'Email' && <Mail size={16} />}
              </a>
            ))}
          </div>

          <button
            type="button"
            id="back-to-top-btn"
            className="back-to-top-button"
            onClick={scrollToTop}
            onMouseEnter={() => sounds.playHover()}
            title="Back to Top"
            aria-label="Back to top"
          >
            <span>Back to Top</span>
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
};
