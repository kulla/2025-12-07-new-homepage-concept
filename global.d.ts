import type { Stage } from '@pixi/layers'
import type { PixiReactElementProps } from '@pixi/react'

declare module '@pixi/react' {
  interface PixiElements {
    stage: PixiReactElementProps<typeof Stage>
  }
}
