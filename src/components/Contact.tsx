import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { PERSONAL_INFO, SOCIAL_LINKS } from '../data/portfolioData';
import type { SceneTheme } from '../types';
import { sounds } from '../utils/soundEffects';
import { GithubIcon, LinkedinIcon } from './icons';
import { Sparkles, Send, Mail, Copy, Check, MapPin, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { portfolioApi } from '../services/api';

interface ContactProps {
  theme: SceneTheme;
}

interface FormState {
  name: string;
  email: string;
}

export const Contact: React.FC<ContactProps> = ({ theme: _theme }) => {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
  });

  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [inquiryId, setInquiryId] = useState<string>('');
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);

  const validate = (): boolean => {
    const newErrors: Partial<FormState> = {};
    if (!form.name.trim()) newErrors.name = 'Please provide your name';
    if (!form.email.trim()) {
      newErrors.email = 'Please provide your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please provide a valid email format';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      sounds.playClick();
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await portfolioApi.sendContact({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: 'General Connection',
        budget: 'N/A',
        message: `Direct connection request from ${form.name.trim()} (${form.email.trim()}).`,
      });

      setInquiryId(res.inquiryId || `INQ-${Date.now().toString().slice(-6)}`);
      sounds.playSuccess();
      setIsSubmitted(true);

      // Fire celebratory confetti burst
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#00f0ff', '#6366f1', '#a855f7', '#34d399', '#ffffff'],
      });
    } catch (err: any) {
      console.error('Failed to submit inquiry:', err);
      setSubmitError(err.message || 'Unable to deliver your message right now. Please try again or email directly.');
      sounds.playClick();
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyEmailToClipboard = () => {
    sounds.playClick();
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const generateMailto = () => {
    const sub = encodeURIComponent(`[Inquiry] Connection from ${form.name}`);
    const body = encodeURIComponent(
      `Hi KEO KIMCHAN,\n\nI would like to get in touch with you regarding your frontend engineering work.\n\nFrom: ${form.name} (${form.email})`
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
              <h3 className="success-title">Message Delivered!</h3>
              <p className="success-msg">
                Thank you, <strong>{form.name}</strong>! Your inquiry has been securely saved to Chan's portfolio inbox with Reference{' '}
                <strong style={{ color: 'var(--accent-cyan)' }}>#{inquiryId}</strong>. Chan usually reviews and responds within 24 hours.
              </p>

              <div className="success-actions">
                <a
                  href={generateMailto()}
                  className="btn btn-secondary"
                  onClick={() => sounds.playClick()}
                >
                  <Mail size={16} />
                  <span>Also Open Mail App</span>
                </a>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    sounds.playClick();
                    setIsSubmitted(false);
                    setSubmitError(null);
                    setForm({
                      name: '',
                      email: '',
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

              {/* Error banner if submission failed */}
              {submitError && (
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  color: '#fca5a5',
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '1rem'
                }}>
                  <AlertCircle size={18} style={{ flexShrink: 0, color: '#ef4444' }} />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                id="submit-contact-btn"
                className="btn btn-primary w-full"
                disabled={isSubmitting}
                style={isSubmitting ? { opacity: 0.7, cursor: 'not-allowed' } : undefined}
                onMouseEnter={() => !isSubmitting && sounds.playHover()}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Sending to Portfolio Inbox...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
