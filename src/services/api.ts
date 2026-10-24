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

export const portfolioApi = {
  // --- Profile Operations ---
  async getProfile(): Promise<PersonalInfo> {
    return fetchJson<PersonalInfo>(`${API_BASE}/profile`, undefined, PERSONAL_INFO as PersonalInfo);
  },

  async updateProfile(profile: Partial<PersonalInfo>, adminKey?: string): Promise<{ success: boolean; profile: PersonalInfo }> {
    return fetchJson(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: adminKey ? { Authorization: `Bearer ${adminKey}` } : {},
      body: JSON.stringify(profile)
    });
  },

  // --- Projects Operations ---
  async getProjects(): Promise<Project[]> {
    return fetchJson<Project[]>(`${API_BASE}/projects`, undefined, PROJECTS_DATA);
  },

  async getProject(id: string): Promise<Project> {
    const fallback = PROJECTS_DATA.find((p) => p.id === id);
    return fetchJson<Project>(`${API_BASE}/projects/${id}`, undefined, fallback!);
  },

  async createProject(project: Partial<Project>, adminKey?: string): Promise<{ success: boolean; project: Project }> {
    return fetchJson(`${API_BASE}/projects`, {
      method: 'POST',
      headers: adminKey ? { Authorization: `Bearer ${adminKey}` } : {},
      body: JSON.stringify(project)
    });
  },

  async updateProject(id: string, updates: Partial<Project>, adminKey?: string): Promise<{ success: boolean; project: Project }> {
    return fetchJson(`${API_BASE}/projects/${id}`, {
      method: 'PUT',
      headers: adminKey ? { Authorization: `Bearer ${adminKey}` } : {},
      body: JSON.stringify(updates)
    });
  },

  async deleteProject(id: string, adminKey?: string): Promise<{ success: boolean }> {
    return fetchJson(`${API_BASE}/projects/${id}`, {
      method: 'DELETE',
      headers: adminKey ? { Authorization: `Bearer ${adminKey}` } : {}
    });
  },

  async likeProject(id: string): Promise<{ success: boolean; likes: number }> {
    return fetchJson(`${API_BASE}/projects/${id}/like`, { method: 'POST' });
  },

  // --- Skills Operations ---
  async getSkills(): Promise<SkillCategory[]> {
    return fetchJson<SkillCategory[]>(`${API_BASE}/skills`, undefined, SKILL_CATEGORIES);
  },

  async updateSkills(skills: SkillCategory[], adminKey?: string): Promise<{ success: boolean; skills: SkillCategory[] }> {
    return fetchJson(`${API_BASE}/skills`, {
      method: 'PUT',
      headers: adminKey ? { Authorization: `Bearer ${adminKey}` } : {},
      body: JSON.stringify(skills)
    });
  },

  // --- Contact Inquiries Operations ---
  async sendContact(payload: ContactMessagePayload): Promise<{ success: boolean; message: string; inquiryId: string }> {
    return fetchJson(`${API_BASE}/contact`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async getMessages(adminKey?: string): Promise<ContactMessageRecord[]> {
    return fetchJson(`${API_BASE}/contact/messages`, {
      headers: adminKey ? { Authorization: `Bearer ${adminKey}` } : {}
    });
  },

  async updateMessageStatus(id: string, status: ContactMessageRecord['status'], adminKey?: string): Promise<{ success: boolean }> {
    return fetchJson(`${API_BASE}/contact/messages/${id}`, {
      method: 'PATCH',
      headers: adminKey ? { Authorization: `Bearer ${adminKey}` } : {},
      body: JSON.stringify({ status })
    });
  },

  async deleteMessage(id: string, adminKey?: string): Promise<{ success: boolean }> {
    return fetchJson(`${API_BASE}/contact/messages/${id}`, {
      method: 'DELETE',
      headers: adminKey ? { Authorization: `Bearer ${adminKey}` } : {}
    });
  },

  // --- Telemetry & Site Stats Operations ---
  async getStats(): Promise<SiteStats> {
    return fetchJson<SiteStats>(`${API_BASE}/stats`, undefined, {
      pageViews: 1420,
      uniqueVisitors: 412,
      lastVisit: new Date().toISOString(),
      projectLikesTotal: 163
    });
  },

  async recordVisit(): Promise<{ success: boolean; stats: SiteStats }> {
    const hasVisited = localStorage.getItem('chan_has_visited');
    const isUnique = !hasVisited;
    if (isUnique) {
      localStorage.setItem('chan_has_visited', 'true');
    }
    return fetchJson(`${API_BASE}/stats/visit`, {
      method: 'POST',
      body: JSON.stringify({ isUnique })
    });
  },

  async resetStats(adminKey?: string): Promise<{ success: boolean; stats: SiteStats }> {
    return fetchJson(`${API_BASE}/stats/reset`, {
      method: 'POST',
      headers: adminKey ? { Authorization: `Bearer ${adminKey}` } : {}
    });
  },

  // --- Database Management Operations ---
  async exportDatabase(adminKey?: string): Promise<any> {
    return fetchJson(`${API_BASE}/database/export`, {
      headers: adminKey ? { Authorization: `Bearer ${adminKey}` } : {}
    });
  },

  async importDatabase(data: any, adminKey?: string): Promise<{ success: boolean; database: any }> {
    return fetchJson(`${API_BASE}/database/import`, {
      method: 'POST',
      headers: adminKey ? { Authorization: `Bearer ${adminKey}` } : {},
      body: JSON.stringify(data)
    });
  },

  async resetDatabase(adminKey?: string): Promise<{ success: boolean; message: string; database: any }> {
    return fetchJson(`${API_BASE}/database/reset`, {
      method: 'POST',
      headers: adminKey ? { Authorization: `Bearer ${adminKey}` } : {}
    });
  }
};
