import fs from 'fs';
import path from 'path';

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
  metrics?: { label: string; value: string }[];
  highlights?: string[];
  likes?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface SkillItem {
  name: string;
  level: number;
  experience: string;
  iconName?: string;
  highlight?: boolean;
}

export interface SkillCategory {
  id: string;
  name: string;
  icon: string;
  skills: SkillItem[];
}

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

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  budget: string;
  message: string;
  ip?: string;
  userAgent?: string;
  createdAt: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
}

export interface SiteStats {
  pageViews: number;
  uniqueVisitors: number;
  lastVisit: string;
  projectLikesTotal: number;
}

export interface DatabaseSchema {
  profile: PersonalInfo;
  projects: Project[];
  skills: SkillCategory[];
  messages: ContactMessage[];
  stats: SiteStats;
}

const DEFAULT_PROFILE: PersonalInfo = {
  name: 'CHAN',
  fullName: 'Chan Sovannarith',
  role: 'Creative Frontend Web Developer',
  focus: '3D Web Experiences, Interactive UI & Performance',
  location: 'Phnom Penh, Cambodia',
  timezone: 'Asia/Phnom Penh',
  email: 'chan.stilllearning@gmail.com',
  telegram: '@chan_frontend',
  availability: 'Available for Remote Roles & High-Impact Projects',
  bioShort: 'Frontend developer passionate about building interactive, 3D-infused digital experiences with cinematic precision and clean code.',
  bioExtended: [
    'I am a creative frontend developer based in Cambodia, driven by the intersection of modern web engineering, fluid motion, and real-time 3D graphics.',
    'Over the past 3+ years, I have specialized in turning ambitious concepts into smooth 60fps web applications. My foundation is built upon deep mastery of HTML, modern CSS architectures, JavaScript (ESNext), React.js, and TypeScript, amplified by WebGL and Three.js.',
    'I believe that the web should not just present information—it should captivate and respond intuitively. Whether crafting spatial commerce interfaces or lightning-fast dashboards, I focus relentlessly on responsive precision, accessibility, and micro-interactions.'
  ],
  stats: [
    { label: 'Years Experience', value: '3+' },
    { label: 'Projects Completed', value: '18+' },
    { label: 'Core Web Vitals Avg', value: '98%' },
    { label: 'Client Satisfaction', value: '100%' },
  ]
};

