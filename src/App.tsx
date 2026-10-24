import { useState, useEffect } from 'react';
import type { SceneTheme, Project, SkillCategory } from './types';
import { PERSONAL_INFO, PROJECTS_DATA, SKILL_CATEGORIES } from './data/portfolioData';
import { CustomCursor } from './components/CustomCursor';
import { VideoBackground } from './components/VideoBackground';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Experience } from './components/Experience';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { ResumeModal } from './components/ResumeModal';
import { ProjectModal } from './components/ProjectModal';
import { AdminModal } from './components/AdminModal';
import { portfolioApi, type PersonalInfo } from './services/api';

export function App() {
  const [currentTheme, setCurrentTheme] = useState<SceneTheme>('cyan');
  const [isResumeOpen, setIsResumeOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  // Live dynamic states controlled by CMS Admin Dashboard
  const [profile, setProfile] = useState<PersonalInfo>(PERSONAL_INFO as PersonalInfo);
  const [projects, setProjects] = useState<Project[]>(PROJECTS_DATA);
  const [skills, setSkills] = useState<SkillCategory[]>(SKILL_CATEGORIES);

  // Apply theme data attribute to body
  useEffect(() => {
    document.body.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  // Initial load from backend API & visit recording
  useEffect(() => {
    portfolioApi.recordVisit().catch(() => {});
    portfolioApi.getProfile().then(setProfile).catch(() => {});
    portfolioApi.getProjects().then(setProjects).catch(() => {});
    portfolioApi.getSkills().then(setSkills).catch(() => {});
  }, []);

  // Global Admin Shortcut: Ctrl + Shift + A or Cmd + Shift + A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="portfolio-app">
      {/* Cinematic Coding Video Background */}
      <VideoBackground theme={currentTheme} />

      {/* Interactive Custom Cursor */}
      <CustomCursor />

      {/* Floating Glassmorphic Navigation */}
      <Navbar
        currentTheme={currentTheme}
        onThemeChange={setCurrentTheme}
        onOpenAdmin={() => setIsAdminOpen(true)}
        profile={profile}
      />

      {/* Main Sections */}
      <main id="main-content">
        <Hero
          currentTheme={currentTheme}
          onThemeChange={setCurrentTheme}
          onOpenResume={() => setIsResumeOpen(true)}
          profile={profile}
        />
        <About theme={currentTheme} profile={profile} />
        <Skills theme={currentTheme} skills={skills} />
        <Projects
          theme={currentTheme}
          projects={projects}
          onSelectProject={(project) => setActiveModalProject(project)}
        />
        <Experience theme={currentTheme} />
        <Contact theme={currentTheme} profile={profile} />
      </main>

      {/* Footer with Phnom Penh Local Clock */}
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} profile={profile} />

      {/* Full Curriculum Vitae / Resume Viewer Modal */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
        profile={profile}
      />

      {/* Project Details Modal */}
      <ProjectModal
        project={activeModalProject}
        onClose={() => setActiveModalProject(null)}
      />

      {/* Portfolio CMS & Inquiries Admin Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onProfileUpdate={setProfile}
        onProjectsUpdate={setProjects}
        onSkillsUpdate={setSkills}
      />
    </div>
  );
}

export default App;
