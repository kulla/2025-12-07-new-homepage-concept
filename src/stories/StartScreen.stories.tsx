import './style.css'
import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Screens/StartScreen',
  component: StartScreen,
} satisfies Meta<typeof StartScreen>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

function StartScreen() {
  return <div className="font-mono">Start Screen Component</div>
}
