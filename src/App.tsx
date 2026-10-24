import { useState, useEffect } from 'react';
import type { SceneTheme, Project } from './types';
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

export function App() {
  const [currentTheme, setCurrentTheme] = useState<SceneTheme>('cyan');
  const [isResumeOpen, setIsResumeOpen] = useState<boolean>(false);
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  // Apply theme data attribute to body
  useEffect(() => {
    document.body.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

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
      />

      {/* Main Sections */}
      <main id="main-content">
        <Hero
          currentTheme={currentTheme}
          onThemeChange={setCurrentTheme}
          onOpenResume={() => setIsResumeOpen(true)}
        />
        <About theme={currentTheme} />
        <Skills theme={currentTheme} />
        <Projects
          theme={currentTheme}
          onSelectProject={(project) => setActiveModalProject(project)}
        />
        <Experience theme={currentTheme} />
        <Contact theme={currentTheme} />
      </main>

      {/* Footer with Phnom Penh Local Clock */}
      <Footer />

      {/* Full Curriculum Vitae / Resume Viewer Modal */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />

      {/* Project Details Modal */}
      <ProjectModal
        project={activeModalProject}
        onClose={() => setActiveModalProject(null)}
      />
    </div>
  );
}

export default App;
