export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  tags: string[];
  category: '3D & WebGL' | 'AI & Web Apps' | 'Fintech & Dashboards' | 'Cultural Heritage';
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
  likes?: number;
  metrics?: { label: string; value: string }[];
  highlights?: string[];
}

export interface SkillCategory {
  id: string;
  name: string;
  icon: string;
  skills: SkillItem[];
}

export interface SkillItem {
  name: string;
  level: number; // 0 - 100
  experience: string;
  iconName?: string;
  highlight?: boolean;
}

export interface TimelineMilestone {
  year: string;
  role: string;
  organization: string;
  location: string;
  description: string;
  tags: string[];
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
  handle: string;
}

export type SceneTheme = 'cyan' | 'violet' | 'emerald' | 'amber';
export type GeometryType = 'torusKnot' | 'icosahedron' | 'quantumSphere';
