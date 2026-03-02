import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './pages/Home'
import Writing from './pages/Writing'
import Post from './pages/Post'
import Projects from './pages/Projects'

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '0 1.5rem 5rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/writing" element={<Writing />} />
          <Route path="/writing/:slug" element={<Post />} />
          <Route path="/projects" element={<Projects />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}
