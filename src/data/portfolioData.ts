import type { Project, SkillCategory, TimelineMilestone, SocialLink } from '../types';

export const PERSONAL_INFO = {
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

export const PROJECTS_DATA: Project[] = [
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
    metrics: [
      { label: 'Canvas Rendering', value: '60 FPS smooth pan/zoom' },
      { label: 'Node Capacity', value: '100+ simultaneous' },
      { label: 'Bundle Size', value: '82 KB gzip' }
    ],
    highlights: [
      'Custom Bezier curve rendering with pulsating directional current shaders',
      'Stateful execution graphs supporting branching logic and live previews',
      'Full dark-mode glassmorphism UI with keyboard navigation shortcuts',
      'Export workflows directly to JSON and API endpoint stubs'
    ]
  },
  {
    id: 'omnipulse-terminal',
    title: 'OmniPulse | Real-Time Market Terminal',
    tagline: 'High-density crypto & financial intelligence dashboard',
    description: 'A ultra-low-latency financial dashboard built for active traders. Includes real-time candlestick charts, live order book visualizers with bid/ask depth walls, multi-timeframe toggles, and instant position metrics.',
    image: '/projects/omnipulse.jpg',
    category: 'Fintech & Dashboards',
    tags: ['React.js', 'TypeScript', 'WebSockets', 'Canvas 2D', 'CSS Grid'],
    liveUrl: 'https://omnipulse-terminal.vercel.app',
    githubUrl: 'https://github.com/chan-stilllearning/omnipulse-trading-dashboard',
    featured: true,
    metrics: [
      { label: 'Tick Latency', value: '< 15ms' },
      { label: 'Data Points', value: '50k+ buffered' },
      { label: 'Accessibility', value: '100% WCAG AA' }
    ],
    highlights: [
      'High-performance Canvas 2D chart renderer with zero DOM thrashing',
      'Real-time simulated WebSocket feed with customizable volatility simulator',
      'Modular layout with drag-to-resize panel slots and compact density mode',
      'Keyboard trade execution shortcuts and customizable alert thresholds'
    ]
  },
  {
    id: 'digital-angkor-khmer',
    title: 'The Digital Angkor Project',
    tagline: '3D interactive heritage preservation & virtual museum showcase',
    description: 'An immersive digital preservation project honoring Cambodia’s ancient Khmer heritage. Features photogrammetry 3D scans of 12th-century Angkor Wat temple sculptures with holographic laser grid overlays, spatial coordinates, and interactive historical annotations.',
    image: '/projects/khmer-heritage.jpg',
    category: 'Cultural Heritage',
    tags: ['Three.js', 'WebGL', 'React', 'Audio Spatialization', 'TypeScript'],
    liveUrl: 'https://digital-angkor-showcase.vercel.app',
    githubUrl: 'https://github.com/chan-stilllearning/digital-angkor-heritage-3d',
    featured: true,
    metrics: [
      { label: 'Point Cloud', value: '1.1M points' },
      { label: 'Shader Pass', value: 'Hologram Wireframe' },
      { label: 'Localization', value: 'English & Khmer' }
    ],
    highlights: [
      'Custom vertex hologram shader with scanline sweeps and wireframe pulses',
      'Interactive point-of-interest markers displaying architectural history',
      'Ambient traditional spatial soundscape synchronized with camera proximity',
      'Dynamic LOD (Level of Detail) scaling for fluid playback on mobile phones'
    ]
  }
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'frontend-core',
    name: 'Frontend Core',
    icon: 'Code2',
    skills: [
      { name: 'React.js', level: 95, experience: '3+ yrs', highlight: true },
      { name: 'JavaScript (ESNext)', level: 96, experience: '4+ yrs', highlight: true },
      { name: 'TypeScript', level: 90, experience: '3 yrs', highlight: true },
      { name: 'HTML5 Semantic Web', level: 98, experience: '4+ yrs' },
      { name: 'Modern CSS & Animations', level: 95, experience: '4+ yrs' },
      { name: 'Tailwind CSS', level: 92, experience: '3 yrs' }
    ]
  },
  {
    id: '3d-creative',
    name: '3D & Creative Tech',
    icon: 'Boxes',
    skills: [
      { name: 'Three.js', level: 88, experience: '2+ yrs', highlight: true },
      { name: 'WebGL & Canvas 2D', level: 82, experience: '2 yrs' },
      { name: 'Shader Basics (GLSL)', level: 75, experience: '1.5 yrs' },
      { name: 'Camera & Lighting Math', level: 85, experience: '2 yrs' },
      { name: 'Blender & 3D Asset Prep', level: 78, experience: '2 yrs' }
    ]
  },
  {
    id: 'engineering-tools',
    name: 'Engineering & Workflow',
    icon: 'Cpu',
    skills: [
      { name: 'Vite & Modern Bundlers', level: 92, experience: '3 yrs' },
      { name: 'Git & GitHub Collaboration', level: 90, experience: '3+ yrs' },
      { name: 'Responsive & Mobile First', level: 98, experience: '4 yrs', highlight: true },
      { name: 'Web Performance & CWV', level: 90, experience: '2+ yrs' },
      { name: 'REST & API Integration', level: 92, experience: '3 yrs' },
      { name: 'Playwright & Testing', level: 82, experience: '1.5 yrs' }
    ]
  }
];

