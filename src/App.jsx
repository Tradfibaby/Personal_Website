import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './pages/Home'
import Writing from './pages/Writing'
import Post from './pages/Post'
import Projects from './pages/Projects'
import Portfolio from './pages/Portfolio'
import CursorEffect from './components/ui/cursor-effect'
import TypographyField from './components/universe/TypographyField'

// The character-grid cursor effect is the default background, but a few routes now carry their
// own field: home (the universe), the portfolio listing (the HUD grid), and the writing listing
// (the tol.is-style typography blueprint).
function BackgroundFX() {
  const { pathname } = useLocation()
  if (pathname === '/' || pathname === '/portfolio') return null
  if (pathname === '/writing') return <TypographyField />
  return <CursorEffect />
}

export default function App() {
  const [navReady, setNavReady] = useState(false)
  return (
    <BrowserRouter>
      <BackgroundFX />
      <Nav navReady={navReady} />
      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '0 1.5rem 5rem', position: 'relative', zIndex: 1 }}>
        <Routes>
          <Route path="/" element={<Home onNavReady={() => setNavReady(true)} />} />
          <Route path="/writing" element={<Writing />} />
          <Route path="/writing/:slug" element={<Post />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/portfolio/:slug" element={<Portfolio />} />
          <Route path="/open-source" element={<Projects />} />
          <Route path="/projects" element={<Navigate to="/open-source" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}
