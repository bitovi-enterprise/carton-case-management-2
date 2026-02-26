# Toast

Toast notification system for displaying temporary feedback messages to users with queue management and animations.

## Features

- **Multiple Types**: Success (with toast emoji 🍞) and Deleted (with trash icon)
- **Queue Management**: FIFO queue with max 5 toasts, displays one at a time with counter (e.g., "1/3")
- **Auto-Dismiss**: Configurable duration (default 4 seconds)
- **Manual Dismiss**: Dismiss button that overrides auto-dismiss timer
- **Animations**: Counter-clockwise swirl entrance with pink sparkles for success toasts
- **Positioning**: Fixed bottom-center with high z-index to appear above all UI elements
- **Responsive**: Adapts to mobile and desktop viewports

## Usage

### Setup Toast Provider

Wrap your application with `ToastProvider` at the root level:

\`\`\`tsx
import { ToastProvider } from '@/components/obra/Toast';

function App() {
  return (
    <ToastProvider>
      {/* Your app content */}
    </ToastProvider>
  );
}
\`\`\`

### Show Toasts

Use the `useToast` hook to show toasts from any component:

\`\`\`tsx
import { useToast } from '@/components/obra/Toast';

function MyComponent() {
  const { showToast } = useToast();

  const handleSuccess = () => {
    showToast({
      type: 'success',
      title: 'Success! Enjoy your buttery toast!',
      message: 'New case "#1234 - Issue" has been successfully created.',
    });
  };

  const handleDelete = () => {
    showToast({
      type: 'deleted',
      title: 'Deleted',
      message: '"Case #1234" case has been successfully deleted.',
    });
  };

  return (
    <>
      <button onClick={handleSuccess}>Create Case</button>
      <button onClick={handleDelete}>Delete Case</button>
    </>
  );
}
\`\`\`

### Custom Duration

\`\`\`tsx
showToast({
  type: 'success',
  title: 'Success!',
  message: 'Operation completed.',
  duration: 5000, // 5 seconds
});
\`\`\`

## Component API

See `types.ts` for the full component API.

### Toast Props

- `id` (string, required): Unique identifier for the toast
- `type` ('success' | 'deleted', default: 'success'): Toast type
- `title` (string, required): Toast heading
- `message` (string, required): Toast description
- `queuePosition` (string, optional): Queue position indicator (e.g., "1/3")
- `onDismiss` (function, optional): Callback when dismissed
- `duration` (number, default: 4000): Auto-dismiss duration in milliseconds
- `className` (string, optional): Additional CSS classes

### useToast Hook

Returns an object with:
- `showToast(toast)`: Add a toast to the queue
- `dismissToast(id)`: Remove a specific toast
- `toasts`: Array of active toasts in queue

## Design Specifications

Based on Jira ticket DRIOT-17:

- **Success Toast**: Toast emoji 🍞, pink sparkles ✨, "Success! Enjoy your buttery toast!" title
- **Deleted Toast**: Trash icon, coral/red color, "Deleted" heading with case name in quotes
- **Queue System**: FIFO with max 5 toasts, counter display when multiple exist
- **Positioning**: Bottom-center, maintains position across desktop and mobile
- **Auto-Dismiss**: 3-5 seconds industry standard (4 seconds implemented)
- **Manual Dismiss**: Outline button with "Dismiss" label
- **Animation**: Counter-clockwise swirl on entrance, pink sparkles for success
- **Z-Index**: High enough to render above all UI elements (z-[9999])

## Accessibility

- `role="alert"` for screen reader announcements
- `aria-live="polite"` for non-intrusive announcements
- `aria-label` on dismiss button
- Keyboard accessible dismiss button
