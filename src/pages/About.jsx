import SectionLabel from '../components/SectionLabel'

export default function About() {
  return (
    <section style={{ paddingTop: '4rem' }}>
      <h1 style={heading}>about</h1>

      <div style={{ marginBottom: '3rem' }}>
        <p style={body}>
          Markets are older than writing. The mechanisms moving capital today were
          invented by people who never saw a screen — and most of the innovation
          since has been in the packaging, not the logic.
        </p>
        <p style={body}>
          I write about that continuity. How coordination happens, how it breaks,
          and what survives every reinvention of the infrastructure underneath it.
          Five thousand years of market structure. Same game, different hardware.
        </p>
        <p style={body}>
          Also writing about AI — not the discourse, but the actual restructuring
          happening underneath it. What gets displaced, what gets created,
          and why most people are wrong about both.
        </p>
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <SectionLabel>writing on</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[
            ['substack', 'https://incoherentyapping.substack.com', 'incoherentyapping'],
            ['github', 'https://github.com/Tradfibaby', 'Tradfibaby'],
          ].map(([platform, href, label]) => (
            <div key={platform} style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem' }}>
              <span style={{ color: '#444', width: '90px', flexShrink: 0 }}>{platform}</span>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#888', textDecoration: 'underline', textDecorationColor: '#333', textUnderlineOffset: '3px' }}
              >
                {label} ↗
              </a>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionLabel>contact</SectionLabel>
        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem' }}>
          <span style={{ color: '#444', width: '90px', flexShrink: 0 }}>email</span>
          <a
            href="mailto:tradfibaby@proton.me"
            style={{ color: '#888', textDecoration: 'underline', textDecorationColor: '#333', textUnderlineOffset: '3px' }}
          >
            tradfibaby@proton.me
          </a>
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
  maxWidth: '540px',
}