export const TIMELINE_DATA: TimelineMilestone[] = [
  {
    year: '2024 — Present',
    role: 'Lead Creative Frontend Developer',
    organization: 'Independent / Studio Collaborations',
    location: 'Phnom Penh, Cambodia & Remote',
    description: 'Engineering interactive 3D web applications, marketing showpieces, and SaaS interfaces for global clients. Focused on Three.js, React, and seamless user experiences.',
    tags: ['React', 'Three.js', 'TypeScript', 'Design Systems', 'Performance']
  },
  {
    year: '2023 — 2024',
    role: 'Frontend Web Developer',
    organization: 'Digital Innovation Hub',
    location: 'Phnom Penh, Cambodia',
    description: 'Developed modern web dashboards, responsive e-commerce portals, and component design systems. Optimized Core Web Vitals across client web assets resulting in 40% faster load times.',
    tags: ['JavaScript', 'Tailwind CSS', 'React.js', 'REST APIs', 'UI/UX']
  },
  {
    year: '2022 — 2023',
    role: 'Junior Web Developer & UI Designer',
    organization: 'Creative Tech Lab',
    location: 'Cambodia',
    description: 'Mastered semantic HTML5, modern CSS layouts (Flexbox/Grid), and JavaScript fundamentals. Built 15+ client landing pages and initiated 3D graphics research with Three.js.',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Figma to Code', 'Git']
  },
  {
    year: '2021 — 2022',
    role: 'Computer Science & Software Foundations',
    organization: 'Academic & Self-Directed Engineering',
    location: 'Cambodia',
    description: 'Intensive deep-dive into algorithms, data structures, browser rendering mechanics, DOM lifecycle, and modern web standards.',
    tags: ['Algorithms', 'Web Architecture', 'Git', 'Clean Code']
  }
];

export const SOCIAL_LINKS: SocialLink[] = [
  {
    platform: 'GitHub',
    url: 'https://github.com/chan-stilllearning',
    icon: 'Github',
    handle: '@chan-stilllearning'
  },
  {
    platform: 'LinkedIn',
    url: 'https://linkedin.com/in/chan-webdev',
    icon: 'Linkedin',
    handle: 'Chan Sovannarith'
  },
  {
    platform: 'Telegram',
    url: 'https://t.me/chan_frontend',
    icon: 'Send',
    handle: '@chan_frontend'
  },
  {
    platform: 'Email',
    url: 'mailto:chan.stilllearning@gmail.com',
    icon: 'Mail',
    handle: 'chan.stilllearning@gmail.com'
  }
];
