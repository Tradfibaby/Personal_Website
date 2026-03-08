import { useState } from 'react'
import { projects } from '../data/projects'
import { TextGenerateEffect } from '../components/ui/text-generate-effect'

export default function Projects() {
  return (
    <section style={{ paddingTop: '4rem' }}>
      <h1 style={heading}>projects</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {projects.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>
    </section>
  )
}

function ProjectCard({ project }) {
  const [hovered, setHovered] = useState(false)

  return (
    <a
      href={project.appStore ?? project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="wireframe-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block',
        border: `1px solid ${hovered ? '#333' : '#1e1e1e'}`,
        padding: '1.1rem',
        cursor: 'pointer',
        position: 'relative',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        boxShadow: hovered ? '0 0 20px rgba(80, 60, 200, 0.18)' : '0 0 12px rgba(80, 60, 200, 0.07)',
        textDecoration: 'none',
        backgroundColor: 'var(--bg)',
      }}
    >
      <div className="wireframe-card-inner" aria-hidden="true" />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <span style={{ color: '#e0e0e0', fontSize: '0.9rem' }}>{project.name}</span>
          <span style={{ color: '#444', fontSize: '0.9rem' }}>↗</span>
        </div>

        <TextGenerateEffect
          words={project.description}
          style={{ color: '#4a4a4a', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}
          duration={0.4}
          filter={false}
        />

        {project.appStore && project.url && (
          <div style={{ marginTop: '0.75rem' }}>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#444', fontSize: '0.9rem', letterSpacing: '0.05em' }}
              onClick={e => e.stopPropagation()}
            >
              github ↗
            </a>
          </div>
        )}
        {project.pubDev && (
          <div style={{ marginTop: '0.75rem' }}>
            <a
              href={project.pubDev}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#444', fontSize: '0.9rem', letterSpacing: '0.05em' }}
              onClick={e => e.stopPropagation()}
            >
              pub.dev ↗
            </a>
          </div>
        )}
    </a>
  )
}

const heading = {
  fontSize: '1.1rem',
  fontWeight: '400',
  color: '#f0f0f0',
  marginBottom: '1.5rem',
  backgroundColor: 'var(--bg)',
  display: 'inline-block',
  padding: '0.1rem 0',
}
