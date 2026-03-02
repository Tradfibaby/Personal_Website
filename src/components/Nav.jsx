import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'home' },
  { to: '/writing', label: 'writing' },
  { to: '/projects', label: 'projects' },
]

export default function Nav() {
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
        <span style={{ color: '#f0f0f0', fontSize: '0.85rem' }}>tradfibaby</span>
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
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}
