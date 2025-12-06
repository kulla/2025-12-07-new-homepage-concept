import './style.css'

import { Application, Assets, Particle, ParticleContainer } from 'pixi.js'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect } from 'react'

const NUM_PARTICLES = 1000

const meta = {
  title: 'RandomParticles',
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

    container.addParticle(particle)
    particles.push(particle)
  }
  // Listen for animate update
  app.ticker.add((ticker) => {
    for (const particle of particles) {
      particle.rotation += 0.1 * ticker.deltaTime
      particle.x += (Math.random() - 0.5) * 2
      particle.y += (Math.random() - 0.5) * 2

      // Wrap around screen edges
      if (particle.x < 0) particle.x = width
      else if (particle.x > width) particle.x = 0
      if (particle.y < 0) particle.y = height
      else if (particle.y > height) particle.y = 0
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
