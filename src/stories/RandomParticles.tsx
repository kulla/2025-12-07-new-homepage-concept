import {
  Application,
  Assets,
  Particle as PixiParticle,
  ParticleContainer,
} from 'pixi.js'
import { useEffect, useRef } from 'react'

const NUM_PARTICLES = 5000

export default function Animation() {
  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    console.log('Initializing animation')

    if (divRef.current == null) return

    const abortController = new AbortController()

    void initAnimation({ abortController, div: divRef.current })

    return () => {
      abortController.abort()
    }

    // Make sure to run this effect after hot reloads
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [divRef, initAnimation])

  return <div id="animation" ref={divRef}></div>
}

class Particle extends PixiParticle {
  vx: number = 0
  vy: number = 0
}

async function initAnimation({
  abortController,
  div,
}: {
  abortController: AbortController
  div: HTMLDivElement
}) {
  const app = new Application()

  await app.init({
    background: 'white',
    resizeTo: window,
    antialias: true,
    autoDensity: true,
    resolution: window.devicePixelRatio,
  })

  div.appendChild(app.canvas)

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

    particles.push(particle)
  }

  container.addParticle(...particles)

  app.ticker.add((ticker) => {
    if (abortController.signal.aborted && div.contains(app.canvas)) {
      div.removeChild(app.canvas)
      app.destroy()
      return
    }

    for (const particle of particles) {
      particle.x += particle.vx * ticker.deltaTime
      particle.y += particle.vy * ticker.deltaTime

      if (particle.x > width || particle.x < 0) particle.vx *= -1
      if (particle.y > height || particle.y < 0) particle.vy *= -1
    }
  })
}
