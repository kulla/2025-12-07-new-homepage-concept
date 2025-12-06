import './style.css'

import { Application, Assets, Particle, ParticleContainer } from 'pixi.js'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect } from 'react'

const NUM_PARTICLES = 1000

const meta = {
  title: 'Animation/Random Particles',
  component: Animation,
} satisfies Meta<typeof Animation>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

function Animation() {
  useEffect(() => void initAnimation(), [])

  return null
}

async function initAnimation() {
  removeOldCanvases()

  const app = new Application()

  await app.init({ background: 'white', resizeTo: window })

  document.body.appendChild(app.canvas)

  const { width, height } = app.screen

  const texture = await Assets.load(
    'https://i0.wp.com/www.fantasticmaps.com/wp-content/uploads/2012/02/grunge.png?w=258',
  )

  const container = new ParticleContainer()

  app.stage.addChild(container)
  app.ticker.maxFPS = 30

  const particles: ParticleObject[] = []

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

    particles.push({
      particle,
      vx: Math.random() * 1 - 0.5,
      vy: Math.random() * 1 - 0.5,
    })

    container.addParticle(particle)
  }

  app.ticker.add((ticker) => {
    for (const p of particles) {
      p.particle.x += p.vx * ticker.deltaTime
      p.particle.y += p.vy * ticker.deltaTime

      if (p.particle.x > width || p.particle.x < 0) p.vx *= -1
      if (p.particle.y > height || p.particle.y < 0) p.vy *= -1
    }
  })
}

interface ParticleObject {
  particle: Particle
  vx: number
  vy: number
}

function removeOldCanvases() {
  for (const child of document.body.children) {
    if (child.tagName.toLowerCase() === 'canvas') {
      document.body.removeChild(child)
    }
  }
}
