import SectionLabel from '../components/SectionLabel'

export default function About() {
  return (
    <section style={{ paddingTop: '4rem' }}>
      <h1 style={heading}>about</h1>

      <div style={{ marginBottom: '3rem' }}>
        <p style={body}>
          I came to markets through history, which is perhaps the wrong entry
          point and certainly the more interesting one. The recurrence is what
          arrested me - not because human nature is immutable, but because the
          problems are. Coordination. Trust. Who absorbs the loss. The packaging
          changes. The problems are not the kind that get solved.
        </p>
        <p style={body}>
          This has made me congenitally suspicious of rupture narratives. Banks
          do fail, coins debase, trade routes collapse - I am not arguing for
          stasis. I am arguing that the stories civilizations tell about their
          disruptions are more interesting for what they conceal than what they
          reveal.
        </p>
        <p style={body}>
          Crypto and AI are receiving this treatment in full. I write about both
          - not to adjudicate the debates, which have grown tedious, but to ask
          what is actually displaced versus what is merely renamed. That question
          turns out to be philosophical before it is technical.
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
