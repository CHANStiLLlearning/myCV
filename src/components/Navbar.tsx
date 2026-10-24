import React, { useState, useEffect } from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import type { SceneTheme } from '../types';
import { sounds } from '../utils/soundEffects';
import { Volume2, VolumeX, Menu, X, Sparkles, Terminal } from 'lucide-react';

interface NavbarProps {
  currentTheme: SceneTheme;
  onThemeChange: (theme: SceneTheme) => void;
}

const NAV_LINKS = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
];

export const Navbar: React.FC<NavbarProps> = ({ currentTheme, onThemeChange }) => {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(sounds.getMuted());

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      const sections = NAV_LINKS.map((link) => link.href.substring(1));
      const scrollPos = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = document.getElementById(sections[i]);
        if (sec && sec.offsetTop <= scrollPos) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    sounds.playClick();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleSound = () => {
    const newMuted = sounds.toggleMute();
    setIsMuted(newMuted);
  };

  const cycleTheme = () => {
    sounds.playClick();
    const themes: SceneTheme[] = ['cyan', 'violet', 'emerald', 'amber'];
    const nextIdx = (themes.indexOf(currentTheme) + 1) % themes.length;
    onThemeChange(themes[nextIdx]);
  };

  return (
    <header className={`navbar-header ${isScrolled ? 'scrolled' : ''}`}>
      <nav className="navbar-container" aria-label="Main Navigation">
        {/* Brand Logo with Pulsing Status */}
        <a
          href="#hero"
          className="brand-logo"
          onClick={(e) => handleLinkClick(e, '#hero')}
          onMouseEnter={() => sounds.playHover()}
        >
          <div className="logo-badge">
            <Terminal size={18} className="logo-icon" />
          </div>
          <div className="brand-text">
            <span className="brand-name">{PERSONAL_INFO.name}</span>
            <span className="brand-status">
              <span className="status-dot"></span>
              <span className="status-text">Available</span>
            </span>
          </div>
        </a>

        {/* Desktop Nav Items */}
        <ul className="nav-links-desktop">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  onMouseEnter={() => sounds.playHover()}
                >
                  {link.label}
                  {isActive && <span className="active-glow-pill" />}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Right Side Actions: Theme switcher, Audio toggle, Talk CTA */}
        <div className="nav-actions">
          {/* Quick theme cycle pill */}
          <button
            type="button"
            className="nav-action-btn"
            onClick={cycleTheme}
            title={`Active Theme: ${currentTheme.toUpperCase()} (Click to cycle)`}
            aria-label="Cycle visual theme"
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor:
                  currentTheme === 'cyan'
                    ? '#00f0ff'
                    : currentTheme === 'violet'
                    ? '#a855f7'
                    : currentTheme === 'emerald'
                    ? '#10b981'
                    : '#f59e0b',
                display: 'inline-block',
                boxShadow: '0 0 8px currentColor',
              }}
            />
          </button>

          {/* Sound FX Switch */}
          <button
            type="button"
            id="audio-toggle-btn"
            className={`nav-action-btn ${!isMuted ? 'active-audio' : ''}`}
            onClick={toggleSound}
            title={isMuted ? 'Turn Sound FX On (Web Audio)' : 'Mute Sound FX'}
            aria-label="Toggle sound effects"
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} className="audio-anim" />}
          </button>

          {/* Direct CTA */}
          <a
            href="#contact"
            id="nav-cta-btn"
            className="nav-cta-button"
            onClick={(e) => handleLinkClick(e, '#contact')}
            onMouseEnter={() => sounds.playHover()}
          >
            <Sparkles size={14} />
            <span>Let's Talk</span>
          </a>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            id="mobile-menu-toggle"
            className="mobile-hamburger-btn"
            onClick={() => {
              sounds.playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div className={`mobile-menu-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-content">
          <ul className="mobile-nav-links">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`mobile-nav-link ${activeSection === link.href.substring(1) ? 'active' : ''}`}
                  onClick={(e) => handleLinkClick(e, link.href)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="mobile-drawer-footer">
            <div className="mobile-location-tag">
              <span>📍 {PERSONAL_INFO.location}</span>
            </div>
            <a
              href="#contact"
              className="btn btn-primary w-full"
              onClick={(e) => handleLinkClick(e, '#contact')}
            >
              Get In Touch
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
