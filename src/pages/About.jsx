import SectionLabel from '../components/SectionLabel'

export default function About() {
  return (
    <section style={{ paddingTop: '4rem' }}>
      <h1 style={heading}>about</h1>

      <div style={{ marginBottom: '3rem' }}>
        <p style={body}>
          Markets are older than writing. The grain contracts of Ur, the merchant
          networks of the Silk Road, the leveraged speculation of Amsterdam's
          exchange — these are not ancestors of modern finance. They are modern
          finance, wearing different fabric. Each generation of infrastructure
          believes it has invented something. None of them have.
        </p>
        <p style={body}>
          What I find interesting is the residue. When Rome collapsed, the trade
          routes did not. When empires dissolve, the accounting survives. History
          read carefully is not a catalogue of disruptions — it is a long
          demonstration that human coordination is more durable than the political
          vessels that temporarily contain it. I write about that persistence.
        </p>
        <p style={body}>
          AI belongs to this lineage. Not the civilizational rupture the discourse
          insists upon, but another reinvention of infrastructure around the same
          imperatives — control, leverage, advantage, fear. The interesting
          question has never been what changes. It is what refuses to. Study
          enough history and the future becomes, if not predictable, at least
          legible. Most people have not studied enough history.
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
