import { PERSONAL_INFO, PROJECTS_DATA, SKILL_CATEGORIES } from '../data/portfolioData';
import type { Project, SkillCategory } from '../types';

export interface PersonalInfo {
  name: string;
  fullName: string;
  role: string;
  focus: string;
  location: string;
  timezone: string;
  email: string;
  telegram: string;
  availability: string;
  bioShort: string;
  bioExtended: string[];
  stats: { label: string; value: string }[];
}

export interface ContactMessagePayload {
  name: string;
  email: string;
  subject: string;
  budget: string;
  message: string;
}

export interface ContactMessageRecord extends ContactMessagePayload {
  id: string;
  createdAt: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  ip?: string;
}

export interface SiteStats {
  pageViews: number;
  uniqueVisitors: number;
  lastVisit: string;
  projectLikesTotal: number;
}

const API_BASE = '/api';

async function fetchJson<T>(url: string, options?: RequestInit, fallback?: T): Promise<T> {
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      }
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP ${res.status}: ${res.statusText}`);
    }

    return await res.json();
  } catch (err) {
    if (fallback !== undefined) {
      console.warn(`[API Fallback] Request to ${url} failed, using local seed data:`, err);
      return fallback;
    }
    throw err;
  }
}

const STORAGE_KEY_PROFILE = 'portfolio_cms_profile';
const STORAGE_KEY_PROJECTS = 'portfolio_cms_projects';
const STORAGE_KEY_SKILLS = 'portfolio_cms_skills';
const STORAGE_KEY_MESSAGES = 'portfolio_cms_messages';
const STORAGE_KEY_STATS = 'portfolio_cms_stats';

const DEFAULT_MESSAGES: ContactMessageRecord[] = [
  {
    id: 'msg-sample-1',
    createdAt: new Date().toISOString(),
    name: 'Sarah Connor (AI Labs)',
    email: 'sarah.connor@cyberdyne.io',
    subject: 'Real-time Interactive 3D WebGL Dashboard',
    budget: '$5k - $10k',
    message: 'Hi Chan, we love your 3D portfolio and want to build a real-time reactive dashboard with you!',
    status: 'read'
  }
];

export const portfolioApi = {
  // --- Profile Operations ---
  async getProfile(): Promise<PersonalInfo> {
    const cached = localStorage.getItem(STORAGE_KEY_PROFILE);
    const localProfile = cached ? JSON.parse(cached) : PERSONAL_INFO;
    return fetchJson<PersonalInfo>(`${API_BASE}/profile`, undefined, localProfile as PersonalInfo);
  },

  async updateProfile(profile: Partial<PersonalInfo>, adminKey?: string): Promise<{ success: boolean; profile: PersonalInfo }> {
    const cached = localStorage.getItem(STORAGE_KEY_PROFILE);
    const current = cached ? JSON.parse(cached) : PERSONAL_INFO;
    const merged = { ...current, ...profile };
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(merged));

    try {
      return await fetchJson(`${API_BASE}/profile`, {
        method: 'PUT',
        headers: adminKey ? { Authorization: `Bearer ${adminKey}` } : {},
        body: JSON.stringify(profile)
      });
    } catch {
      return { success: true, profile: merged };
    }
  },

  // --- Projects Operations ---
  async getProjects(): Promise<Project[]> {
    const cached = localStorage.getItem(STORAGE_KEY_PROJECTS);
    const localProjects = cached ? JSON.parse(cached) : PROJECTS_DATA;
    return fetchJson<Project[]>(`${API_BASE}/projects`, undefined, localProjects);
  },

  async getProject(id: string): Promise<Project> {
    const projs = await this.getProjects();
    const found = projs.find((p) => p.id === id);
    return fetchJson<Project>(`${API_BASE}/projects/${id}`, undefined, found || PROJECTS_DATA[0]);
  },

  async createProject(project: Partial<Project>, adminKey?: string): Promise<{ success: boolean; project: Project }> {
    const projs = await this.getProjects();
    const newProj: Project = {
      id: project.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `project-${Date.now()}`,
      title: project.title || 'Untitled Project',
      tagline: project.tagline || '',
      category: project.category || '3D & WebGL',
      description: project.description || '',
      image: project.image || '/projects/nexus-3d.jpg',
      liveUrl: project.liveUrl || '#',
      githubUrl: project.githubUrl || '#',
      tags: project.tags || ['React', 'TypeScript'],
      featured: project.featured ?? false,
      likes: 0
    };
    const updated = [newProj, ...projs];
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(updated));

    try {
      return await fetchJson(`${API_BASE}/projects`, {
        method: 'POST',
        headers: adminKey ? { Authorization: `Bearer ${adminKey}` } : {},
        body: JSON.stringify(project)
      });
    } catch {
      return { success: true, project: newProj };
    }
  },

  async updateProject(id: string, updates: Partial<Project>, adminKey?: string): Promise<{ success: boolean; project: Project }> {
    const projs = await this.getProjects();
    const updated = projs.map((p) => (p.id === id ? { ...p, ...updates } : p));
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(updated));
    const target = updated.find((p) => p.id === id)!;

    try {
      return await fetchJson(`${API_BASE}/projects/${id}`, {
        method: 'PUT',
        headers: adminKey ? { Authorization: `Bearer ${adminKey}` } : {},
        body: JSON.stringify(updates)
      });
    } catch {
      return { success: true, project: target };
    }
  },

  async deleteProject(id: string, adminKey?: string): Promise<{ success: boolean }> {
    const projs = await this.getProjects();
    const updated = projs.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(updated));

    try {
      return await fetchJson(`${API_BASE}/projects/${id}`, {
        method: 'DELETE',
        headers: adminKey ? { Authorization: `Bearer ${adminKey}` } : {}
      });
    } catch {
      return { success: true };
    }
  },

  async likeProject(id: string): Promise<{ success: boolean; likes: number }> {
    try {
      return await fetchJson(`${API_BASE}/projects/${id}/like`, { method: 'POST' });
    } catch {
      const projs = await this.getProjects();
      let likes = 0;
      const updated = projs.map((p) => {
        if (p.id === id) {
          likes = (p.likes || 0) + 1;
          return { ...p, likes };
        }
        return p;
      });
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(updated));
      return { success: true, likes };
    }
  },

  // --- Skills Operations ---
  async getSkills(): Promise<SkillCategory[]> {
    const cached = localStorage.getItem(STORAGE_KEY_SKILLS);
    const localSkills = cached ? JSON.parse(cached) : SKILL_CATEGORIES;
    return fetchJson<SkillCategory[]>(`${API_BASE}/skills`, undefined, localSkills);
  },

  async updateSkills(skills: SkillCategory[], adminKey?: string): Promise<{ success: boolean; skills: SkillCategory[] }> {
    localStorage.setItem(STORAGE_KEY_SKILLS, JSON.stringify(skills));
    try {
      return await fetchJson(`${API_BASE}/skills`, {
        method: 'PUT',
        headers: adminKey ? { Authorization: `Bearer ${adminKey}` } : {},
        body: JSON.stringify(skills)
      });
    } catch {
      return { success: true, skills };
    }
  },

  // --- Contact Inquiries Operations ---
  async sendContact(payload: ContactMessagePayload): Promise<{ success: boolean; message: string; inquiryId: string }> {
    const newMsg: ContactMessageRecord = {
      ...payload,
      id: `msg-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'unread'
    };
    const cached = localStorage.getItem(STORAGE_KEY_MESSAGES);
    const list: ContactMessageRecord[] = cached ? JSON.parse(cached) : DEFAULT_MESSAGES;
    localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify([newMsg, ...list]));

    try {
      return await fetchJson(`${API_BASE}/contact`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    } catch {
      return { success: true, message: 'Message sent successfully!', inquiryId: newMsg.id };
    }
  },

  async getMessages(adminKey?: string): Promise<ContactMessageRecord[]> {
    const cached = localStorage.getItem(STORAGE_KEY_MESSAGES);
    const list = cached ? JSON.parse(cached) : DEFAULT_MESSAGES;
    return fetchJson<ContactMessageRecord[]>(`${API_BASE}/contact/messages`, {
      headers: adminKey ? { Authorization: `Bearer ${adminKey}` } : {}
    }, list);
  },

  async updateMessageStatus(id: string, status: ContactMessageRecord['status'], adminKey?: string): Promise<{ success: boolean }> {
    const cached = localStorage.getItem(STORAGE_KEY_MESSAGES);
    const list: ContactMessageRecord[] = cached ? JSON.parse(cached) : DEFAULT_MESSAGES;
    const updated = list.map((m) => (m.id === id ? { ...m, status } : m));
    localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(updated));

    try {
      return await fetchJson(`${API_BASE}/contact/messages/${id}`, {
        method: 'PATCH',
        headers: adminKey ? { Authorization: `Bearer ${adminKey}` } : {},
        body: JSON.stringify({ status })
      });
    } catch {
      return { success: true };
    }
  },

  async deleteMessage(id: string, adminKey?: string): Promise<{ success: boolean }> {
    const cached = localStorage.getItem(STORAGE_KEY_MESSAGES);
    const list: ContactMessageRecord[] = cached ? JSON.parse(cached) : DEFAULT_MESSAGES;
    const updated = list.filter((m) => m.id !== id);
    localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(updated));

    try {
      return await fetchJson(`${API_BASE}/contact/messages/${id}`, {
        method: 'DELETE',
        headers: adminKey ? { Authorization: `Bearer ${adminKey}` } : {}
      });
    } catch {
      return { success: true };
    }
  },

  // --- Telemetry & Site Stats Operations ---
  async getStats(): Promise<SiteStats> {
    const cached = localStorage.getItem(STORAGE_KEY_STATS);
    const localStats: SiteStats = cached
      ? JSON.parse(cached)
      : {
          pageViews: 1432,
          uniqueVisitors: 413,
          lastVisit: new Date().toISOString(),
          projectLikesTotal: 164
        };
    return fetchJson<SiteStats>(`${API_BASE}/stats`, undefined, localStats);
  },

  async recordVisit(): Promise<{ success: boolean; stats: SiteStats }> {
    const hasVisited = localStorage.getItem('chan_has_visited');
    const isUnique = !hasVisited;
    if (isUnique) {
      localStorage.setItem('chan_has_visited', 'true');
    }
    const current = await this.getStats();
    const updatedStats: SiteStats = {
      ...current,
      pageViews: current.pageViews + 1,
      uniqueVisitors: isUnique ? current.uniqueVisitors + 1 : current.uniqueVisitors,
      lastVisit: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(updatedStats));

    try {
      return await fetchJson(`${API_BASE}/stats/visit`, {
        method: 'POST',
        body: JSON.stringify({ isUnique })
      });
    } catch {
      return { success: true, stats: updatedStats };
    }
  },

  async resetStats(adminKey?: string): Promise<{ success: boolean; stats: SiteStats }> {
    const resetValues: SiteStats = {
      pageViews: 0,
      uniqueVisitors: 0,
      lastVisit: new Date().toISOString(),
      projectLikesTotal: 0
    };
    localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(resetValues));

    try {
      return await fetchJson(`${API_BASE}/stats/reset`, {
        method: 'POST',
        headers: adminKey ? { Authorization: `Bearer ${adminKey}` } : {}
      });
    } catch {
      return { success: true, stats: resetValues };
    }
  },

  // --- Database Management Operations ---
  async exportDatabase(adminKey?: string): Promise<any> {
    try {
      return await fetchJson(`${API_BASE}/database/export`, {
        headers: adminKey ? { Authorization: `Bearer ${adminKey}` } : {}
      });
    } catch {
      const [profile, projects, skills, messages, stats] = await Promise.all([
        this.getProfile(),
        this.getProjects(),
        this.getSkills(),
        this.getMessages(adminKey),
        this.getStats()
      ]);
      return {
        profile,
        projects,
        skills,
        messages,
        stats,
        settings: {
          siteTitle: 'CHAN — Creative Frontend Web Developer',
          adminSecretKey: 'keo-kimchan-cms-2026',
          maintenanceMode: false
        }
      };
    }
  },

  async importDatabase(data: any, adminKey?: string): Promise<{ success: boolean; database: any }> {
    if (data.profile) localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(data.profile));
    if (data.projects) localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(data.projects));
    if (data.skills) localStorage.setItem(STORAGE_KEY_SKILLS, JSON.stringify(data.skills));
    if (data.messages) localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(data.messages));
    if (data.stats) localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(data.stats));

    try {
      return await fetchJson(`${API_BASE}/database/import`, {
        method: 'POST',
        headers: adminKey ? { Authorization: `Bearer ${adminKey}` } : {},
        body: JSON.stringify(data)
      });
    } catch {
      return { success: true, database: data };
    }
  },

  async resetDatabase(adminKey?: string): Promise<{ success: boolean; message: string; database: any }> {
    localStorage.removeItem(STORAGE_KEY_PROFILE);
    localStorage.removeItem(STORAGE_KEY_PROJECTS);
    localStorage.removeItem(STORAGE_KEY_SKILLS);
    localStorage.removeItem(STORAGE_KEY_MESSAGES);
    localStorage.removeItem(STORAGE_KEY_STATS);

    try {
      return await fetchJson(`${API_BASE}/database/reset`, {
        method: 'POST',
        headers: adminKey ? { Authorization: `Bearer ${adminKey}` } : {}
      });
    } catch {
      return {
        success: true,
        message: 'Reset to defaults successfully',
        database: {
          profile: PERSONAL_INFO,
          projects: PROJECTS_DATA,
          skills: SKILL_CATEGORIES
        }
      };
    }
  }
};
