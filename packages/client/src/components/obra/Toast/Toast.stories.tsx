import type { Meta, StoryObj } from '@storybook/react';
import { Toast } from './Toast';
import { ToastProvider, useToast } from './ToastProvider';
import { Button } from '@/components/obra/Button';

const meta: Meta<typeof Toast> = {
  component: Toast,
  title: 'Obra/Toast',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Toast>;

export const Success: Story = {
  args: {
    id: 'success-toast',
    type: 'success',
    title: 'Success! Enjoy your buttery toast!',
    message: 'New case "#1234 - Customer Issue" has been successfully created.',
    duration: 10000,
  },
};

export const Deleted: Story = {
  args: {
    id: 'deleted-toast',
    type: 'deleted',
    title: 'Deleted',
    message: '"Customer Issue #1234" case has been successfully deleted.',
    duration: 10000,
  },
};

export const WithQueuePosition: Story = {
  args: {
    id: 'queued-toast',
    type: 'success',
    title: 'Success! Enjoy your buttery toast!',
    message: 'New case "#1235 - Another Issue" has been successfully created.',
    queuePosition: '1/3',
    duration: 10000,
  },
};

export const ShortMessage: Story = {
  args: {
    id: 'short-toast',
    type: 'success',
    title: 'Success!',
    message: 'Case created.',
    duration: 10000,
  },
};

function ToastDemoComponent() {
  const { showToast } = useToast();

  const handleShowSuccess = () => {
    showToast({
      type: 'success',
      title: 'Success! Enjoy your buttery toast!',
      message: 'New case "#1234 - Customer Issue" has been successfully created.',
    });
  };

  const handleShowDeleted = () => {
    showToast({
      type: 'deleted',
      title: 'Deleted',
      message: '"Customer Issue #1234" case has been successfully deleted.',
    });
  };

  const handleShowMultiple = () => {
    for (let i = 1; i <= 3; i++) {
      setTimeout(() => {
        showToast({
          type: 'success',
          title: 'Success!',
          message: `Toast notification ${i} added to queue.`,
        });
      }, i * 500);
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center p-8">
      <h2 className="text-lg font-bold mb-4">Toast Demo</h2>
      <Button onClick={handleShowSuccess}>Show Success Toast</Button>
      <Button onClick={handleShowDeleted} variant="destructive">
        Show Deleted Toast
      </Button>
      <Button onClick={handleShowMultiple} variant="secondary">
        Show Multiple Toasts (Queue)
      </Button>
      <p className="text-sm text-gray-600 mt-4 max-w-md text-center">
        Click buttons to show toasts at the bottom of the viewport. Multiple toasts will be queued
        and shown one at a time with a counter.
      </p>
    </div>
  );
}

export const Interactive: Story = {
  render: () => (
    <ToastProvider>
      <ToastDemoComponent />
    </ToastProvider>
  ),
};
