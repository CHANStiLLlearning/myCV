import React, { useState, useEffect } from 'react';
import { portfolioApi, type ContactMessageRecord, type SiteStats } from '../services/api';
import type { Project } from '../types';
import { sounds } from '../utils/soundEffects';
import {
  X,
  Lock,
  Unlock,
  Mail,
  FolderGit2,
  BarChart3,
  CheckCircle2,
  Clock,
  ExternalLink,
  Plus,
  Trash2,
  RefreshCw,
  Send,
  KeyRound,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const [adminKey, setAdminKey] = useState<string>(() => localStorage.getItem('chan_portfolio_admin_key') || '');
  const [keyInput, setKeyInput] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'messages' | 'projects' | 'analytics'>('messages');
  const [messages, setMessages] = useState<ContactMessageRecord[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<SiteStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessageRecord | null>(null);

  // New Project Form Modal / Drawer State
  const [isAddingProject, setIsAddingProject] = useState<boolean>(false);
  const [newProject, setNewProject] = useState({
    title: '',
    tagline: '',
    description: '',
    category: '3D & WebGL',
    liveUrl: '',
    githubUrl: '',
    tags: 'React, TypeScript, Three.js'
  });

  // Escape key and body lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        sounds.playClick();
        onClose();
      }
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

  // Verify stored key on mount or key change
  useEffect(() => {
    if (adminKey) {
      loadAdminData(adminKey);
    }
  }, [adminKey, isOpen]);

  const loadAdminData = async (key: string) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const [msgs, projs, siteStats] = await Promise.all([
        portfolioApi.getMessages(key),
        portfolioApi.getProjects(),
        portfolioApi.getStats()
      ]);
      setMessages(msgs);
      setProjects(projs);
      setStats(siteStats);
      setIsAuthenticated(true);
      localStorage.setItem('chan_portfolio_admin_key', key);
    } catch (err: any) {
      console.error('Admin authentication failed:', err);
      setIsAuthenticated(false);
      setAuthError('Authentication rejected. Ensure the Admin Secret is correct.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    if (!keyInput.trim()) {
      setAuthError('Please enter an admin secret key.');
      return;
    }
    setAdminKey(keyInput.trim());
    loadAdminData(keyInput.trim());
  };

  const handleLogout = () => {
    sounds.playClick();
    setIsAuthenticated(false);
    setAdminKey('');
    setKeyInput('');
    localStorage.removeItem('chan_portfolio_admin_key');
  };

  const handleMarkStatus = async (id: string, status: ContactMessageRecord['status']) => {
    sounds.playClick();
    try {
      await portfolioApi.updateMessageStatus(id, status, adminKey);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status } : m))
      );
      if (selectedMessage?.id === id) {
        setSelectedMessage((prev) => (prev ? { ...prev, status } : null));
      }
    } catch (err: any) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    sounds.playClick();
    try {
      await portfolioApi.deleteProject(id, adminKey);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert('Failed to delete project: ' + err.message);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    try {
      const tagsArray = newProject.tags.split(',').map((t) => t.trim()).filter(Boolean);
      const res = await portfolioApi.createProject(
        {
          title: newProject.title,
          tagline: newProject.tagline,
          description: newProject.description,
          category: newProject.category as any,
          liveUrl: newProject.liveUrl || '#',
          githubUrl: newProject.githubUrl || '#',
          tags: tagsArray,
          image: '/projects/nexus-3d.jpg',
          featured: true
        },
        adminKey
      );

      if (res.project) {
        setProjects((prev) => [res.project, ...prev]);
        setIsAddingProject(false);
        setNewProject({
          title: '',
          tagline: '',
          description: '',
          category: '3D & WebGL',
          liveUrl: '',
          githubUrl: '',
          tags: 'React, TypeScript, Three.js'
        });
        sounds.playSuccess();
      }
    } catch (err: any) {
      alert('Failed to create project: ' + err.message);
    }
  };

  if (!isOpen) return null;

  const unreadCount = messages.filter((m) => m.status === 'unread').length;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-container interactive-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '880px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Modal Top Header */}
        <div className="modal-header-bar" style={{ paddingBottom: '16px' }}>
          <div className="modal-title-wrap">
            <div className="modal-badge-icon" style={{ background: 'rgba(0, 240, 255, 0.15)', color: 'var(--accent-cyan)' }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="modal-title" style={{ fontSize: '1.25rem' }}>Portfolio Control Center</h3>
              <p className="modal-subtitle" style={{ fontSize: '0.8rem' }}>
                Backend REST API &amp; Content Management System
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isAuthenticated && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleLogout}
                style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                title="Logout from CMS"
              >
                <Unlock size={14} />
                <span>Log Out</span>
              </button>
            )}

            <button
              type="button"
              className="modal-close-btn"
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              aria-label="Close Admin Modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Auth Gate Screen */}
        {!isAuthenticated ? (
          <div style={{ padding: '40px 24px', textAlign: 'center', maxWidth: '440px', margin: 'auto' }}>
            <div style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 1.5rem',
              borderRadius: '50%',
              background: 'rgba(0, 240, 255, 0.08)',
              border: '1px solid rgba(0, 240, 255, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-cyan)'
            }}>
              <Lock size={32} />
            </div>

            <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: '#fff' }}>
              Administrator Authentication
            </h4>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '1.75rem', lineHeight: 1.5 }}>
              Enter the backend secret key to manage client inquiries, review telemetry, and edit live portfolio data.
            </p>

            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Admin Secret Key
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="chan-sovannarith-cms-2026"
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value)}
                    style={{ paddingLeft: '38px', width: '100%' }}
                  />
                  <KeyRound size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
              </div>

              {authError && (
                <div style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#fca5a5',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '1rem'
                }}>
                  <AlertCircle size={14} style={{ color: '#ef4444', flexShrink: 0 }} />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isLoading}
                style={{ justifyContent: 'center' }}
              >
                {isLoading ? <RefreshCw size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                <span>Authenticate &amp; Access CMS</span>
              </button>

              <button
                type="button"
                className="btn btn-secondary w-full"
                style={{ marginTop: '10px', fontSize: '0.78rem', padding: '8px' }}
                onClick={() => {
                  setKeyInput('chan-sovannarith-cms-2026');
                  sounds.playClick();
                }}
              >
                <span>Fill Default Admin Key</span>
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated CMS Dashboard */
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Dashboard Tabs */}
            <div style={{
              display: 'flex',
              gap: '8px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              paddingBottom: '12px',
              marginBottom: '16px'
            }}>
              <button
                type="button"
                className={`filter-btn ${activeTab === 'messages' ? 'active' : ''}`}
                onClick={() => {
                  sounds.playClick();
                  setActiveTab('messages');
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Mail size={14} />
                <span>Inquiries</span>
                {unreadCount > 0 && (
                  <span style={{
                    background: '#ef4444',
                    color: '#fff',
                    borderRadius: '10px',
                    padding: '2px 6px',
                    fontSize: '0.7rem',
                    fontWeight: 700
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                className={`filter-btn ${activeTab === 'projects' ? 'active' : ''}`}
                onClick={() => {
                  sounds.playClick();
                  setActiveTab('projects');
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <FolderGit2 size={14} />
                <span>Projects ({projects.length})</span>
              </button>

              <button
                type="button"
                className={`filter-btn ${activeTab === 'analytics' ? 'active' : ''}`}
                onClick={() => {
                  sounds.playClick();
                  setActiveTab('analytics');
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <BarChart3 size={14} />
                <span>Telemetry &amp; Stats</span>
              </button>

              <div style={{ marginLeft: 'auto' }}>
                <button
                  type="button"
                  className="filter-btn"
                  onClick={() => loadAdminData(adminKey)}
                  title="Refresh Data"
                >
                  <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
                </button>
              </div>
            </div>

            {/* Tab 1: Inquiries Messages */}
            {activeTab === 'messages' && (
              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: selectedMessage ? '1fr 1fr' : '1fr', gap: '16px', overflowY: 'auto', paddingRight: '4px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {messages.length === 0 ? (
                    <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      No inquiries recorded yet. Submissions from the Contact form will appear here in real time.
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        onClick={() => {
                          sounds.playClick();
                          setSelectedMessage(msg);
                          if (msg.status === 'unread') {
                            handleMarkStatus(msg.id, 'read');
                          }
                        }}
                        style={{
                          padding: '12px 14px',
                          borderRadius: '10px',
                          background: selectedMessage?.id === msg.id ? 'rgba(0, 240, 255, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                          border: `1px solid ${selectedMessage?.id === msg.id ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.08)'}`,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 600, fontSize: '0.88rem', color: '#fff' }}>{msg.name}</span>
                          <span style={{
                            fontSize: '0.7rem',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            textTransform: 'uppercase',
                            fontWeight: 700,
                            background: msg.status === 'unread' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(52, 211, 153, 0.15)',
                            color: msg.status === 'unread' ? '#f87171' : '#34d399'
                          }}>
                            {msg.status}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', marginBottom: '4px' }}>
                          {msg.subject} • {msg.budget}
                        </div>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {msg.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {/* Message Inspector Panel */}
                {selectedMessage && (
                  <div style={{
                    padding: '16px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '1rem', color: '#fff' }}>{selectedMessage.name}</h4>
                        <a href={`mailto:${selectedMessage.email}`} style={{ fontSize: '0.82rem', color: 'var(--accent-cyan)' }}>
                          {selectedMessage.email}
                        </a>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {new Date(selectedMessage.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.82rem', padding: '8px 10px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px' }}>
                      <strong>Subject:</strong> {selectedMessage.subject} <br />
                      <strong>Budget Range:</strong> {selectedMessage.budget}
                    </div>

                    <div style={{ flex: 1, padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', fontSize: '0.85rem', lineHeight: 1.6, color: '#e2e8f0', overflowY: 'auto' }}>
                      {selectedMessage.message}
                    </div>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <a
                        href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}&body=Hi ${selectedMessage.name},%0D%0A%0D%0AThank you for reaching out regarding your project.`}
                        className="btn btn-primary"
                        style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                        onClick={() => {
                          sounds.playClick();
                          handleMarkStatus(selectedMessage.id, 'replied');
                        }}
                      >
                        <Send size={14} />
                        <span>Reply via Email</span>
                      </a>

                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                        onClick={() => handleMarkStatus(selectedMessage.id, selectedMessage.status === 'unread' ? 'read' : 'unread')}
                      >
                        <CheckCircle2 size={14} />
                        <span>Toggle Read/Unread</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Projects CMS */}
            {activeTab === 'projects' && (
              <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Total active projects in database: <strong>{projects.length}</strong>
                  </span>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                    onClick={() => {
                      sounds.playClick();
                      setIsAddingProject(!isAddingProject);
                    }}
                  >
                    <Plus size={14} />
                    <span>{isAddingProject ? 'Cancel' : 'New Project'}</span>
                  </button>
                </div>

                {/* Add New Project Form */}
                {isAddingProject && (
                  <form onSubmit={handleCreateProject} style={{
                    padding: '16px',
                    borderRadius: '12px',
                    background: 'rgba(0, 240, 255, 0.05)',
                    border: '1px solid rgba(0, 240, 255, 0.2)',
                    marginBottom: '16px'
                  }}>
                    <h5 style={{ margin: '0 0 12px', fontSize: '0.95rem', color: 'var(--accent-cyan)' }}>Add New Portfolio Project</h5>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Project Title (e.g. CyberDesk 3D)"
                        value={newProject.title}
                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                        required
                      />
                      <select
                        className="form-input form-select"
                        value={newProject.category}
                        onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                      >
                        <option value="3D & WebGL">3D &amp; WebGL</option>
                        <option value="AI & Web Apps">AI &amp; Web Apps</option>
                        <option value="Fintech & Dashboards">Fintech &amp; Dashboards</option>
                        <option value="Cultural Heritage">Cultural Heritage</option>
                      </select>
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Tagline (e.g. Immersive 60fps workspace)"
                        value={newProject.tagline}
                        onChange={(e) => setNewProject({ ...newProject, tagline: e.target.value })}
                      />
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                      <textarea
                        className="form-input form-textarea"
                        rows={2}
                        placeholder="Brief project description..."
                        value={newProject.description}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                        required
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                      <input
                        type="url"
                        className="form-input"
                        placeholder="Live Demo URL (https://...)"
                        value={newProject.liveUrl}
                        onChange={(e) => setNewProject({ ...newProject, liveUrl: e.target.value })}
                      />
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Tags comma-separated (React, Three.js, TS)"
                        value={newProject.tags}
                        onChange={(e) => setNewProject({ ...newProject, tags: e.target.value })}
                      />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                      <Plus size={15} />
                      <span>Publish to Live Database</span>
                    </button>
                  </form>
                )}

                {/* Existing Projects List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {projects.map((proj) => (
                    <div
                      key={proj.id}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.07)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px'
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>{proj.title}</span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', background: 'rgba(0, 240, 255, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                            {proj.category}
                          </span>
                        </div>
                        <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {proj.tagline || proj.description}
                        </p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                        <a
                          href={proj.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-secondary"
                          style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                          title="Open live link"
                        >
                          <ExternalLink size={12} />
                        </a>

                        <button
                          type="button"
                          className="btn btn-secondary"
                          style={{ padding: '4px 8px', fontSize: '0.75rem', color: '#f87171' }}
                          onClick={() => handleDeleteProject(proj.id)}
                          title="Delete Project"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Visitor Analytics */}
            {activeTab === 'analytics' && (
              <div style={{ flex: 1, overflowY: 'auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '20px' }}>
                  <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(0, 240, 255, 0.06)', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Total Page Views</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>{stats?.pageViews.toLocaleString() || '---'}</div>
                  </div>

                  <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Unique Visitors</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{stats?.uniqueVisitors.toLocaleString() || '---'}</div>
                  </div>

                  <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(52, 211, 153, 0.08)', border: '1px solid rgba(52, 211, 153, 0.25)' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Project Likes Recorded</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399' }}>{stats?.projectLikesTotal.toLocaleString() || '---'}</div>
                  </div>

                  <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Inquiries Received</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f87171' }}>{messages.length}</div>
                  </div>
                </div>

                <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>
                    <Clock size={16} style={{ color: 'var(--accent-cyan)' }} />
                    <span>Last Telemetry Heartbeat</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {stats?.lastVisit ? new Date(stats.lastVisit).toLocaleString() : 'Just now'} • Connected to Express &amp; Typed Database Engine
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
