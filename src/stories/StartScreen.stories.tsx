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
  return (
    <div className="bg-white w-full min-h-screen border-2 flex items-center justify-center">
      <div className="flex items-center gap-10">
        <div className="flex-shrink-0">
          <img
            src="https://avatars.githubusercontent.com/u/1327215?v=4"
            alt="Portrait of Kulla"
            className="w-40 h-40 rounded-full object-cover"
          />
        </div>

        <div>
          <p className="text-3xl md:text-4xl font-semibold mb-2">
            Hi there! <span className="inline-block">👋</span>
          </p>
          <p className="text-2xl md:text-3xl font-light">
            I am Kulla,
            <br />
            <span className="font-normal">
              software developer and educator …
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
