import { Route, Routes } from 'react-router'
import StartScreen from './stories/StartScreen'
import RandomParticles from './stories/RandomParticles'
import FirstMorphAnimation from './stories/FirstMorphAnimation'

const links = {
  '/start-screen': 'Start Screen',
  '/random-particles': 'Animation: 01 Random Particles',
  '/first-morph-animation': 'Animation: 02 First Morph Animation',
}

export default function App() {
  return (
    <Routes>
      <Route index element={<Navigation />} />
      <Route path="/start-screen" element={<StartScreen />} />
      <Route path="/random-particles" element={<RandomParticles />} />
      <Route path="/first-morph-animation" element={<FirstMorphAnimation />} />
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
