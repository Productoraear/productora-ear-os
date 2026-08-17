
// This file assumes a Storybook setup is present.
// Run 'npx storybook@latest init' to scaffold the .storybook folder.

import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from '../Icon';

const meta = {
  title: 'Components/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
    backgrounds: {
        default: 'dark',
    }
  },
  tags: ['autodocs'],
  argTypes: {
    className: { control: 'text' },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

// Example showing the Calendar Icon path
export const Calendar: Story = {
  args: {
    className: 'w-10 h-10 text-blue-500',
    children: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18" />
    ),
  },
};

export const AnimatedHover: Story = {
    args: {
      className: 'w-12 h-12 text-white',
      children: (
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 1-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 1 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 1 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 1-2.846.813a4.5 4.5 0 0 1-3.09 3.09Z" />
      ),
    },
    render: (args) => (
        <div className="group p-4 bg-zinc-900 border border-zinc-700 rounded-xl cursor-pointer">
            <Icon {...args} />
        </div>
    )
  };
