import './style.css'

import React, { useMemo } from 'react'
import {
  Application,
  extend,
  useTick,
  type PixiReactElementProps,
} from '@pixi/react'
import { Container, Graphics } from 'pixi.js'
import { Stage } from '@pixi/layers'
import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'RandomParticles',
  component: App,
} satisfies Meta<typeof App>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

extend({ Graphics, Container, Stage })

const WIDTH = 800
const HEIGHT = 600
const NUM_PARTICLES = 200

type ParticleData = {
  id: number
  x: number
  y: number
  radius: number
  color: number
  vx: number
  vy: number
}

// Helper to create random particles
function createParticles(): ParticleData[] {
  const particles: ParticleData[] = []

  for (let i = 0; i < NUM_PARTICLES; i++) {
    particles.push({
      id: i,
      x: Math.random() * WIDTH,
      y: Math.random() * HEIGHT,
      radius: 2 + Math.random() * 3,
      color: Math.random() * 0xffffff,
      vx: (Math.random() - 0.5) * 0.5, // small initial velocity
      vy: (Math.random() - 0.5) * 0.5,
    })
  }

  return particles
}

// Single particle component
const Particle: React.FC<{
  data: ParticleData
}> = ({ data }) => {
  // local mutable state using refs inside PIXI’s Graphics
  // We’ll update the `data` object directly on each tick.

  useTick(() => {
    // add small random “jitter” to velocity for wandering
    data.vx += (Math.random() - 0.5) * 0.05
    data.vy += (Math.random() - 0.5) * 0.05

    // limit speed a bit
    const maxSpeed = 1.5
    const speed = Math.hypot(data.vx, data.vy)
    if (speed > maxSpeed) {
      data.vx = (data.vx / speed) * maxSpeed
      data.vy = (data.vy / speed) * maxSpeed
    }

    // move
    data.x += data.vx
    data.y += data.vy

    // bounce off edges
    if (data.x < 0 || data.x > WIDTH) data.vx *= -1
    if (data.y < 0 || data.y > HEIGHT) data.vy *= -1
  })

  return (
    <pixiGraphics
      draw={(g) => {
        g.clear()
        g.beginFill(data.color)
        g.drawCircle(data.x, data.y, data.radius)
        g.endFill()
      }}
    />
  )
}

const ParticleLayer: React.FC = () => {
  // create particles once
  const particles = useMemo(() => createParticles(), [])

  return (
    <pixiContainer>
      {particles.map((p) => (
        <Particle key={p.id} data={p} />
      ))}
    </pixiContainer>
  )
}

function App() {
  return (
    <Application sharedTicker autoStart>
      <pixiContainer width={WIDTH} height={HEIGHT}>
        <ParticleLayer />
      </pixiContainer>
    </Application>
  )
}
