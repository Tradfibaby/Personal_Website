import { useState } from 'react'
import SectionLabel from '../components/SectionLabel'
import { projects } from '../data/projects'

export default function Projects() {
  return (
    <section style={{ paddingTop: '4rem' }}>
      <h1 style={heading}>projects</h1>
      <SectionLabel>selected work</SectionLabel>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1px' }}>
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
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block',
        border: `1px solid ${hovered ? '#333' : '#1e1e1e'}`,
        padding: '1.25rem',
        cursor: 'pointer',
        transition: 'border-color 0.15s',
        textDecoration: 'none',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <span style={{ color: '#e0e0e0', fontSize: '0.85rem' }}>{project.name}</span>
        <span style={{ color: '#444', fontSize: '0.85rem', lineHeight: 1 }}>↗</span>
      </div>

      <p style={{ color: '#555', fontSize: '0.8rem', lineHeight: 1.7, margin: 0 }}>
        {project.description}
      </p>

      {project.appStore && project.url && (
        <div style={{ marginTop: '1rem' }}>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#444', fontSize: '0.72rem', letterSpacing: '0.05em' }}
            onClick={e => e.stopPropagation()}
          >
            github ↗
          </a>
        </div>
      )}
      {project.pubDev && (
        <div style={{ marginTop: '1rem' }}>
          <a
            href={project.pubDev}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#444', fontSize: '0.72rem', letterSpacing: '0.05em' }}
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
  marginBottom: '2rem',
}
