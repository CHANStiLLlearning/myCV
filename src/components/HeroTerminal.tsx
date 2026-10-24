import React, { useState } from 'react';
import type { SceneTheme } from '../types';
import { PERSONAL_INFO } from '../data/portfolioData';
import { sounds } from '../utils/soundEffects';
import { Copy, Check, Terminal, Cpu, Zap, Code2 } from 'lucide-react';

interface HeroTerminalProps {
  currentTheme: SceneTheme;
  onThemeChange: (theme: SceneTheme) => void;
}

export const HeroTerminal: React.FC<HeroTerminalProps> = ({ currentTheme, onThemeChange }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'stack' | 'status'>('profile');

  const profileCode = `// KEO KIMCHAN — Creative Frontend Web Developer
export const developer: FrontendArchitect = {
  name: "${PERSONAL_INFO.fullName}",
  alias: "${PERSONAL_INFO.name}",
  role: "${PERSONAL_INFO.role}",
  location: "${PERSONAL_INFO.location}",
  experience: "3+ Years Crafting High-Speed Web",
  corePrinciples: [
    "Pixel-perfect responsive precision",
    "Fluid micro-interactions & 60fps animations",
    "Clean, scalable TypeScript architectures",
    "Accessible, SEO-optimized web standards"
  ],
  status: "Available for ambitious frontend projects"
};`;

  const stackCode = `{
  "frontend": ["React.js", "TypeScript", "Next.js", "Tailwind CSS"],
  "styling": ["Vanilla CSS3", "CSS Modules", "Modern Flex & Grid"],
  "tooling": ["Vite", "Git & GitHub", "Playwright", "ESLint"],
  "performance": {
    "coreWebVitals": "98%+",
    "lighthousePerformance": "100/100",
    "gpuEfficiency": "Zero WebGL Overhead"
  }
}`;

  const statusCode = `[SYSTEM_INITIALIZED]
> Engine: Vite 8.3.5 (Client Runtime)
> Memory Footprint: Optimized (Ultra-Low CPU/RAM)
> WebGL Acceleration: Disabled (Native 60fps CSS)
> Location: Phnom Penh, Cambodia (UTC+7)
> Current Status: Ready to build high-performance web applications.`;

  const getCodeContent = () => {
    switch (activeTab) {
      case 'stack':
        return stackCode;
      case 'status':
        return statusCode;
      default:
        return profileCode;
    }
  };

  const handleCopy = () => {
    sounds.playSuccess();
    navigator.clipboard.writeText(getCodeContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const themes: SceneTheme[] = ['cyan', 'violet', 'emerald', 'amber'];

  return (
    <div className="hero-terminal-card interactive-card">
      {/* Terminal Title Bar */}
      <div className="terminal-header">
        <div className="terminal-dots">
          <span className="dot dot-red" />
          <span className="dot dot-yellow" />
          <span className="dot dot-green" />
        </div>

        {/* Tab Selection */}
        <div className="terminal-tabs">
          <button
            type="button"
            className={`terminal-tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => {
              sounds.playClick();
              setActiveTab('profile');
            }}
          >
            <Code2 size={12} />
            <span>Developer.ts</span>
          </button>
          <button
            type="button"
            className={`terminal-tab ${activeTab === 'stack' ? 'active' : ''}`}
            onClick={() => {
              sounds.playClick();
              setActiveTab('stack');
            }}
          >
            <Cpu size={12} />
            <span>Stack.json</span>
          </button>
          <button
            type="button"
            className={`terminal-tab ${activeTab === 'status' ? 'active' : ''}`}
            onClick={() => {
              sounds.playClick();
              setActiveTab('status');
            }}
          >
            <Terminal size={12} />
            <span>Diagnostics.log</span>
          </button>
        </div>

        {/* Copy Button */}
        <button
          type="button"
          className="terminal-copy-btn"
          onClick={handleCopy}
          title="Copy code to clipboard"
          aria-label="Copy snippet"
        >
          {copied ? <Check size={13} className="text-emerald" /> : <Copy size={13} />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* Code Editor Window */}
      <div className="terminal-code-body">
        <pre className="terminal-pre">
          <code>
            {activeTab === 'profile' && (
              <>
                <span className="c-comment">// KEO KIMCHAN — Creative Frontend Web Developer</span>{'\n'}
                <span className="c-keyword">export const</span> <span className="c-var">developer</span>: <span className="c-type">FrontendArchitect</span> = {'{'}{'\n'}
                {'  '}<span className="c-prop">name</span>: <span className="c-string">"{PERSONAL_INFO.fullName}"</span>,{'\n'}
                {'  '}<span className="c-prop">alias</span>: <span className="c-string">"{PERSONAL_INFO.name}"</span>,{'\n'}
                {'  '}<span className="c-prop">role</span>: <span className="c-string">"{PERSONAL_INFO.role}"</span>,{'\n'}
                {'  '}<span className="c-prop">location</span>: <span className="c-string">"{PERSONAL_INFO.location}"</span>,{'\n'}
                {'  '}<span className="c-prop">experience</span>: <span className="c-string">"3+ Years Crafting High-Speed Web"</span>,{'\n'}
                {'  '}<span className="c-prop">corePrinciples</span>: [{'\n'}
                {'    '}<span className="c-string">"Pixel-perfect responsive precision"</span>,{'\n'}
                {'    '}<span className="c-string">"Fluid micro-interactions &amp; 60fps animations"</span>,{'\n'}
                {'    '}<span className="c-string">"Clean, scalable TypeScript architectures"</span>,{'\n'}
                {'    '}<span className="c-string">"Accessible, SEO-optimized web standards"</span>{'\n'}
                {'  '}],{'\n'}
                {'  '}<span className="c-prop">status</span>: <span className="c-string">"Available for ambitious projects"</span>{'\n'}
                {'}'};
              </>
            )}

            {activeTab === 'stack' && (
              <>
                {'{'}{'\n'}
                {'  '}<span className="c-prop">"frontend"</span>: [<span className="c-string">"React.js"</span>, <span className="c-string">"TypeScript"</span>, <span className="c-string">"Next.js"</span>, <span className="c-string">"Tailwind CSS"</span>],{'\n'}
                {'  '}<span className="c-prop">"styling"</span>: [<span className="c-string">"Vanilla CSS3"</span>, <span className="c-string">"CSS Modules"</span>, <span className="c-string">"Modern Flex &amp; Grid"</span>],{'\n'}
                {'  '}<span className="c-prop">"tooling"</span>: [<span className="c-string">"Vite"</span>, <span className="c-string">"Git &amp; GitHub"</span>, <span className="c-string">"Playwright"</span>, <span className="c-string">"ESLint"</span>],{'\n'}
                {'  '}<span className="c-prop">"performance"</span>: {'{'}{'\n'}
                {'    '}<span className="c-prop">"coreWebVitals"</span>: <span className="c-string">"98%+"</span>,{'\n'}
                {'    '}<span className="c-prop">"lighthousePerformance"</span>: <span className="c-string">"100/100"</span>,{'\n'}
                {'    '}<span className="c-prop">"gpuEfficiency"</span>: <span className="c-string">"Zero WebGL Overhead"</span>{'\n'}
                {'  '}{'}'}{'\n'}
                {'}'}
              </>
            )}

            {activeTab === 'status' && (
              <>
                <span className="c-comment">[SYSTEM_INITIALIZED]</span>{'\n'}
                <span className="c-string">&gt; Engine: Vite 8.3.5 (Client Runtime)</span>{'\n'}
                <span className="c-string">&gt; Memory Footprint: Optimized (Ultra-Low CPU/RAM)</span>{'\n'}
                <span className="c-string">&gt; WebGL Acceleration: Disabled (Native 60fps CSS)</span>{'\n'}
                <span className="c-string">&gt; Location: Phnom Penh, Cambodia (UTC+7)</span>{'\n'}
                <span className="c-string">&gt; Current Status: Ready to build high-performance web applications.</span>
              </>
            )}
          </code>
        </pre>
      </div>

      {/* Terminal Footer Bar with Theme Switcher & Efficiency Badge */}
      <div className="terminal-footer">
        <div className="terminal-status-indicator">
          <Zap size={13} className="text-emerald pulse" />
          <span>Ultra-Low CPU • Zero GPU Lag</span>
        </div>

        {/* Theme Picker HUD */}
        <div className="terminal-theme-picker">
          <span className="theme-picker-label">Accent Theme:</span>
          <div className="theme-pills">
            {themes.map((th) => (
              <button
                key={th}
                type="button"
                className={`theme-dot ${th} ${currentTheme === th ? 'active' : ''}`}
                onClick={() => {
                  sounds.playClick();
                  onThemeChange(th);
                }}
                title={`Select ${th.toUpperCase()} theme`}
                aria-label={`Theme ${th}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
