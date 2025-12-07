import './animation.css'

import {
  Application,
  Assets,
  Particle as PixiParticle,
  ParticleContainer,
  Texture,
} from 'pixi.js'
import { useEffect, useRef } from 'react'

const NUM_PARTICLES = 30000
const HEART_URL = '/public/vision2.png'
const STIFTNESS = 0.03
const DAMPING = 0.3

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

  return (
    <div
      id="animation"
      ref={divRef}
      className="w-full h-screen flex justify-center items-center"
    >
      <div className="bg-white/85 w-10/12 max-w-[800px] h-10/12 max-h-[600px] z-10 p-5 overflow-y-scroll rounded-xl shadow-lg">
        <p>
          Dolorum omnis harum laborum consequatur dolorem aperiam rerum dolore.
          Ut nihil et consectetur. Hic commodi adipisci omnis quaerat accusamus
          veritatis.
        </p>
        <p>
          Nostrum sed porro sint deleniti. Non error quaerat amet sed sunt
          dolores. Nisi dolor nam quo occaecati veniam. Temporibus voluptas est
          a maxime consequuntur. Maiores illo voluptatem ipsa tenetur magnam aut
          est.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </div>
    </div>
  )
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

  await Assets.load(HEART_URL)

  const heart = Texture.from(HEART_URL)
  const targetPoints = samplePointsFromTexture({
    app,
    texture: heart,
    n: NUM_PARTICLES,
  })

  const container = new ParticleContainer()

  app.stage.addChild(container)
  app.ticker.maxFPS = 30

  const particles: Particle[] = []

  for (let i = 0; i < NUM_PARTICLES; i++) {
    const particle = new Particle({
      texture,
      x: Math.random() * width,
      y: Math.random() * height,
      scaleX: 0.02,
      scaleY: 0.02,
      rotation: Math.random() * Math.PI * 2,
      tint: Math.random() * 0xffffff,
      alpha: 1,
    })

    particle.vx = Math.random() * 2 - 0.5
    particle.vy = Math.random() * 2 - 0.5

    particles.push(particle)
  }

  container.addParticle(...particles)

  app.ticker.add((ticker) => {
    if (abortController.signal.aborted && div.contains(app.canvas)) {
      div.removeChild(app.canvas)
      app.destroy()
      return
    }

    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i]
      const target = targetPoints[i]

      const ax = (target.x - particle.x) * STIFTNESS
      const ay = (target.y - particle.y) * STIFTNESS

      particle.vx = (particle.vx + ax) * DAMPING
      particle.vy = (particle.vy + ay) * DAMPING

      particle.x += particle.vx * ticker.deltaTime
      particle.y += particle.vy * ticker.deltaTime

      if (particle.x > width || particle.x < 0) particle.vx *= -1
      if (particle.y > height || particle.y < 0) particle.vy *= -1
    }
  })
}

interface TargetPoint {
  x: number
  y: number
}

function samplePointsFromTexture(args: {
  app: Application
  texture: Texture
  n: number
}): TargetPoint[] {
  const { app, texture, n } = args

  const { pixels } = app.renderer.extract.pixels(texture)
  const width = texture.width
  const height = texture.height

  const numPixels = width * height

  if (pixels.length !== numPixels * 4) {
    throw new Error(`Unexpected pixel buffer length`)
  }

  // 2. Build weight array based on luminance (brightness)
  const weights = new Float32Array(numPixels)
  let totalWeight = 0

  for (let i = 0; i < numPixels; i++) {
    const r = pixels[i * 4 + 0]
    const g = pixels[i * 4 + 1]
    const b = pixels[i * 4 + 2]

    const weight = Math.max(255 - (0.299 * r + 0.587 * g + 0.114 * b), 0)

    weights[i] = weight
    totalWeight += weight
  }

  if (totalWeight === 0) {
    throw new Error('All pixel weights are zero. Check your texture content.')
  }

  // 3. Normalize weights to probabilities & build CDF
  const cdf = new Float32Array(numPixels)
  let cumulative = 0

  for (let i = 0; i < numPixels; i++) {
    cumulative += weights[i] / totalWeight
    cdf[i] = cumulative
  }

  // numerical issues might mean cdf[numPixels - 1] is slightly != 1,
  // but that’s okay as long as it's very close.

  // 4. Helper: binary search in CDF for a uniform random u in [0,1)
  function findIndexInCdf(u: number): number {
    let low = 0
    let high = numPixels - 1

    while (low < high) {
      const mid = (low + high) >>> 1 // bitwise floor((low+high)/2)
      if (u <= cdf[mid]) {
        high = mid
      } else {
        low = mid + 1
      }
    }
    return low
  }

  // 5. Draw n samples
  const samples: TargetPoint[] = []

  for (let k = 0; k < n; k++) {
    const u = Math.random()
    const idx = findIndexInCdf(u)

    const py = Math.floor(idx / width)
    const px = idx % width

    samples.push({ x: px + 0.5, y: py + 0.5 })
  }

  return samples
}
