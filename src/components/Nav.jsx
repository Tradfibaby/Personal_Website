import { NavLink, useLocation } from 'react-router-dom'
import { TypewriterEffect } from './ui/typewriter-effect'

const links = [
  { to: '/', label: 'home' },
  { to: '/writing', label: 'writing' },
  { to: '/projects', label: 'projects' },
]

export default function Nav({ navReady }) {
  const location = useLocation()
  const onHome = location.pathname === '/'
  const logoVisible  = !onHome || navReady
  const linksVisible = !onHome || navReady

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 10,
      background: '#080808',
      borderBottom: '1px solid #181818',
    }}>
      <div style={{
        maxWidth: '720px',
        margin: '0 auto',
        padding: '1rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <NavLink to="/" style={{
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none',
          opacity: logoVisible ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}>
          <img src="/favicon.svg" alt="t." style={{ width: '16px', height: '16px' }} />
        </NavLink>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              style={({ isActive }) => ({
                color: isActive ? '#f0f0f0' : '#555',
                fontSize: '0.8rem',
                letterSpacing: '0.05em',
                transition: 'color 0.15s',
              })}
            >
              <TypewriterEffect text={label} enabled={linksVisible} />
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}
