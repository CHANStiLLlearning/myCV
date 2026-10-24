import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { PERSONAL_INFO, SOCIAL_LINKS } from '../data/portfolioData';
import type { SceneTheme } from '../types';
import { sounds } from '../utils/soundEffects';
import { GithubIcon, LinkedinIcon } from './icons';
import {
  Sparkles,
  Send,
  Mail,
  Copy,
  Check,
  MapPin,
  ArrowRight
} from 'lucide-react';

interface ContactProps {
  theme: SceneTheme;
}

interface FormState {
  name: string;
  email: string;
  subject: string;
  budget: string;
  message: string;
}

export const Contact: React.FC<ContactProps> = ({ theme: _theme }) => {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    subject: '3D Web Experience',
    budget: '$1k - $3k',
    message: '',
  });

  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);

  const validate = (): boolean => {
    const newErrors: Partial<FormState> = {};
    if (!form.name.trim()) newErrors.name = 'Please provide your name';
    if (!form.email.trim()) {
      newErrors.email = 'Please provide your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please provide a valid email format';
    }
    if (!form.message.trim() || form.message.length < 10) {
      newErrors.message = 'Please share a brief message (minimum 10 characters)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      sounds.playClick();
      return;
    }

    sounds.playSuccess();
    setIsSubmitted(true);

    // Fire celebratory confetti burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#00f0ff', '#6366f1', '#a855f7', '#34d399', '#ffffff'],
    });
  };

  const copyEmailToClipboard = () => {
    sounds.playClick();
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const generateMailto = () => {
    const sub = encodeURIComponent(`[Inquiry] ${form.subject} from ${form.name}`);
    const body = encodeURIComponent(
      `Hi Chan,\n\n${form.message}\n\nBudget: ${form.budget}\nFrom: ${form.name} (${form.email})`
    );
    return `mailto:${PERSONAL_INFO.email}?subject=${sub}&body=${body}`;
  };

  return (
    <section id="contact" className="section-container contact-section">
      <div className="section-header text-center">
        <div className="section-tag">
          <Sparkles size={14} />
          <span>START A CONVERSATION</span>
        </div>
        <h2 className="section-title">
          HAVE A PROJECT IN MIND? <br />
          <span className="text-gradient">LET’S BUILD TOGETHER</span>
        </h2>
        <p className="section-subtitle">
          Whether you need a high-impact 3D website, a custom frontend web app, or frontend consulting—reach out below.
        </p>
      </div>

      <div className="contact-grid">
        {/* Left Column: Direct Channels & Information */}
        <div className="contact-info-panel interactive-card">
          <div className="info-header">
            <h3 className="info-title">Contact Channels</h3>
            <p className="info-desc">
              Currently accepting freelance opportunities, agency contracts, and full-time remote engineering roles.
            </p>
          </div>

          <div className="direct-channels-list">
            {/* Email Card with Copy Button */}
            <div className="channel-card">
              <div className="channel-icon-box">
                <Mail size={18} />
              </div>
              <div className="channel-meta">
                <span className="channel-label">Email Address</span>
                <span className="channel-value">{PERSONAL_INFO.email}</span>
              </div>
              <button
                type="button"
                className="channel-copy-btn"
                onClick={copyEmailToClipboard}
                title="Copy Email to Clipboard"
                aria-label="Copy Email"
              >
                {copiedEmail ? <Check size={16} className="text-emerald" /> : <Copy size={16} />}
              </button>
            </div>

            {/* Telegram Channel */}
            <a
              href={`https://t.me/${PERSONAL_INFO.telegram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="channel-card linkable"
              onClick={() => sounds.playClick()}
            >
              <div className="channel-icon-box telegram">
                <Send size={18} />
              </div>
              <div className="channel-meta">
                <span className="channel-label">Telegram Direct</span>
                <span className="channel-value">{PERSONAL_INFO.telegram}</span>
              </div>
              <ArrowRight size={16} className="channel-arrow" />
            </a>

            {/* Location & Timezone Card */}
            <div className="channel-card">
              <div className="channel-icon-box location">
                <MapPin size={18} />
              </div>
              <div className="channel-meta">
                <span className="channel-label">Current Location</span>
                <span className="channel-value">{PERSONAL_INFO.location}</span>
                <span className="channel-sub">UTC+7 Timezone</span>
              </div>
            </div>
          </div>

          {/* Social Profiles Grid */}
          <div className="social-links-footer">
            <span className="social-title">Find Me Online</span>
            <div className="social-chips-row">
              {SOCIAL_LINKS.map((soc) => (
                <a
                  key={soc.platform}
                  href={soc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-chip-btn"
                  onMouseEnter={() => sounds.playHover()}
                  onClick={() => sounds.playClick()}
                  title={`${soc.platform} (${soc.handle})`}
                >
                  {soc.platform === 'GitHub' && <GithubIcon size={15} />}
                  {soc.platform === 'LinkedIn' && <LinkedinIcon size={15} />}
                  {soc.platform === 'Telegram' && <Send size={15} />}
                  {soc.platform === 'Email' && <Mail size={15} />}
                  <span>{soc.platform}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Contact Form */}
        <div className="contact-form-panel interactive-card">
          {isSubmitted ? (
            <div className="form-success-state">
              <div className="success-badge-icon">
                <Check size={36} />
              </div>
              <h3 className="success-title">Message Prepared!</h3>
              <p className="success-msg">
                Thank you, <strong>{form.name}</strong>. Because no external email server is configured, click below to open your preferred mail client with your pre-filled inquiry, or connect with Chan directly on Telegram.
              </p>

              <div className="success-actions">
                <a
                  href={generateMailto()}
                  className="btn btn-primary"
                  onClick={() => sounds.playClick()}
                >
                  <Send size={16} />
                  <span>Open in Mail Client</span>
                </a>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    sounds.playClick();
                    setIsSubmitted(false);
                    setForm({
                      name: '',
                      email: '',
                      subject: '3D Web Experience',
                      budget: '$1k - $3k',
                      message: '',
                    });
                  }}
                >
                  <span>Send Another Message</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form" noValidate>
              <div className="form-row">
                {/* Name */}
                <div className="form-group">
                  <label htmlFor="contact-name" className="form-label">
                    Your Name <span className="req">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    className={`form-input ${errors.name ? 'input-error' : ''}`}
                    placeholder="e.g. Alex Morgan"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  {errors.name && <span className="field-err">{errors.name}</span>}
                </div>

                {/* Email */}
                <div className="form-group">
                  <label htmlFor="contact-email" className="form-label">
                    Email Address <span className="req">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    className={`form-input ${errors.email ? 'input-error' : ''}`}
                    placeholder="alex@company.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                  {errors.email && <span className="field-err">{errors.email}</span>}
                </div>
              </div>

              <div className="form-row">
                {/* Subject Selector */}
                <div className="form-group">
                  <label htmlFor="contact-subject" className="form-label">
                    Project Focus
                  </label>
                  <select
                    id="contact-subject"
                    className="form-input form-select"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  >
                    <option value="3D Web Experience">3D Web Experience / Three.js</option>
                    <option value="Full Frontend Application">Full Frontend Application</option>
                    <option value="Design System & UI/UX">Design System &amp; UI/UX</option>
                    <option value="Performance Optimization">Performance &amp; Core Web Vitals</option>
                    <option value="Full-time Job Opportunity">Full-time Job Opportunity</option>
                  </select>
                </div>

                {/* Budget Range */}
                <div className="form-group">
                  <label htmlFor="contact-budget" className="form-label">
                    Estimated Budget
                  </label>
                  <select
                    id="contact-budget"
                    className="form-input form-select"
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: e.target.value })}
                  >
                    <option value="< $1,000">&lt; $1,000 USD</option>
                    <option value="$1,000 - $3,000">$1,000 — $3,000 USD</option>
                    <option value="$3,000 - $7,000">$3,000 — $7,000 USD</option>
                    <option value="$7,000+">$7,000+ USD</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div className="form-group">
                <label htmlFor="contact-message" className="form-label">
                  Project Details <span className="req">*</span>
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  className={`form-input form-textarea ${errors.message ? 'input-error' : ''}`}
                  placeholder="Tell me about your vision, timeline, and goals..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
                {errors.message && <span className="field-err">{errors.message}</span>}
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                id="submit-contact-btn"
                className="btn btn-primary w-full"
                onMouseEnter={() => sounds.playHover()}
              >
                <Send size={16} />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
