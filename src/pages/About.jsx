import SectionLabel from '../components/SectionLabel'

export default function About() {
  return (
    <section style={{ paddingTop: '4rem' }}>
      <h1 style={heading}>about</h1>

      <div style={{ marginBottom: '3rem' }}>
        <p style={body}>
          Hey, I'm tradfibaby. I write code, build side projects, and occasionally
          write about things I find interesting.
        </p>
        <p style={body}>
          I'm interested in open source software, distributed systems, and the
          intersection of technology and how people actually use it.
        </p>
        <p style={body}>
          When I'm not building things I'm usually reading, or going down rabbit holes
          on the internet.
        </p>
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <SectionLabel>stack</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {stack.map(([category, items]) => (
            <div key={category} style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem' }}>
              <span style={{ color: '#444', width: '90px', flexShrink: 0 }}>{category}</span>
              <span style={{ color: '#888' }}>{items}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionLabel>elsewhere</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[
            ['github', 'https://github.com/Tradfibaby', 'Tradfibaby'],
            ['email', 'mailto:tradfibaby@proton.me', 'tradfibaby@proton.me'],
          ].map(([platform, href, label]) => (
            <div key={platform} style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem' }}>
              <span style={{ color: '#444', width: '90px', flexShrink: 0 }}>{platform}</span>
              <a
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                style={{ color: '#888', textDecoration: 'underline', textDecorationColor: '#333', textUnderlineOffset: '3px' }}
              >
                {label} ↗
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const heading = {
  fontSize: '1.1rem',
  fontWeight: '400',
  color: '#f0f0f0',
  marginBottom: '2rem',
}

const body = {
  color: '#888',
  fontSize: '0.9rem',
  lineHeight: 1.9,
  marginBottom: '1.25rem',
  maxWidth: '560px',
}

const stack = [
  ['languages', 'JavaScript, TypeScript, Python'],
  ['frontend', 'React, Vite, Tailwind'],
  ['tools', 'Git, VS Code, Linux'],
]
