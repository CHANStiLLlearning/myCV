import React, { useState, useEffect } from 'react';
import {
  portfolioApi,
  type ContactMessageRecord,
  type SiteStats,
  type PersonalInfo
} from '../services/api';
import type { Project, SkillCategory } from '../types';
import { sounds } from '../utils/soundEffects';
import {
  X,
  Lock,
  Unlock,
  Mail,
  FolderGit2,
  BarChart3,
  CheckCircle2,
  Plus,
  Trash2,
  RefreshCw,
  Send,
  KeyRound,
  ShieldCheck,
  AlertCircle,
  User,
  Wrench,
  Database,
  Save,
  Edit2,
  Download,
  Upload,
  RotateCcw
} from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdate?: (profile: PersonalInfo) => void;
  onProjectsUpdate?: (projects: Project[]) => void;
  onSkillsUpdate?: (skills: SkillCategory[]) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  onProfileUpdate,
  onProjectsUpdate,
  onSkillsUpdate
}) => {
  const [adminKey, setAdminKey] = useState<string>(
    () => localStorage.getItem('chan_portfolio_admin_key') || ''
  );
  const [keyInput, setKeyInput] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Active Tab: profile | projects | skills | messages | analytics | system
  const [activeTab, setActiveTab] = useState<
    'profile' | 'projects' | 'skills' | 'messages' | 'analytics' | 'system'
  >('profile');

  // Loaded Data
  const [profile, setProfile] = useState<PersonalInfo | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<SkillCategory[]>([]);
  const [messages, setMessages] = useState<ContactMessageRecord[]>([]);
  const [stats, setStats] = useState<SiteStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Messages State
  const [selectedMessage, setSelectedMessage] = useState<ContactMessageRecord | null>(null);
  const [msgFilter, setMsgFilter] = useState<'all' | 'unread' | 'read'>('all');

  // Project Drawer State (Create or Edit)
  const [projectDrawerOpen, setProjectDrawerOpen] = useState<boolean>(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    tagline: '',
    description: '',
    category: '3D & WebGL',
    image: '/projects/nexus-3d.jpg',
    liveUrl: '',
    githubUrl: '',
    tags: 'React, TypeScript, Three.js',
    featured: true
  });

  // Skills Editing State
  const [newCatName, setNewCatName] = useState<string>('');
  const [newCatIcon, setNewCatIcon] = useState<string>('Code2');

  // Health Status
  const [healthInfo, setHealthInfo] = useState<{ status: string; uptime: number; service: string } | null>(null);

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
    if (adminKey && isOpen) {
      loadAdminData(adminKey);
    }
  }, [adminKey, isOpen]);

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const loadAdminData = async (key: string) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const [prof, projs, sks, msgs, siteStats] = await Promise.all([
        portfolioApi.getProfile(),
        portfolioApi.getProjects(),
        portfolioApi.getSkills(),
        portfolioApi.getMessages(key),
        portfolioApi.getStats()
      ]);
      setProfile(prof);
      setProjects(projs);
      setSkills(sks);
      setMessages(msgs);
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

  // --- Profile Actions ---
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    sounds.playClick();
    setIsLoading(true);
    try {
      const res = await portfolioApi.updateProfile(profile, adminKey);
      if (res.profile) {
        setProfile(res.profile);
        onProfileUpdate?.(res.profile);
        sounds.playSuccess();
        showNotice('Profile updated and applied live to website!');
      }
    } catch (err: any) {
      alert('Failed to update profile: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Project Actions ---
  const handleOpenNewProject = () => {
    sounds.playClick();
    setEditingProjectId(null);
    setProjectForm({
      title: '',
      tagline: '',
      description: '',
      category: '3D & WebGL',
      image: '/projects/nexus-3d.jpg',
      liveUrl: '',
      githubUrl: '',
      tags: 'React, TypeScript, Three.js',
      featured: true
    });
    setProjectDrawerOpen(true);
  };

  const handleOpenEditProject = (proj: Project) => {
    sounds.playClick();
    setEditingProjectId(proj.id);
    setProjectForm({
      title: proj.title,
      tagline: proj.tagline || '',
      description: proj.description,
      category: proj.category,
      image: proj.image || '/projects/nexus-3d.jpg',
      liveUrl: proj.liveUrl || '',
      githubUrl: proj.githubUrl || '',
      tags: proj.tags.join(', '),
      featured: proj.featured ?? true
    });
    setProjectDrawerOpen(true);
  };

  const handleSaveProjectForm = async (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    const tagsArray = projectForm.tags.split(',').map((t) => t.trim()).filter(Boolean);

    try {
      if (editingProjectId) {
        // Update existing project
        const res = await portfolioApi.updateProject(
          editingProjectId,
          {
            title: projectForm.title,
            tagline: projectForm.tagline,
            description: projectForm.description,
            category: projectForm.category as any,
            image: projectForm.image,
            liveUrl: projectForm.liveUrl,
            githubUrl: projectForm.githubUrl,
            tags: tagsArray,
            featured: projectForm.featured
          },
          adminKey
        );
        if (res.project) {
          const updated = projects.map((p) => (p.id === editingProjectId ? res.project : p));
          setProjects(updated);
          onProjectsUpdate?.(updated);
          setProjectDrawerOpen(false);
          sounds.playSuccess();
          showNotice(`Project "${res.project.title}" updated successfully!`);
        }
      } else {
        // Create new project
        const res = await portfolioApi.createProject(
          {
            title: projectForm.title,
            tagline: projectForm.tagline,
            description: projectForm.description,
            category: projectForm.category as any,
            image: projectForm.image,
            liveUrl: projectForm.liveUrl || '#',
            githubUrl: projectForm.githubUrl || '#',
            tags: tagsArray,
            featured: projectForm.featured
          },
          adminKey
        );
        if (res.project) {
          const updated = [res.project, ...projects];
          setProjects(updated);
          onProjectsUpdate?.(updated);
          setProjectDrawerOpen(false);
          sounds.playSuccess();
          showNotice(`Project "${res.project.title}" created successfully!`);
        }
      }
    } catch (err: any) {
      alert('Failed to save project: ' + err.message);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this project?')) return;
    sounds.playClick();
    try {
      await portfolioApi.deleteProject(id, adminKey);
      const updated = projects.filter((p) => p.id !== id);
      setProjects(updated);
      onProjectsUpdate?.(updated);
      showNotice('Project removed from portfolio.');
    } catch (err: any) {
      alert('Failed to delete project: ' + err.message);
    }
  };

  // --- Skills Actions ---
  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    sounds.playClick();
    const id = newCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCategory: SkillCategory = {
      id,
      name: newCatName.trim(),
      icon: newCatIcon || 'Code2',
      skills: []
    };
    const updated = [...skills, newCategory];
    setSkills(updated);
    setNewCatName('');
  };

  const handleAddSkillToCat = (catId: string) => {
    sounds.playClick();
    const skillName = prompt('Enter Skill Name (e.g. Next.js, WebGL, GraphQL):');
    if (!skillName || !skillName.trim()) return;

    const updated = skills.map((cat) => {
      if (cat.id === catId) {
        return {
          ...cat,
          skills: [
            ...cat.skills,
            {
              name: skillName.trim(),
              level: 85,
              experience: '2+ yrs',
              highlight: true
            }
          ]
        };
      }
      return cat;
    });
    setSkills(updated);
  };

  const handleDeleteSkill = (catId: string, skillIdx: number) => {
    sounds.playClick();
    const updated = skills.map((cat) => {
      if (cat.id === catId) {
        return {
          ...cat,
          skills: cat.skills.filter((_, idx) => idx !== skillIdx)
        };
      }
      return cat;
    });
    setSkills(updated);
  };

  const handleUpdateSkillLevel = (catId: string, skillIdx: number, level: number) => {
    const updated = skills.map((cat) => {
      if (cat.id === catId) {
        const copy = [...cat.skills];
        copy[skillIdx] = { ...copy[skillIdx], level };
        return { ...cat, skills: copy };
      }
      return cat;
    });
    setSkills(updated);
  };

  const handleSaveSkills = async () => {
    sounds.playClick();
    setIsLoading(true);
    try {
      const res = await portfolioApi.updateSkills(skills, adminKey);
      if (res.skills) {
        setSkills(res.skills);
        onSkillsUpdate?.(res.skills);
        sounds.playSuccess();
        showNotice('Skills database updated and applied live!');
      }
    } catch (err: any) {
      alert('Failed to update skills: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Inquiries Actions ---
  const handleMarkStatus = async (id: string, status: ContactMessageRecord['status']) => {
    sounds.playClick();
    try {
      await portfolioApi.updateMessageStatus(id, status, adminKey);
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
      if (selectedMessage?.id === id) {
        setSelectedMessage((prev) => (prev ? { ...prev, status } : null));
      }
    } catch (err: any) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    sounds.playClick();
    try {
      await portfolioApi.deleteMessage(id, adminKey);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
      showNotice('Message deleted.');
    } catch (err: any) {
      alert('Failed to delete message: ' + err.message);
    }
  };

  // --- Telemetry & System Actions ---
  const handleResetStats = async () => {
    if (!confirm('Are you sure you want to reset all visitor and page view counters to zero?')) return;
    sounds.playClick();
    try {
      const res = await portfolioApi.resetStats(adminKey);
      if (res.stats) {
        setStats(res.stats);
        showNotice('Telemetry counters reset to zero.');
      }
    } catch (err: any) {
      alert('Failed to reset stats: ' + err.message);
    }
  };

  const handlePingHealth = async () => {
    sounds.playClick();
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setHealthInfo(data);
      sounds.playSuccess();
    } catch (err: any) {
      alert('Health check error: ' + err.message);
    }
  };

  const handleExportBackup = async () => {
    sounds.playClick();
    try {
      const data = await portfolioApi.exportDatabase(adminKey);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `portfolio_backup_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showNotice('Database backup downloaded successfully!');
    } catch (err: any) {
      alert('Failed to export database: ' + err.message);
    }
  };

  const handleImportBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    sounds.playClick();
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (!confirm('Restore database from this backup? This will overwrite current profile and projects.')) return;
        const res = await portfolioApi.importDatabase(json, adminKey);
        if (res.success) {
          sounds.playSuccess();
          showNotice('Database restored successfully from backup!');
          loadAdminData(adminKey);
          if (res.database.profile) onProfileUpdate?.(res.database.profile);
          if (res.database.projects) onProjectsUpdate?.(res.database.projects);
          if (res.database.skills) onSkillsUpdate?.(res.database.skills);
        }
      } catch (err: any) {
        alert('Invalid JSON file or restore failed: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleFactoryReset = async () => {
    if (!confirm('WARNING: Factory reset will restore all initial profile, projects, and skills seeds. Continue?')) return;
    sounds.playClick();
    try {
      const res = await portfolioApi.resetDatabase(adminKey);
      if (res.success) {
        sounds.playSuccess();
        showNotice('Database restored to default factory seeds!');
        loadAdminData(adminKey);
        if (res.database.profile) onProfileUpdate?.(res.database.profile);
        if (res.database.projects) onProjectsUpdate?.(res.database.projects);
        if (res.database.skills) onSkillsUpdate?.(res.database.skills);
      }
    } catch (err: any) {
      alert('Failed to reset database: ' + err.message);
    }
  };

  if (!isOpen) return null;

  const unreadCount = messages.filter((m) => m.status === 'unread').length;
  const filteredMessages = messages.filter((m) => {
    if (msgFilter === 'unread') return m.status === 'unread';
    if (msgFilter === 'read') return m.status === 'read' || m.status === 'replied';
    return true;
  });

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-container interactive-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '1020px',
          width: '95vw',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 28px'
        }}
      >
        {/* Modal Top Header */}
        <div
          className="modal-header-bar"
          style={{ paddingBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}
        >
          <div className="modal-title-wrap">
            <div
              className="modal-badge-icon"
              style={{ background: 'rgba(0, 240, 255, 0.15)', color: 'var(--accent-cyan)' }}
            >
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 className="modal-title" style={{ fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>Website Master Control Center</span>
                <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px', background: 'rgba(0, 240, 255, 0.1)', color: 'var(--accent-cyan)', border: '1px solid rgba(0, 240, 255, 0.25)' }}>
                  Full Access CMS
                </span>
              </h3>
              <p className="modal-subtitle" style={{ fontSize: '0.8rem' }}>
                Manage Profile, Projects, Skills, Inquiries, Telemetry, and Database Live
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

        {/* Global Action Banner Notice */}
        {actionNotice && (
          <div
            style={{
              marginTop: '12px',
              padding: '10px 16px',
              borderRadius: '8px',
              background: 'rgba(52, 211, 153, 0.15)',
              border: '1px solid rgba(52, 211, 153, 0.35)',
              color: '#34d399',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <CheckCircle2 size={16} />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* Auth Gate Screen */}
        {!isAuthenticated ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', maxWidth: '440px', margin: 'auto' }}>
            <div
              style={{
                width: '68px',
                height: '68px',
                margin: '0 auto 1.5rem',
                borderRadius: '50%',
                background: 'rgba(0, 240, 255, 0.08)',
                border: '1px solid rgba(0, 240, 255, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-cyan)'
              }}
            >
              <Lock size={32} />
            </div>

            <h4 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: '#fff' }}>
              Administrator Authentication
            </h4>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '1.75rem', lineHeight: 1.5 }}>
              Enter your master secret key to access and control all components of your portfolio website.
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
                    placeholder="keo-kimchan-cms-2026"
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
                <span>Authenticate &amp; Access Dashboard</span>
              </button>

              <button
                type="button"
                className="btn btn-secondary w-full"
                style={{ marginTop: '10px', fontSize: '0.78rem', padding: '8px' }}
                onClick={() => {
                  setKeyInput('keo-kimchan-cms-2026');
                  sounds.playClick();
                }}
              >
                <span>Fill Default Admin Key</span>
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated CMS Dashboard */
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', marginTop: '16px' }}>
            {/* Dashboard Navigation Tabs */}
            <div
              style={{
                display: 'flex',
                gap: '8px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                paddingBottom: '12px',
                marginBottom: '16px',
                overflowX: 'auto'
              }}
            >
              <button
                type="button"
                className={`filter-btn ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => {
                  sounds.playClick();
                  setActiveTab('profile');
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <User size={14} />
                <span>Profile &amp; Hero</span>
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
                className={`filter-btn ${activeTab === 'skills' ? 'active' : ''}`}
                onClick={() => {
                  sounds.playClick();
                  setActiveTab('skills');
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Wrench size={14} />
                <span>Skills &amp; Tech</span>
              </button>

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
                  <span
                    style={{
                      background: '#ef4444',
                      color: '#fff',
                      borderRadius: '10px',
                      padding: '2px 6px',
                      fontSize: '0.7rem',
                      fontWeight: 700
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
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
                <span>Telemetry</span>
              </button>

              <button
                type="button"
                className={`filter-btn ${activeTab === 'system' ? 'active' : ''}`}
                onClick={() => {
                  sounds.playClick();
                  setActiveTab('system');
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Database size={14} />
                <span>Database &amp; Backup</span>
              </button>

              <div style={{ marginLeft: 'auto' }}>
                <button
                  type="button"
                  className="filter-btn"
                  onClick={() => loadAdminData(adminKey)}
                  title="Reload Live Database"
                >
                  <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
                </button>
              </div>
            </div>

            {/* TAB 1: PROFILE & HERO CONTROLLER */}
            {activeTab === 'profile' && profile && (
              <form onSubmit={handleSaveProfile} style={{ flex: 1, overflowY: 'auto', paddingRight: '8px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                  <div className="form-group">
                    <label className="form-label">Brand / Display Alias</label>
                    <input
                      type="text"
                      className="form-input"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      placeholder="e.g. CHAN"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Developer Full Legal Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={profile.fullName}
                      onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                      placeholder="e.g. KEO KIMCHAN"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Professional Role / Title</label>
                    <input
                      type="text"
                      className="form-input"
                      value={profile.role}
                      onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                      placeholder="e.g. Creative Frontend Web Developer"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Specialization / Focus Badge</label>
                    <input
                      type="text"
                      className="form-input"
                      value={profile.focus}
                      onChange={(e) => setProfile({ ...profile, focus: e.target.value })}
                      placeholder="e.g. 3D Web Experiences, Interactive UI & Performance"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      className="form-input"
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      placeholder="e.g. Phnom Penh, Cambodia"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Contact Email</label>
                    <input
                      type="email"
                      className="form-input"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      placeholder="reactjs35@gmail.com"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Telegram Handle</label>
                    <input
                      type="text"
                      className="form-input"
                      value={profile.telegram}
                      onChange={(e) => setProfile({ ...profile, telegram: e.target.value })}
                      placeholder="@chan_frontend"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Availability Status Text</label>
                    <input
                      type="text"
                      className="form-input"
                      value={profile.availability}
                      onChange={(e) => setProfile({ ...profile, availability: e.target.value })}
                      placeholder="Available for Remote Roles & High-Impact Projects"
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label">Short Hero Bio Description</label>
                  <textarea
                    rows={2}
                    className="form-input"
                    value={profile.bioShort}
                    onChange={(e) => setProfile({ ...profile, bioShort: e.target.value })}
                    placeholder="Short introduction displayed in the hero section..."
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="form-label">Extended About Bio (Paragraphs)</label>
                  {profile.bioExtended.map((para, idx) => (
                    <textarea
                      key={idx}
                      rows={2}
                      className="form-input"
                      style={{ marginBottom: '8px' }}
                      value={para}
                      onChange={(e) => {
                        const copy = [...profile.bioExtended];
                        copy[idx] = e.target.value;
                        setProfile({ ...profile, bioExtended: copy });
                      }}
                    />
                  ))}
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>
                    Live Metric Chips
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                    {profile.stats.map((st, idx) => (
                      <div key={idx} style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                        <input
                          type="text"
                          className="form-input"
                          style={{ padding: '4px 8px', fontSize: '1rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '4px' }}
                          value={st.value}
                          onChange={(e) => {
                            const copy = [...profile.stats];
                            copy[idx] = { ...copy[idx], value: e.target.value };
                            setProfile({ ...profile, stats: copy });
                          }}
                        />
                        <input
                          type="text"
                          className="form-input"
                          style={{ padding: '4px 8px', fontSize: '0.78rem', color: 'var(--text-muted)' }}
                          value={st.label}
                          onChange={(e) => {
                            const copy = [...profile.stats];
                            copy[idx] = { ...copy[idx], label: e.target.value };
                            setProfile({ ...profile, stats: copy });
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading}
                  style={{ gap: '8px', padding: '10px 24px', fontSize: '0.9rem' }}
                >
                  <Save size={16} />
                  <span>Save &amp; Apply Profile to Live Website</span>
                </button>
              </form>
            )}

            {/* TAB 2: PROJECTS MANAGER */}
            {activeTab === 'projects' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <h4 style={{ margin: 0, fontSize: '1rem', color: '#fff' }}>Portfolio Projects ({projects.length})</h4>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ fontSize: '0.8rem', padding: '6px 14px', gap: '6px' }}
                    onClick={handleOpenNewProject}
                  >
                    <Plus size={15} />
                    <span>Add New Project</span>
                  </button>
                </div>

                {projectDrawerOpen ? (
                  <form onSubmit={handleSaveProjectForm} style={{ flex: 1, overflowY: 'auto', background: 'rgba(255, 255, 255, 0.02)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h5 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--accent-cyan)' }}>
                        {editingProjectId ? 'Edit Project Details' : 'Create New Project'}
                      </h5>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                        onClick={() => setProjectDrawerOpen(false)}
                      >
                        Cancel
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                      <div className="form-group">
                        <label className="form-label">Project Title *</label>
                        <input
                          type="text"
                          required
                          className="form-input"
                          value={projectForm.title}
                          onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                          placeholder="e.g. CyberStep 3D Commerce"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Category</label>
                        <select
                          className="form-input form-select"
                          value={projectForm.category}
                          onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value as any })}
                        >
                          <option value="3D & WebGL">3D &amp; WebGL</option>
                          <option value="AI & Web Apps">AI &amp; Web Apps</option>
                          <option value="Fintech & Dashboards">Fintech &amp; Dashboards</option>
                          <option value="Cultural Heritage">Cultural Heritage</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Tagline</label>
                        <input
                          type="text"
                          className="form-input"
                          value={projectForm.tagline}
                          onChange={(e) => setProjectForm({ ...projectForm, tagline: e.target.value })}
                          placeholder="Short one-line pitch"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Cover Image Path</label>
                        <input
                          type="text"
                          className="form-input"
                          value={projectForm.image}
                          onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                          placeholder="/projects/nexus-3d.jpg"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Live Demo URL</label>
                        <input
                          type="text"
                          className="form-input"
                          value={projectForm.liveUrl}
                          onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                          placeholder="https://..."
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">GitHub Repo URL</label>
                        <input
                          type="text"
                          className="form-input"
                          value={projectForm.githubUrl}
                          onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                          placeholder="https://github.com/..."
                        />
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '14px' }}>
                      <label className="form-label">Tech Tags (comma-separated)</label>
                      <input
                        type="text"
                        className="form-input"
                        value={projectForm.tags}
                        onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })}
                        placeholder="React, TypeScript, Three.js, WebGL"
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: '16px' }}>
                      <label className="form-label">Full Project Description *</label>
                      <textarea
                        rows={3}
                        required
                        className="form-input"
                        value={projectForm.description}
                        onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                        placeholder="Describe engineering highlights, architecture, and features..."
                      />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ padding: '8px 20px', gap: '6px' }}>
                      <Save size={15} />
                      <span>{editingProjectId ? 'Update Project' : 'Publish Project'}</span>
                    </button>
                  </form>
                ) : (
                  <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {projects.map((proj) => (
                      <div
                        key={proj.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '14px',
                          padding: '12px 16px',
                          borderRadius: '10px',
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid rgba(255, 255, 255, 0.08)'
                        }}
                      >
                        <img
                          src={proj.image || '/projects/nexus-3d.jpg'}
                          alt={proj.title}
                          style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <strong style={{ fontSize: '0.92rem', color: '#fff' }}>{proj.title}</strong>
                            <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(0, 240, 255, 0.1)', color: 'var(--accent-cyan)' }}>
                              {proj.category}
                            </span>
                            {proj.likes !== undefined && (
                              <span style={{ fontSize: '0.72rem', color: '#f43f5e' }}>
                                ❤️ {proj.likes}
                              </span>
                            )}
                          </div>
                          <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {proj.tagline || proj.description}
                          </p>
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            style={{ padding: '6px 10px', fontSize: '0.75rem', gap: '4px' }}
                            onClick={() => handleOpenEditProject(proj)}
                            title="Edit Project"
                          >
                            <Edit2 size={13} />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            className="btn btn-secondary"
                            style={{ padding: '6px 10px', fontSize: '0.75rem', color: '#ef4444' }}
                            onClick={() => handleDeleteProject(proj.id)}
                            title="Delete Project"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: SKILLS & TECH STACK */}
            {activeTab === 'skills' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <h4 style={{ margin: 0, fontSize: '1rem', color: '#fff' }}>Skill Categories &amp; Competencies</h4>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ fontSize: '0.8rem', padding: '6px 16px', gap: '6px' }}
                    onClick={handleSaveSkills}
                    disabled={isLoading}
                  >
                    <Save size={14} />
                    <span>Save Skills Live</span>
                  </button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', paddingRight: '6px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {skills.map((cat) => (
                    <div
                      key={cat.id}
                      style={{
                        padding: '16px',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.08)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <strong style={{ fontSize: '0.95rem', color: 'var(--accent-cyan)' }}>{cat.name}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({cat.skills.length} skills)</span>
                        </div>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          style={{ padding: '4px 10px', fontSize: '0.75rem', gap: '4px' }}
                          onClick={() => handleAddSkillToCat(cat.id)}
                        >
                          <Plus size={13} />
                          <span>Add Skill</span>
                        </button>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
                        {cat.skills.map((sk, idx) => (
                          <div
                            key={idx}
                            style={{
                              padding: '10px 12px',
                              borderRadius: '8px',
                              background: 'rgba(255, 255, 255, 0.03)',
                              border: '1px solid rgba(255, 255, 255, 0.06)',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '6px'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#fff' }}>{sk.name}</span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>{sk.level}%</span>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteSkill(cat.id, idx)}
                                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 2 }}
                                  title="Delete skill"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                            <input
                              type="range"
                              min="10"
                              max="100"
                              value={sk.level}
                              onChange={(e) => handleUpdateSkillLevel(cat.id, idx, Number(e.target.value))}
                              style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Add New Category Box */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                    <input
                      type="text"
                      className="form-input"
                      style={{ maxWidth: '300px' }}
                      placeholder="New Category Name (e.g. DevOps & Cloud)"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                    />
                    <select
                      className="form-input form-select"
                      style={{ maxWidth: '140px' }}
                      value={newCatIcon}
                      onChange={(e) => setNewCatIcon(e.target.value)}
                    >
                      <option value="Code2">Code2</option>
                      <option value="Cpu">Cpu</option>
                      <option value="Palette">Palette</option>
                      <option value="Layers">Layers</option>
                      <option value="Terminal">Terminal</option>
                      <option value="Globe">Globe</option>
                    </select>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleAddCategory}
                      style={{ fontSize: '0.8rem' }}
                    >
                      <Plus size={14} />
                      <span>Add Category</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: INQUIRIES & CONTACT MESSAGES */}
            {activeTab === 'messages' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <button
                    type="button"
                    className={`filter-btn ${msgFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setMsgFilter('all')}
                  >
                    All ({messages.length})
                  </button>
                  <button
                    type="button"
                    className={`filter-btn ${msgFilter === 'unread' ? 'active' : ''}`}
                    onClick={() => setMsgFilter('unread')}
                  >
                    Unread ({unreadCount})
                  </button>
                  <button
                    type="button"
                    className={`filter-btn ${msgFilter === 'read' ? 'active' : ''}`}
                    onClick={() => setMsgFilter('read')}
                  >
                    Read ({messages.length - unreadCount})
                  </button>
                </div>

                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: selectedMessage ? '1fr 1fr' : '1fr', gap: '16px', overflowY: 'auto' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
                    {filteredMessages.length === 0 ? (
                      <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        No messages found in this category.
                      </div>
                    ) : (
                      filteredMessages.map((msg) => (
                        <div
                          key={msg.id}
                          onClick={() => {
                            sounds.playClick();
                            setSelectedMessage(msg);
                            if (msg.status === 'unread') handleMarkStatus(msg.id, 'read');
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
                            {msg.email}
                          </div>
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {msg.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Message Inspector */}
                  {selectedMessage && (
                    <div
                      style={{
                        padding: '16px',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        overflowY: 'auto'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#fff' }}>{selectedMessage.name}</h4>
                          <a href={`mailto:${selectedMessage.email}`} style={{ fontSize: '0.82rem', color: 'var(--accent-cyan)' }}>
                            {selectedMessage.email}
                          </a>
                        </div>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          style={{ padding: '4px 8px', fontSize: '0.75rem', color: '#ef4444' }}
                          onClick={() => handleDeleteMessage(selectedMessage.id)}
                          title="Delete message"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Received: {new Date(selectedMessage.createdAt).toLocaleString()}
                      </div>

                      <div style={{
                        padding: '12px',
                        borderRadius: '8px',
                        background: 'rgba(0, 0, 0, 0.3)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        fontSize: '0.85rem',
                        lineHeight: 1.6,
                        color: 'var(--text-secondary)',
                        whiteSpace: 'pre-wrap'
                      }}>
                        {selectedMessage.message}
                      </div>

                      <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                        <a
                          href={`mailto:${selectedMessage.email}?subject=Re: Inquiry from Portfolio&body=Hi ${selectedMessage.name},%0D%0A%0D%0AThank you for reaching out.`}
                          className="btn btn-primary"
                          style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem', padding: '8px' }}
                        >
                          <Send size={14} />
                          <span>Reply via Email</span>
                        </a>

                        <button
                          type="button"
                          className="btn btn-secondary"
                          style={{ fontSize: '0.8rem', padding: '8px 12px' }}
                          onClick={() => handleMarkStatus(selectedMessage.id, selectedMessage.status === 'read' ? 'unread' : 'read')}
                        >
                          <span>{selectedMessage.status === 'read' ? 'Mark Unread' : 'Mark Read'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 5: TELEMETRY & HEALTH */}
            {activeTab === 'analytics' && stats && (
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                  <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Page Views</span>
                    <h3 style={{ margin: '6px 0 0', fontSize: '1.8rem', color: 'var(--accent-cyan)' }}>{stats.pageViews}</h3>
                  </div>

                  <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Unique Visitors</span>
                    <h3 style={{ margin: '6px 0 0', fontSize: '1.8rem', color: '#a855f7' }}>{stats.uniqueVisitors}</h3>
                  </div>

                  <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Project Likes Total</span>
                    <h3 style={{ margin: '6px 0 0', fontSize: '1.8rem', color: '#f43f5e' }}>{stats.projectLikesTotal}</h3>
                  </div>

                  <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Last Active Visit</span>
                    <h4 style={{ margin: '6px 0 0', fontSize: '0.88rem', color: '#fff', wordBreak: 'break-all' }}>
                      {new Date(stats.lastVisit).toLocaleTimeString()} ({new Date(stats.lastVisit).toLocaleDateString()})
                    </h4>
                  </div>
                </div>

                {/* API Health Diagnostic */}
                <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <strong style={{ fontSize: '0.9rem', color: '#fff' }}>API Server Health &amp; Telemetry</strong>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                      onClick={handlePingHealth}
                    >
                      Ping /api/health
                    </button>
                  </div>

                  {healthInfo ? (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', gap: '20px' }}>
                      <div>Status: <span style={{ color: '#34d399', fontWeight: 700 }}>{healthInfo.status}</span></div>
                      <div>Service: <span>{healthInfo.service}</span></div>
                      <div>Uptime: <span>{Math.floor(healthInfo.uptime)}s</span></div>
                    </div>
                  ) : (
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Click "Ping /api/health" to run a live telemetry probe against the backend server.
                    </p>
                  )}
                </div>

                <div>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleResetStats}
                    style={{ fontSize: '0.8rem', color: '#f87171' }}
                  >
                    <RotateCcw size={14} />
                    <span>Reset Telemetry Counters</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 6: DATABASE & SYSTEM BACKUP */}
            {activeTab === 'system' && (
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <h4 style={{ margin: '0 0 6px', fontSize: '0.95rem', color: '#fff' }}>Export &amp; Download Full Database Backup</h4>
                  <p style={{ margin: '0 0 14px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Export the entire database (`portfolio_db.json`) including profile, projects, skills, messages, and telemetry as a standalone JSON backup file.
                  </p>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ fontSize: '0.8rem', padding: '8px 16px', gap: '6px' }}
                    onClick={handleExportBackup}
                  >
                    <Download size={14} />
                    <span>Export Database (.json)</span>
                  </button>
                </div>

                <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <h4 style={{ margin: '0 0 6px', fontSize: '0.95rem', color: '#fff' }}>Import &amp; Restore Database</h4>
                  <p style={{ margin: '0 0 14px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Upload a previously exported backup file to restore your entire portfolio data in one click.
                  </p>
                  <label className="btn btn-secondary" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', padding: '8px 16px' }}>
                    <Upload size={14} />
                    <span>Select Backup JSON File</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportBackup}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>

                <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                  <h4 style={{ margin: '0 0 6px', fontSize: '0.95rem', color: '#f87171' }}>Factory Reset Database</h4>
                  <p style={{ margin: '0 0 14px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Reset your portfolio to its clean initial defaults (KEO KIMCHAN profile, default projects, and standard skills).
                  </p>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ fontSize: '0.8rem', padding: '8px 16px', gap: '6px', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.4)' }}
                    onClick={handleFactoryReset}
                  >
                    <RotateCcw size={14} />
                    <span>Reset Database to Defaults</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
