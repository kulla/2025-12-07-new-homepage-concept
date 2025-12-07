import {
  Application,
  Assets,
  Particle as PixiParticle,
  ParticleContainer,
} from 'pixi.js'
import { useEffect } from 'react'

const NUM_PARTICLES = 1000

export default function Animation() {
  useEffect(() => void initAnimation(), [])

  return null
}

class Particle extends PixiParticle {
  vx: number = 0
  vy: number = 0
}

async function initAnimation() {
  removeOldCanvases()

  const app = new Application()

  // Settings as in https://codesandbox.io/p/sandbox/pixi-graphics-post-attempt-4-hlgs33?file=%2Fsrc%2Findex.ts&from-embed
  await app.init({
    background: 'white',
    resizeTo: window,
    antialias: true,
    //autoDensity: true,
    //resolution: window.devicePixelRatio,
  })

  document.body.appendChild(app.canvas)

  const { width, height } = app.screen

  const texture = await Assets.load(
    'https://i0.wp.com/www.fantasticmaps.com/wp-content/uploads/2012/02/grunge.png?w=258',
  )

  const container = new ParticleContainer()

  app.stage.addChild(container)
  app.ticker.maxFPS = 30

  const particles: Particle[] = []

  for (let i = 0; i < NUM_PARTICLES; i++) {
    const scale = 0.02 + Math.random() * 0.05
    const particle = new Particle({
      texture,
      x: Math.random() * width,
      y: Math.random() * height,
      scaleX: scale + Math.random() * 0.01,
      scaleY: scale + Math.random() * 0.01,
      rotation: Math.random() * Math.PI * 2,
      tint: Math.random() * 0xffffff,
      alpha: 1,
    })

    particle.vx = Math.random() * 1 - 0.5
    particle.vy = Math.random() * 1 - 0.5
  }

  container.addParticle(...particles)

  app.ticker.add((ticker) => {
    for (const particle of particles) {
      particle.x += particle.vx * ticker.deltaTime
      particle.y += particle.vy * ticker.deltaTime

      if (particle.x > width || particle.x < 0) particle.vx *= -1
      if (particle.y > height || particle.y < 0) particle.vy *= -1
    }
  })
}

function removeOldCanvases() {
  for (const child of document.body.children) {
    if (child.tagName.toLowerCase() === 'canvas') {
      document.body.removeChild(child)
    }
  }
}
