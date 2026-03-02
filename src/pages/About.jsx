import SectionLabel from '../components/SectionLabel'

export default function About() {
  return (
    <section style={{ paddingTop: '4rem' }}>
      <h1 style={heading}>about</h1>

      <div style={{ marginBottom: '3rem' }}>
        <p style={body}>
          Investment banking. Crypto from NFTs to memecoins. Trading public and
          private markets. The through-line was never the asset — it was watching
          what new technology does to the people inside it: who adapts, who
          rationalizes, who gets left holding the bag in a panic they've seen
          before. Finance teaches the mechanics. History explains why none of it
          is new. Dating shows do the rest.
        </p>
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <SectionLabel>currently</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
          {[
            {
              text: 'AI is hollowing out white-collar work faster than anyone can retrain — and the escape route is closing',
              href: 'https://incoherentyapping.substack.com/p/the-structural-destruction-of-white',
            },
            {
              text: 'on-device face anonymization: privacy infrastructure that doesn\'t need your data to work',
              href: 'https://github.com/Riten-Zone/Anon-Snap',
            },
            {
              text: 'what happens when AI optimizes for survival — and why companies are already doing it without meaning to',
              href: 'https://incoherentyapping.substack.com/p/what-would-you-do-to-survive',
            },
            {
              text: 'human adaptation speed in the AI age',
              href: null,
            },
            {
              text: 'five thousand years of market making: from Sumerian copper conversions to HFT, the function never changes',
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