const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'cyberstep-nexus',
    title: 'CyberStep | Spatial 3D Commerce',
    tagline: 'Interactive 3D product customization engine with WebGL lighting',
    description: 'A futuristic spatial e-commerce flagship prototype for custom cyberpunk sneakers. Built with Three.js and React, featuring real-time material shader swaps, dynamic studio lighting tracks, interactive 360° orbital exploration, and responsive checkout flows.',
    image: '/projects/nexus-3d.jpg',
    category: '3D & WebGL',
    tags: ['React', 'Three.js', 'WebGL', 'TypeScript', 'CSS Modules'],
    liveUrl: 'https://cyberstep-demo.vercel.app',
    githubUrl: 'https://github.com/chan-stilllearning/cyberstep-3d-commerce',
    featured: true,
    likes: 42,
    metrics: [
      { label: 'Frame Rate', value: '60 FPS stable' },
      { label: 'Load Time', value: '< 1.1s' },
      { label: 'Mesh Vertices', value: '48k optimized' }
    ],
    highlights: [
      'Procedural studio lighting with adjustable soft shadows and reflection probes',
      'Instant colorway switcher with metallic PBR material shader interpolation',
      'Mouse-driven dynamic focal depth and camera zoom constraints',
      'Mobile-responsive touch drag rotation with inertia damping'
    ]
  },
  {
    id: 'aetheria-ai',
    title: 'Aetheria | AI Node Prompt Studio',
    tagline: 'Visual node-based canvas for orchestrating multi-step AI reasoning pipelines',
    description: 'An advanced generative prompt engineering interface featuring an infinite interactive canvas, draggable LLM workflow nodes, live output stream monitors, and dynamic connection wires with neon pulses.',
    image: '/projects/aetheria.jpg',
    category: 'AI & Web Apps',
    tags: ['React', 'TypeScript', 'HTML5 Canvas', 'Tailwind CSS', 'State Machine'],
    liveUrl: 'https://aetheria-studio.vercel.app',
    githubUrl: 'https://github.com/chan-stilllearning/aetheria-prompt-canvas',
    featured: true,
    likes: 38,
    metrics: [
      { label: 'Canvas Nodes', value: '500+ @ 60fps' },
      { label: 'Latency', value: 'Sub-16ms render' },
      { label: 'State Sync', value: 'Real-time WebSocket' }
    ],
    highlights: [
      'Infinite zoom/pan hardware-accelerated canvas using custom matrix math',
      'Curved Bezier wires with directional pulse particles signaling active tokens',
      'Live syntax-highlighted code editor for prompt variables and function definitions',
      'Context-aware node palette with instant keyboard shortcut filtering'
    ]
  },
  {
    id: 'omnipulse-fintech',
    title: 'OmniPulse | Real-Time Crypto Terminal',
    tagline: 'High-frequency algorithmic trading dashboard with telemetry sparklines',
    description: 'A dark-mode cyberpunk financial workspace designed for active crypto asset tracking. Features sub-second candlestick updates, depth book visualizer, multi-wallet balance monitor, and sound-cued trade notifications.',
    image: '/projects/omnipulse.jpg',
    category: 'Fintech & Dashboards',
    tags: ['Next.js', 'TypeScript', 'Chart.js', 'WebSocket', 'Tailwind CSS'],
    liveUrl: 'https://omnipulse-terminal.vercel.app',
    githubUrl: 'https://github.com/chan-stilllearning/omnipulse-trading-ui',
    featured: true,
    likes: 29,
    metrics: [
      { label: 'Tick Rate', value: '100ms updates' },
      { label: 'Bundle Size', value: '78 kB gzip' },
      { label: 'Accessibility', value: '100% WCAG AAA' }
    ],
    highlights: [
      'Zero-lag order book visualizer with live volume depth heatmaps',
      'Synthesized Web Audio clicks and sound pings on executed limit orders',
      'Configurable multi-pane drag-and-drop dashboard layout with persistent local state',
      'Colorblind-accessible high-contrast neon theme switches'
    ]
  },
  {
    id: 'khmer-heritage-spatial',
    title: 'Angkor Legacy | Virtual Khmer Museum',
    tagline: 'Interactive 3D cultural preservation gallery of ancient Khmer temple artifacts',
    description: 'A tribute to Cambodian cultural heritage, bringing 12th-century Angkor Wat stone sculptures and bas-relief carvings into interactive 3D WebGL space. Includes historical audio commentary and bilingual Khmer-English inscriptions.',
    image: '/projects/khmer-heritage.jpg',
    category: 'Cultural Heritage',
    tags: ['Three.js', 'React', 'Spatial Audio', 'GLTF/Draco', 'Khmer Typography'],
    liveUrl: 'https://angkor-legacy.vercel.app',
    githubUrl: 'https://github.com/chan-stilllearning/angkor-virtual-museum',
    featured: true,
    likes: 54,
    metrics: [
      { label: '3D Scan Quality', value: 'Draco 10:1' },
      { label: 'Bilingual Support', value: 'Khmer & English' },
      { label: 'Cultural Assets', value: '14 artifacts' }
    ],
    highlights: [
      'Draco-compressed high-detail 3D photogrammetry scans of Bayon temple faces',
      'Spatial 3D audio reverberation matching stone corridor acoustic profiles',
      'Dual typography system gracefully pairing Khmer Unicode with modern Syne sans',
      'Light/Shadow simulation matching real-world Siem Reap solar azimuth positions'
    ]
  }
];

const DEFAULT_SKILLS: SkillCategory[] = [
  {
    id: 'frontend-core',
    name: 'Frontend Core',
    icon: 'Code2',
    skills: [
      { name: 'React.js', level: 95, experience: '3+ yrs', highlight: true },
      { name: 'JavaScript (ESNext)', level: 96, experience: '4+ yrs', highlight: true },
      { name: 'TypeScript', level: 92, experience: '3 yrs', highlight: true },
      { name: 'HTML5 Semantic Web', level: 98, experience: '4+ yrs' },
      { name: 'Modern CSS & Animations', level: 96, experience: '4+ yrs', highlight: true },
      { name: 'Tailwind CSS', level: 94, experience: '3 yrs' }
    ]
  },
  {
    id: 'creative-3d',
    name: '3D & Creative Tech',
    icon: 'Box',
    skills: [
      { name: 'Three.js', level: 88, experience: '2+ yrs', highlight: true },
      { name: 'WebGL & Canvas 2D', level: 82, experience: '2 yrs' },
      { name: 'Shader Basics (GLSL)', level: 75, experience: '1.5 yrs' },
      { name: 'Camera & Lighting Math', level: 85, experience: '2 yrs' },
      { name: 'Blender & 3D Asset Prep', level: 78, experience: '2 yrs' },
      { name: 'Framer Motion / GSAP', level: 90, experience: '3 yrs', highlight: true }
    ]
  },
  {
    id: 'engineering-workflow',
    name: 'Engineering & Workflow',
    icon: 'Cpu',
    skills: [
      { name: 'Vite / Webpack / Turbopack', level: 92, experience: '3 yrs' },
      { name: 'Git & GitHub Collaboration', level: 94, experience: '4 yrs' },
      { name: 'REST & GraphQL APIs', level: 88, experience: '3 yrs' },
      { name: 'Performance & Web Vitals', level: 94, experience: '3 yrs', highlight: true },
      { name: 'Responsive Mobile Precision', level: 98, experience: '4 yrs', highlight: true },
      { name: 'Web Audio API', level: 82, experience: '2 yrs' }
    ]
  }
];

