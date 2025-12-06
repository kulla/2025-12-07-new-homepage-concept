import { Route, Routes } from 'react-router'
import StartScreen from './stories/StartScreen'

const links = {
  '/start-screen': 'Start Screen',
}

export default function App() {
  return (
    <Routes>
      <Route index element={<Navigation />} />
      <Route path="/start-screen" element={<StartScreen />} />
    </Routes>
  )
}

function Navigation() {
  return (
    <nav>
      {Object.entries(links).map(([href, name]) => (
        <a href={href}>{name}</a>
      ))}
    </nav>
  )
}
