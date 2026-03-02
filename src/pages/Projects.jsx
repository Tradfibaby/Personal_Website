import { useEffect, useState } from 'react'
import SectionLabel from '../components/SectionLabel'
import { projects } from '../data/projects'

export default function Projects() {
  const [stars, setStars] = useState({})

  useEffect(() => {
    projects.forEach(async (project) => {
      try {
        const repoPath = project.url.replace('https://github.com/', '')
        const res = await fetch(`https://api.github.com/repos/${repoPath}`)
        if (res.ok) {
          const data = await res.json()
          setStars(prev => ({ ...prev, [project.name]: data.stargazers_count }))
        }
      } catch {
        // silently fail — stars just won't show
      }
    })
  }, [])

  return (
    <section style={{ paddingTop: '4rem' }}>
      <h1 style={heading}>projects</h1>
      <SectionLabel>selected work</SectionLabel>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1px' }}>
        {projects.map((project) => (
          <ProjectCard
            key={project.name}
            project={project}
            stars={stars[project.name]}
          />
        ))}
      </div>
    </section>
  )
}

function ProjectCard({ project, stars }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: `1px solid ${hovered ? '#333' : '#1e1e1e'}`,
        padding: '1.25rem',
        cursor: 'pointer',
        transition: 'border-color 0.15s',
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <span style={{ color: '#e0e0e0', fontSize: '0.85rem' }}>{project.name}</span>
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#444', fontSize: '0.85rem', lineHeight: 1 }}
          onClick={e => e.stopPropagation()}
        >
          ↗
        </a>
      </div>

      <p style={{ color: '#555', fontSize: '0.8rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
        {project.description}
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {project.language && (
            <span style={{ color: '#444', fontSize: '0.72rem', letterSpacing: '0.05em' }}>
              {project.language}
            </span>
          )}
          {typeof stars === 'number' && (
            <span style={{ color: '#444', fontSize: '0.72rem' }}>⭐ {stars}</span>
          )}
        </div>
        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#444', fontSize: '0.72rem', letterSpacing: '0.05em' }}
            onClick={e => e.stopPropagation()}
          >
            demo ↗
          </a>
        )}
      </div>
    </div>
  )
}

const heading = {
  fontSize: '1.1rem',
  fontWeight: '400',
  color: '#f0f0f0',
  marginBottom: '2rem',
}