class Database {
  private filePath: string;
  private data: DatabaseSchema;

  constructor() {
    const isNetlify = !!process.env.NETLIFY || !!process.env.AWS_LAMBDA_FUNCTION_NAME;
    const baseDir = isNetlify ? '/tmp' : path.join(process.cwd(), 'data');

    if (!fs.existsSync(baseDir)) {
      try {
        fs.mkdirSync(baseDir, { recursive: true });
      } catch {
        // ignore if already exists or ephemeral
      }
    }

    this.filePath = path.join(baseDir, 'portfolio_db.json');
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    if (fs.existsSync(this.filePath)) {
      try {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          profile: parsed.profile || DEFAULT_PROFILE,
          projects: parsed.projects || DEFAULT_PROJECTS,
          skills: parsed.skills || DEFAULT_SKILLS,
          messages: parsed.messages || [],
          stats: parsed.stats || {
            pageViews: 1420,
            uniqueVisitors: 412,
            lastVisit: new Date().toISOString(),
            projectLikesTotal: 163
          }
        };
      } catch (err) {
        console.warn('Failed to parse database file, re-initializing with defaults', err);
      }
    }

    const initial: DatabaseSchema = {
      profile: DEFAULT_PROFILE,
      projects: DEFAULT_PROJECTS,
      skills: DEFAULT_SKILLS,
      messages: [],
      stats: {
        pageViews: 1420,
        uniqueVisitors: 412,
        lastVisit: new Date().toISOString(),
        projectLikesTotal: 163
      }
    };
    this.saveData(initial);
    return initial;
  }

  private saveData(data: DatabaseSchema): void {
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving database to file:', err);
    }
  }

  private persist(): void {
    this.saveData(this.data);
  }

  // --- Profile CMS Operations ---
  public getProfile(): PersonalInfo {
    return this.data.profile;
  }

  public updateProfile(updated: Partial<PersonalInfo>): PersonalInfo {
    this.data.profile = { ...this.data.profile, ...updated };
    this.persist();
    return this.data.profile;
  }

  // --- Projects CMS Operations ---
  public getProjects(): Project[] {
    return this.data.projects;
  }

  public getProject(id: string): Project | undefined {
    return this.data.projects.find((p) => p.id === id);
  }

  public createProject(project: Omit<Project, 'id'> & { id?: string }): Project {
    const id = project.id || project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newProj: Project = {
      ...project,
      id,
      likes: project.likes || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.projects.unshift(newProj);
    this.persist();
    return newProj;
  }

  public updateProject(id: string, updates: Partial<Project>): Project | null {
    const index = this.data.projects.findIndex((p) => p.id === id);
    if (index === -1) return null;
    this.data.projects[index] = {
      ...this.data.projects[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.persist();
    return this.data.projects[index];
  }

  public deleteProject(id: string): boolean {
    const prevLen = this.data.projects.length;
    this.data.projects = this.data.projects.filter((p) => p.id !== id);
    const deleted = this.data.projects.length < prevLen;
    if (deleted) this.persist();
    return deleted;
  }

  public likeProject(id: string): number | null {
    const proj = this.getProject(id);
    if (!proj) return null;
    proj.likes = (proj.likes || 0) + 1;
    this.data.stats.projectLikesTotal = (this.data.stats.projectLikesTotal || 0) + 1;
    this.persist();
    return proj.likes;
  }

  // --- Skills CMS Operations ---
  public getSkills(): SkillCategory[] {
    return this.data.skills;
  }

  public updateSkills(skills: SkillCategory[]): SkillCategory[] {
    this.data.skills = skills;
    this.persist();
    return this.data.skills;
  }

  // --- Messages & Contact Operations ---
  public getMessages(): ContactMessage[] {
    return this.data.messages;
  }

  public createMessage(msg: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>): ContactMessage {
    const newMessage: ContactMessage = {
      ...msg,
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      status: 'unread'
    };
    this.data.messages.unshift(newMessage);
    this.persist();
    return newMessage;
  }

  public updateMessageStatus(id: string, status: ContactMessage['status']): boolean {
    const msg = this.data.messages.find((m) => m.id === id);
    if (!msg) return false;
    msg.status = status;
    this.persist();
    return true;
  }

  // --- Stats & Telemetry Operations ---
  public getStats(): SiteStats {
    return this.data.stats;
  }

  public recordVisit(isUnique: boolean = false): SiteStats {
    this.data.stats.pageViews += 1;
    if (isUnique) {
      this.data.stats.uniqueVisitors += 1;
    }
    this.data.stats.lastVisit = new Date().toISOString();
    this.persist();
    return this.data.stats;
  }
}

export const db = new Database();
