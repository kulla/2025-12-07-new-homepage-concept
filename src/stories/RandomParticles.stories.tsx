import './style.css'

import { Application, Particle, ParticleContainer, Texture } from 'pixi.js'
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

  await app.init({ background: '#1099bb', resizeTo: window })

  document.body.appendChild(app.canvas)

  const { width, height } = app.screen

  const texture = Texture.from(
    'https://upload.wikimedia.org/wikipedia/commons/7/7a/Stone_14-512x512_%28Screaming_Brain_Studios%29.png',
  )

  const container = new ParticleContainer()

  app.stage.addChild(container)

  for (let i = 0; i < NUM_PARTICLES; i++) {
    container.addParticle(
      new Particle({
        texture,
        x: Math.random() * width,
        y: Math.random() * height,
        scaleX: 0.02 + Math.random() * 0.05,
        scaleY: 0.02 + Math.random() * 0.05,
        rotation: Math.random() * Math.PI * 2,
        tint: Math.random() * 0xffffff,
        alpha: 0.5 + Math.random() * 0.5,
      }),
    )
  }
  // Listen for animate update
  app.ticker.add((time) => {
    // Continuously rotate the container!
    // * use delta to create frame-independent transform *
    //container.rotation -= 0.01 * time.deltaTime
  })
}

function removeOldCanvases() {
  for (const child of document.body.children) {
    if (child.tagName.toLowerCase() === 'canvas') {
      document.body.removeChild(child)
    }
  }
}
