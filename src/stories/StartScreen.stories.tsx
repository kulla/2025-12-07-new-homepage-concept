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
    <div className="bg-white w-full min-h-screen flex items-center justify-center">
      <div className="flex items-center gap-10">
        <div className="flex-shrink-0">
          <img
            src="https://avatars.githubusercontent.com/u/1327215?v=4"
            alt="Portrait of Kulla"
            className="w-40 h-40 rounded-full object-cover"
          />
        </div>

        <div className="max-w-80">
          <h1 className="text-3xl">
            <span className="font-light inline-block mb-3">Hi there! 👋</span>
            <br />
            <span className="font-extrabold inline-block">I'm Kulla,</span>
            <br />
            <span className="font-medium inline-block">
              software developer and educator...
            </span>
            <br />
          </h1>
        </div>
      </div>
    </div>
  )
}
