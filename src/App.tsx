import { Route, Routes } from 'react-router'
import StartScreen from './stories/StartScreen'
import RandomParticles from './stories/RandomParticles'

const links = {
  '/start-screen': 'Start Screen',
  '/random-particles': 'Animation: 01 Random Particles',
}

export default function App() {
  return (
    <Routes>
      <Route index element={<Navigation />} />
      <Route path="/start-screen" element={<StartScreen />} />
      <Route path="/random-particles" element={<RandomParticles />} />
    </Routes>
  )
}

function Navigation() {
  return (
    <nav>
      <ul>
        {Object.entries(links).map(([href, name]) => (
          <li>
            <a href={href}>{name}</a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
