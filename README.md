# CHAN — 3D Creative Frontend Developer Portfolio

> An Awwwards-style, high-performance, interactive 3D developer portfolio crafted with **React + Vite + TypeScript + Three.js + WebGL**.

---

## 🚀 Live Demo & Highlights

- **Cinematic 3D Hero Sculpture**: Real-time WebGL interactive metallic torus knot, crystal matrix, and quantum orb with particle starfield, orbital rings, mouse parallax, and live FPS telemetry.
- **Dynamic Cyber Themes**: Real-time switching between **Neon Cyan**, **Cyber Violet**, **Matrix Emerald**, and **Sunset Amber** with synchronous lighting and CSS token updates.
- **Interactive 3D Skills Constellation**: Floating Three.js polyhedron matrix responding to active technical domain categories.
- **3D Tilt Project Cards**: Perspective card tilt with realistic projects honoring modern spatial e-commerce, AI node studios, financial trading terminals, and Cambodian digital cultural heritage.
- **Deep-Dive Project Modal & Curriculum Vitae**: Interactive project architecture breakdown and a dedicated, printable/downloadable CV with plain-text export.
- **Procedural Web Audio Sound FX**: Sub-millisecond auditory UI feedback powered purely by the Web Audio API (with zero external audio assets).
- **Phnom Penh Live Local Clock**: Real-time Indochina Time (ICT, UTC+7) clock in the footer.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React 19 + Vite** | High-performance component runtime and blazing-fast HMR bundler |
| **TypeScript** | Strict type safety, clean data models, and developer ergonomics |
| **Three.js** | Interactive 3D WebGL scenes, lighting, PBR physical materials, and particle systems |
| **Vanilla CSS Design System** | Custom cyberpunk design tokens, glassmorphism, responsive grids, and keyframe animations |
| **Web Audio API** | Procedural sound synthesizer for tactile micro-interactions |
| **Lucide Icons** | Minimalist modern SVG iconography |
| **Canvas Confetti** | Celebratory particle bursts upon contact form submission |

---

## 📁 Project Architecture

```
myCV/
├── public/
│   ├── projects/               # High-resolution project showcase imagery
│   │   ├── nexus-3d.jpg
│   │   ├── aetheria.jpg
│   │   ├── omnipulse.jpg
│   │   └── khmer-heritage.jpg
│   └── profile.jpg             # Chan's developer portrait
├── src/
│   ├── components/
│   │   ├── canvas/
│   │   │   ├── Hero3DCanvas.tsx    # Three.js 3D Hero Scene with interactive HUD controls
│   │   │   └── Skills3DCanvas.tsx  # Interactive 3D constellation polyhedron
│   │   ├── icons.tsx               # Dedicated SVG icons (GitHub, LinkedIn)
│   │   ├── Navbar.tsx              # Floating glassmorphic island navigation
│   │   ├── Hero.tsx                # Cinematic landing section & telemetry metrics
│   │   ├── About.tsx               # Split narrative & Core Engineering Principles
│   │   ├── Skills.tsx              # Categorized skills matrix with proficiency bars
│   │   ├── Projects.tsx            # 3D tilt project cards & category filter
│   │   ├── ProjectModal.tsx        # Project deep-dive architecture modal
│   │   ├── Experience.tsx          # Glowing milestone timeline
│   │   ├── Contact.tsx             # Validated inquiry form & contact chips
│   │   ├── Footer.tsx              # Phnom Penh local clock & back-to-top control
│   │   ├── CustomCursor.tsx        # Smooth trailing cursor follower
│   │   └── ResumeModal.tsx         # Printable & exportable Curriculum Vitae modal
│   ├── data/
│   │   └── portfolioData.ts        # Centralized editable content (Projects, Skills, Timeline, Bio)
│   ├── types/
│   │   └── index.ts                # TypeScript interfaces
│   ├── utils/
│   │   └── soundEffects.ts         # Web Audio procedural sound synthesizer
│   ├── App.tsx                     # Top-level application layout
│   ├── index.css                   # Master cyberpunk design tokens & styles
│   └── main.tsx                    # Application entrypoint
├── index.html                      # HTML5 semantic structure & typography links
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## ⚡ Quick Start

### 1. Prerequisites
Make sure you have Node.js (v18+) installed.

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173/`.

### 4. Build for Production
```bash
npm run build
```
The optimized bundle will be generated in `dist/`.

---

## 🎨 Customizing Content

All personal data, projects, skills, timeline milestones, and contact information are centralized in [`src/data/portfolioData.ts`](./src/data/portfolioData.ts):

- **Update Bio & Profile**: Modify `PERSONAL_INFO` (name, location, roles, stats).
- **Add or Edit Projects**: Add entries to `PROJECTS_DATA` with your own titles, descriptions, metrics, tags, and image paths.
- **Adjust Skills**: Update `SKILL_CATEGORIES` with your exact proficiencies and experience.
- **Change Socials**: Add or modify your links in `SOCIAL_LINKS`.

---

## 🌐 Deploying to Vercel or Netlify

### Deploy with Vercel CLI
```bash
npm i -g vercel
vercel
```
*Or import your GitHub repository directly in the [Vercel Dashboard](https://vercel.com) with framework preset set to **Vite**.*

### Deploy with Netlify
```bash
npm run build
npx netlify deploy --prod --dir=dist
```
*Or drag-and-drop the `dist/` directory into [Netlify Drop](https://app.netlify.com/drop).*

---

## 📄 License
MIT © Chan Sovannarith
