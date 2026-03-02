import SectionLabel from '../components/SectionLabel'

export default function About() {
  return (
    <section style={{ paddingTop: '4rem' }}>
      <h1 style={heading}>about</h1>

      <div style={{ marginBottom: '3rem' }}>
        <p style={body}>
          I have spent the better part of the last few years exploring what I
          can only describe as deliberate madness - investment banking, crypto
          from NFTs to memecoins, trading public and private markets, and now
          AI. The through-line was never the asset. It was always the question
          of what new technology does to the people inside it: who adapts, who
          rationalises, who convinces themselves this time is different.
        </p>
        <p style={body}>
          I have been genuinely fortunate - raised and mentored by people far
          smarter and more generous than I had any right to expect. Most of my
          time has been in finance, tech, and AI, though the most useful inputs
          rarely come from those fields. Disaster films, dating shows, ancient
          history. Human nature stays legible if you know where to look.
        </p>
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <SectionLabel>currently</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
          {[
            {
              text: 'AI displacement and the closing escape route',
              href: 'https://incoherentyapping.substack.com/p/the-structural-destruction-of-white',
            },
            {
              text: 'privacy infrastructure that doesn\'t ask for your data',
              href: 'https://github.com/Riten-Zone/Anon-Snap',
            },
            {
              text: 'what happens when AI optimises for its own survival',
              href: 'https://incoherentyapping.substack.com/p/what-would-you-do-to-survive',
            },
            {
              text: 'human adaptation speed in the AI age',
              href: null,
            },
            {
              text: 'five thousand years of market making - the function never changes',
              href: 'https://incoherentyapping.substack.com/p/dancing-with-volatility-abc',
            },
            {
              text: 'mobile apps and the on-chain liquidity explosion',
              href: null,
            },
          ].map(({ text, href }) =>
            href ? (
              <a
                key={text}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#888', textDecoration: 'underline', textDecorationColor: '#333', textUnderlineOffset: '3px' }}
              >
                {text} ↗
              </a>
            ) : (
              <span key={text} style={{ color: '#555' }}>{text}</span>
            )
          )}
        </div>
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
          <span style={{ color: '#444', width: '90px', flexShrink: 0 }}>x</span>
          <a
            href="https://x.com/tradfibaby"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#888', textDecoration: 'underline', textDecorationColor: '#333', textUnderlineOffset: '3px' }}
          >
            @tradfibaby ↗
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
