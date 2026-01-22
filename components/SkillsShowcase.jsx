'use client';

import { useState } from 'react';

const skills = [
  {
    id: 'blog-design-optimization',
    name: 'Blog Design Optimization',
    version: '1.0.0',
    description: 'Comprehensive blog design guide with 45+ rules for readability, engagement, and conversions. Covers typography, mobile, performance, SEO, accessibility, and visual design.',
    author: 'Sebastiano',
    license: 'MIT',
    tags: ['blog', 'design', 'optimization', 'seo', 'accessibility'],
    npmCommand: 'npm install -g blog-design-skills',
    runCommand: 'blog-design-skills',
    features: [
      'Typography & Readability rules',
      'Mobile & Responsive guidelines',
      'Performance optimization',
      'SEO & Metadata best practices',
      'Engagement & UX features',
      'Accessibility checklist',
    ],
    icon: '📐',
  },
];

function CopyButton({ text, label = 'Copy' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      className="skill-copy-btn"
      onClick={handleCopy}
      aria-label={copied ? 'Copied!' : label}
    >
      {copied ? (
        <>
          <span className="copy-icon">✓</span>
          <span>Copied!</span>
        </>
      ) : (
        <>
          <span className="copy-icon">📋</span>
          <span>{label}</span>
        </>
      )}
    </button>
  );
}

function SkillCard({ skill }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="skill-card">
      <div className="skill-card-header">
        <span className="skill-icon">{skill.icon}</span>
        <div className="skill-title-group">
          <h2 className="skill-name">{skill.name}</h2>
          <span className="skill-version">v{skill.version}</span>
        </div>
      </div>

      <p className="skill-description">{skill.description}</p>

      <div className="skill-tags">
        {skill.tags.map((tag) => (
          <span key={tag} className="skill-tag">{tag}</span>
        ))}
      </div>

      <div className="skill-install-section">
        <label className="skill-install-label">
          <span className="label-icon">⚡</span> Quick Install
        </label>
        <div className="skill-code-block">
          <code>{skill.npmCommand}</code>
          <CopyButton text={skill.npmCommand} />
        </div>
      </div>

      <div className="skill-install-section">
        <label className="skill-install-label">
          <span className="label-icon">▶️</span> Run Command
        </label>
        <div className="skill-code-block">
          <code>{skill.runCommand}</code>
          <CopyButton text={skill.runCommand} />
        </div>
      </div>

      <button
        className="skill-expand-btn"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        {expanded ? '▲ Hide Features' : '▼ Show Features'}
      </button>

      {expanded && (
        <div className="skill-features">
          <h3 className="skill-features-title">Features</h3>
          <ul className="skill-features-list">
            {skill.features.map((feature, i) => (
              <li key={i}>
                <span className="feature-check">✓</span>
                {feature}
              </li>
            ))}
          </ul>
          <div className="skill-meta">
            <span><strong>Author:</strong> {skill.author}</span>
            <span><strong>License:</strong> {skill.license}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SkillsShowcase() {
  return (
    <div className="skills-grid">
      {skills.map((skill) => (
        <SkillCard key={skill.id} skill={skill} />
      ))}
    </div>
  );
}
